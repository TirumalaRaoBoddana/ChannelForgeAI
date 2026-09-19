import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { thumbnailGuideSchema, type ThumbnailGuideOutput } from "@/lib/validation/schemas";
import { THUMBNAIL_GUIDE_PROMPT } from "@/lib/ai/prompts";
import { runStructuredText, GenerationFailure } from "@/lib/ai/service";
import { checkDailyQuota } from "@/lib/rate-limit";
import { persist } from "@/lib/db";
import { track } from "@/lib/analytics";
import { logger } from "@/lib/utils/logger";
import { findOwnedProject } from "@/lib/images/routes";
import { z } from "zod";

// thumbnailGuideService — generates the channel's thumbnail style guide from
// the shared brand identity (spec §10, §17).
const reqSchema = z.object({ projectId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const parsed = reqSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Please provide a project.", 400);

  const project = findOwnedProject(parsed.data.projectId, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);
  const bi = project.brandIdentity;
  if (!bi) return fail("NO_BRAND", "Choose a channel name and colors first.", 400);

  const quota = checkDailyQuota(idn.key, "text", idn.plan);
  if (!quota.allowed) return fail("QUOTA_EXCEEDED", "Daily generation limit reached. Try again tomorrow.", 429);

  try {
    const result = await runStructuredText<ThumbnailGuideOutput>({
      system: THUMBNAIL_GUIDE_PROMPT.system,
      user: THUMBNAIL_GUIDE_PROMPT.user({
        channelName: bi.channelName,
        idea: project.idea,
        audience: bi.audience,
        category: project.input.category ?? project.input.contentType,
        personality: bi.brandPersonality,
        colors: `${bi.primaryColor}, ${bi.secondaryColor}, ${bi.accentColor}`,
      }),
      schema: thumbnailGuideSchema,
      requestType: "thumbnail_guide",
      identity: { userId: idn.user?.id ?? null, guestToken: idn.guestToken },
    });

    project.thumbnailGuide = {
      style: result.data.style,
      layout: result.data.layout,
      typography: result.data.typography,
      doList: result.data.do_list,
      avoidList: result.data.avoid_list,
      examples: result.data.examples,
    };
    project.updatedAt = new Date().toISOString();
    persist();
    track("thumbnail_guide_generated", { userId: idn.user?.id ?? null, guestToken: idn.guestToken });
    return ok({ projectId: project.id, thumbnailGuide: project.thumbnailGuide, provider: result.provider, quota });
  } catch (e) {
    if (e instanceof GenerationFailure) return fail("GENERATION_FAILED", "Thumbnail guide generation failed. Please try again.", 502);
    logger.error("thumbnail_guide_failed", { error: String(e) });
    return fail("GENERATION_FAILED", "Thumbnail guide generation failed. Please try again.", 500);
  }
}
