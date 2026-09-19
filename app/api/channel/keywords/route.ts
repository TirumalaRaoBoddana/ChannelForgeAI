import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { keywordToolSchema, keywordsOnlySchema } from "@/lib/validation/schemas";
import { KEYWORDS_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { detectNiche } from "@/lib/ai/demo/niches";
import { persist } from "@/lib/db";
import { findOwnedProject } from "@/lib/images/routes";
import { z } from "zod";

// keywordGenerationService (spec §23). Two modes:
//  - standalone tool: { niche, language } → returns keywords (unchanged)
//  - staged project:  { projectId } → derives niche from the project and
//    persists the result to project.keywords.
// KeywordService note: keywords are labelled "AI suggested". Verified search
// data requires an external keyword provider (KeywordService extension point);
// we never present AI output as live volume data.
const projectModeSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const body = await req.json().catch(() => null);
  const projectMode = projectModeSchema.safeParse(body);

  let project = null as ReturnType<typeof findOwnedProject>;
  let nicheArg = "";
  if (projectMode.success) {
    project = findOwnedProject(projectMode.data.projectId, idn);
    if (!project) return fail("NOT_FOUND", "Project not found.", 404);
    if (!project.brandIdentity) return fail("NO_BRAND", "Choose a channel name and colors first.", 400);
    nicheArg = `${project.brandIdentity.niche} — ${project.idea}` + (project.input.language ? ` (language: ${project.input.language})` : "");
  } else {
    const parsed = keywordToolSchema.safeParse(body);
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);
    nicheArg = parsed.data.niche + (parsed.data.language ? ` (language: ${parsed.data.language})` : "");
  }

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  try {
    const result = await runStructuredText({
      system: KEYWORDS_PROMPT.system,
      user: KEYWORDS_PROMPT.user(nicheArg),
      schema: keywordsOnlySchema,
      requestType: "channel_keywords",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });
    if (project) {
      project.keywords = result.data.channel_keywords;
      project.updatedAt = new Date().toISOString();
      persist();
    }
    return ok({ ...result.data, source: "ai" as const, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", "Keyword generation failed. Please try again.", 502);
    return fail("GENERATION_FAILED", "Keyword generation failed. Please try again.", 500);
  }
}
