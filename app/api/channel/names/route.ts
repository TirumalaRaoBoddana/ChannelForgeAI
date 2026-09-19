import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { channelIdeaSchema, channelNamesV2Schema, type ChannelNamesV2Output } from "@/lib/validation/schemas";
import { CHANNEL_NAMES_V2_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { collections, persist } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { track } from "@/lib/analytics";
import { logger } from "@/lib/utils/logger";
import { findOwnedProject } from "@/lib/images/routes";
import type { Project, NameGenerationSet, GeneratedChannelName } from "@/lib/db/types";
import { z } from "zod";

// channelNameService (spec §2-§4).
// Two modes:
//  1. No projectId → validates the idea input, CREATES the project (stage
//     "names") and generates the first name set.
//  2. projectId present → REGENERATE: same idea + preferences, avoids all
//     previously generated names, appends a new generation to history.
const regenSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const body = await req.json().catch(() => null);
  const regen = regenSchema.safeParse(body);

  // Validate + authorize BEFORE charging quota (a doomed request must not
  // burn the user's daily allowance).
  let project: Project | null = null;
  let input: z.infer<typeof channelIdeaSchema> | null = null;
  if (regen.success) {
    project = findOwnedProject(regen.data.projectId, idn);
    if (!project) return fail("NOT_FOUND", "Project not found.", 404);
    if (project.nameGenerations.length === 0) return fail("NO_NAMES", "This project has no name history to regenerate from.", 400);
  } else {
    const parsed = channelIdeaSchema.safeParse(body);
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Please check your input.", 400);
    input = parsed.data;
  }

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) {
    return fail("QUOTA_EXCEEDED", `You've used all ${quota.limit} free generations for today. ${idn.user ? "Upgrade to Pro for higher limits." : "Create a free account for more daily generations."}`, 429);
  }

  try {
    const previousNames = project
      ? project.nameGenerations.flatMap(s => s.names.map(n => n.name))
      : [];

    const result = await runStructuredText<ChannelNamesV2Output>({
      system: CHANNEL_NAMES_V2_PROMPT.system,
      user: CHANNEL_NAMES_V2_PROMPT.user({
        idea: (project?.idea ?? input!.idea),
        targetAudience: project?.input.targetAudience ?? input!.targetAudience,
        category: project?.input.category ?? input!.category,
        tone: project?.input.personality ?? input!.personality,
        language: project?.input.language ?? input!.language,
        keywords: project?.input.keywords ?? input!.keywords,
        previousNames,
      }),
      schema: channelNamesV2Schema,
      requestType: "channel_names",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });

    const now = new Date().toISOString();
    const names: GeneratedChannelName[] = result.data.channel_names.map(n => ({ id: newId("nm"), ...n }));

    if (project) {
      const generation = Math.max(...project.nameGenerations.map(s => s.generation), 0) + 1;
      const set: NameGenerationSet = { id: newId("ng"), generation, names, createdAt: now };
      project.nameGenerations.push(set);
      project.updatedAt = now;
      persist();
      track("channel_names_regenerated", { userId: idn.user?.id ?? null, guestToken: idn.guestToken }, { generation });
      return ok({ projectId: project.id, generation, names, provider: result.provider, quota });
    }

    // First generation → create the staged project.
    const newProject: Project = {
      id: newId("prj"), userId: idn.user?.id ?? null, guestToken: idn.user ? null : idn.guestToken,
      idea: input!.idea, input: (() => { const { idea: _idea, ...rest } = input!; return rest; })(),
      analysis: null,
      stage: "names",
      nameGenerations: [{ id: newId("ng"), generation: 1, names, createdAt: now }],
      selectedNameId: null, palettes: [], brandIdentity: null, chosenAssets: [],
      tagline: null, description: null, keywords: null, thumbnailGuide: null,
      status: "draft", createdAt: now, updatedAt: now,
    };
    collections.projects().push(newProject);
    persist();
    track("channel_names_generated", { userId: idn.user?.id ?? null, guestToken: idn.guestToken });
    return ok({ projectId: newProject.id, generation: 1, names, provider: result.provider, quota, guestToken: idn.guestToken });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", "We couldn't generate your channel names right now. Please try again.", 502);
    logger.error("channel_names_failed", { error: String(e) });
    return fail("GENERATION_FAILED", "We couldn't generate your channel names right now. Please try again.", 500);
  }
}
