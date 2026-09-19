import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { palettesSchema, type PalettesOutput } from "@/lib/validation/schemas";
import { COLOR_RECOMMENDATION_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { persist } from "@/lib/db";
import { newId } from "@/lib/utils/id";
import { track } from "@/lib/analytics";
import { logger } from "@/lib/utils/logger";
import { findOwnedProject } from "@/lib/images/routes";
import { z } from "zod";
import type { ColorPalette } from "@/lib/db/types";

// colorRecommendationService (spec §7-§8): analyzes the selected name, niche,
// audience, personality and content style, then suggests 3-5 palettes.
const reqSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const parsed = reqSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Please provide a project.", 400);

  const project = findOwnedProject(parsed.data.projectId, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);
  const selected = project.nameGenerations.flatMap(s => s.names).find(n => n.id === project.selectedNameId);
  if (!selected) return fail("NO_NAME_SELECTED", "Please select a channel name first.", 400);

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  try {
    const result = await runStructuredText<PalettesOutput>({
      system: COLOR_RECOMMENDATION_PROMPT.system,
      user: COLOR_RECOMMENDATION_PROMPT.user({
        channelName: selected.name,
        idea: project.idea,
        audience: project.input.targetAudience,
        category: project.input.category ?? project.input.contentType,
        personality: selected.personality,
        tone: project.input.personality,
      }),
      schema: palettesSchema,
      requestType: "color_recommendation",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });

    const palettes: ColorPalette[] = result.data.palettes.map(p => ({ id: newId("pal"), ...p }));
    project.palettes = palettes;
    project.updatedAt = new Date().toISOString();
    persist();
    track("colors_suggested", { userId: idn.user?.id ?? null, guestToken: idn.guestToken });
    return ok({ projectId: project.id, palettes, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", "We couldn't generate color suggestions right now. Please try again.", 502);
    logger.error("colors_failed", { error: String(e) });
    return fail("GENERATION_FAILED", "We couldn't generate color suggestions right now. Please try again.", 500);
  }
}
