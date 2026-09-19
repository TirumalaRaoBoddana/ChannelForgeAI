import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { channelIdeaSchema, descriptionOnlySchema } from "@/lib/validation/schemas";
import { DESCRIPTION_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { generateDemoAnalysis } from "@/lib/ai/demo/generator";
import { detectNiche } from "@/lib/ai/demo/niches";
import { persist } from "@/lib/db";
import { findOwnedProject } from "@/lib/images/routes";
import { z } from "zod";

// descriptionGenerationService (spec §23). Two modes:
//  - standalone tool: { idea, ... } → returns description (unchanged behavior)
//  - staged project:  { projectId } → derives context from the project's brand
//    identity and persists the result to the project.
const projectModeSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const body = await req.json().catch(() => null);
  const projectMode = projectModeSchema.safeParse(body);

  let project = null as ReturnType<typeof findOwnedProject>;
  let parsed = null as z.infer<typeof channelIdeaSchema> | null;
  if (projectMode.success) {
    project = findOwnedProject(projectMode.data.projectId, idn);
    if (!project) return fail("NOT_FOUND", "Project not found.", 404);
    if (!project.brandIdentity) return fail("NO_BRAND", "Choose a channel name and colors first.", 400);
  } else {
    const p = channelIdeaSchema.safeParse(body);
    if (!p.success) return fail("VALIDATION_ERROR", p.error.issues[0]?.message ?? "Invalid input.", 400);
    parsed = p.data;
  }

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  // Derive context from the submitted idea itself (never from unrelated prior
  // projects). The demo engine is a local, zero-cost way to get a niche-fit
  // name + pillars that the description prompt weaves in.
  const idea = project ? project.idea : parsed!.idea;
  const ctx = generateDemoAnalysis({ idea });
  const names = project ? project.brandIdentity!.channelName : ctx.channel_names[0]?.name;
  const pillars = ctx.content_pillars.map(p => p.name).join(", ");

  try {
    const result = await runStructuredText({
      system: DESCRIPTION_PROMPT.system,
      user: DESCRIPTION_PROMPT.user(idea, names, pillars),
      schema: descriptionOnlySchema,
      requestType: "channel_description",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });
    if (project) {
      project.description = result.data.channel_description;
      project.updatedAt = new Date().toISOString();
      persist();
    }
    return ok({ ...result.data, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", "Description generation failed. Please try again.", 502);
    return fail("GENERATION_FAILED", "Description generation failed. Please try again.", 500);
  }
}
