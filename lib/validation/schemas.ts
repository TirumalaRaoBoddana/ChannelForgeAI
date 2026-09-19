import { z } from "zod";

export const CONTENT_TYPES = ["Educational","Entertainment","Gaming","Technology","Finance","Fitness","Travel","Cooking","News","Storytelling","Kids","Faceless","Business","Personal Brand","Other"] as const;
export const PERSONALITIES = ["Professional","Friendly","Energetic","Educational","Funny","Inspirational","Minimal","Premium","Bold"] as const;
export const LANGUAGES = ["English","Hindi","Telugu","Tamil","Kannada","Malayalam","Bengali","Marathi","Spanish","Other"] as const;
export const LOGO_STYLES = ["Minimal","Modern","3D","Flat","Gaming","Educational","Luxury","Tech","Cartoon","Mascot","Typography","Abstract"] as const;

// Default values for the optional "Describe your channel" fields. The wizard
// displays these to the user and sends them explicitly; the server applies
// them here as well so EVERY API caller (tools, direct requests) guarantees
// the AI receives a complete brief.
export const IDEA_DEFAULTS = {
  targetAudience: "General YouTube audience",
  language: "English",
  country: "Worldwide",
  contentType: "Other",
  personality: "Friendly",
} as const;

// Blank ("" / null / missing) → default; anything else passes through to validation.
const orDefault = (def: string) => (v: unknown) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "") ? def : v;

export const channelIdeaSchema = z.object({
  idea: z.string().trim().min(8, "Tell us a little more about your channel idea (at least 8 characters).").max(500, "Please keep the idea under 500 characters."),
  targetAudience: z.preprocess(orDefault(IDEA_DEFAULTS.targetAudience), z.string().trim().max(200)),
  language: z.preprocess(orDefault(IDEA_DEFAULTS.language), z.enum(LANGUAGES)),
  country: z.preprocess(orDefault(IDEA_DEFAULTS.country), z.string().trim().max(100)),
  contentType: z.preprocess(orDefault(IDEA_DEFAULTS.contentType), z.enum(CONTENT_TYPES)),
  personality: z.preprocess(orDefault(IDEA_DEFAULTS.personality), z.enum(PERSONALITIES)),
  keywords: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.string().trim().max(100).optional().or(z.literal("")),
});
export type ChannelIdeaInput = z.infer<typeof channelIdeaSchema>;

// ── Staged wizard schemas (spec §3-§12) ──

export const channelNamesV2Schema = z.object({
  channel_names: z.array(z.object({
    name: z.string().min(2).max(60),
    rationale: z.string().min(5).max(240),
    personality: z.string().min(3).max(120),
    tagline: z.string().min(5).max(140),
  })).min(10).max(20),
});
export type ChannelNamesV2Output = z.infer<typeof channelNamesV2Schema>;

export const hexColor = z.string().regex(/^#([0-9a-fA-F]{6})$/, "Must be a 6-digit hex color");

export const palettesSchema = z.object({
  palettes: z.array(z.object({
    name: z.string().min(2).max(60),
    primary: hexColor,
    secondary: hexColor,
    accent: hexColor,
    reason: z.string().min(10).max(300),
  })).min(3).max(5),
});
export type PalettesOutput = z.infer<typeof palettesSchema>;

export const thumbnailGuideSchema = z.object({
  style: z.string().min(10).max(300),
  layout: z.string().min(10).max(300),
  typography: z.string().min(10).max(300),
  do_list: z.array(z.string().min(5).max(160)).min(3).max(8),
  avoid_list: z.array(z.string().min(5).max(160)).min(2).max(6),
  examples: z.array(z.object({ title: z.string().min(5).max(120), concept: z.string().min(10).max(300) })).min(2).max(5),
});
export type ThumbnailGuideOutput = z.infer<typeof thumbnailGuideSchema>;

export const ASSET_CHOICES = ["logo","banner","watermark","description","keywords","tagline","palette","thumbnailGuide"] as const;
export type AssetChoiceInput = typeof ASSET_CHOICES[number];
export const assetSelectionSchema = z.array(z.enum(ASSET_CHOICES)).max(ASSET_CHOICES.length);

// PATCH /api/projects/[id] — staged wizard state updates.
export const projectPatchSchema = z.object({
  selectedNameId: z.string().min(1).max(40).optional(),
  tagline: z.string().trim().max(140).optional(),
  colors: z.object({
    primary: hexColor, secondary: hexColor, accent: hexColor,
    paletteName: z.string().max(60).nullish(),
    source: z.enum(["user","ai"]),
  }).optional(),
  typographyStyle: z.string().trim().max(80).optional(),
  iconStyle: z.string().trim().max(80).optional(),
  logoStyle: z.enum(LOGO_STYLES).optional(),
  chosenAssets: assetSelectionSchema.optional(),
  stage: z.enum(["names","colors","assets","generating","complete"]).optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Nothing to update." });


// ── Structured AI output schemas (Zod) ──
export const ideaSchema = z.object({
  title: z.string().min(3).max(120),
  hook: z.string().min(3).max(300),
  target_keyword: z.string().min(2).max(100),
  difficulty: z.string().min(1).max(30),
  content_pillar: z.string().min(1).max(80),
});

export const channelAnalysisSchema = z.object({
  channel_positioning: z.string().min(20).max(800),
  target_audience: z.string().min(5).max(400),
  content_pillars: z.array(z.object({ name: z.string().min(2).max(60), description: z.string().min(5).max(300) })).min(3).max(7),
  channel_names: z.array(z.object({ name: z.string().min(2).max(60), rationale: z.string().min(2).max(240) })).min(10).max(20),
  channel_description: z.object({ short: z.string().min(20).max(300), seo: z.string().min(80).max(1200) }),
  channel_keywords: z.array(z.object({ category: z.string().min(2).max(60), keywords: z.array(z.string().min(2).max(60)).min(3).max(15) })).min(3).max(6),
  seo_keywords: z.object({
    primary: z.array(z.string().min(2).max(60)).min(3).max(10),
    secondary: z.array(z.string().min(2).max(60)).min(3).max(15),
    long_tail: z.array(z.string().min(5).max(90)).min(3).max(15),
  }),
  brand_personality: z.string().min(5).max(300),
  visual_style: z.string().min(5).max(300),
  color_palette: z.array(z.object({ name: z.string().min(2).max(40), hex: hexColor, usage: z.string().min(2).max(120) })).min(3).max(6),
  font_recommendations: z.array(z.object({ name: z.string().min(2).max(60), usage: z.string().min(2).max(120), fallback: z.string().min(2).max(60) })).min(1).max(4),
  tagline: z.string().min(5).max(120),
  video_ideas: z.array(ideaSchema).min(10).max(20),
  shorts_ideas: z.array(ideaSchema).min(10).max(20),
  niche: z.string().min(2).max(60),
});
export type ChannelAnalysisOutput = z.infer<typeof channelAnalysisSchema>;

export const namesOnlySchema = z.object({
  channel_names: z.array(z.object({ name: z.string().min(2).max(60), rationale: z.string().min(2).max(240) })).min(10).max(20),
});

export const descriptionOnlySchema = z.object({
  channel_description: z.object({ short: z.string().min(20).max(300), seo: z.string().min(80).max(1200) }),
});

export const keywordsOnlySchema = z.object({
  channel_keywords: z.array(z.object({ category: z.string().min(2).max(60), keywords: z.array(z.string().min(2).max(60)).min(3).max(15) })).min(3).max(6),
  seo_keywords: z.object({
    primary: z.array(z.string().min(2).max(60)).min(3).max(10),
    secondary: z.array(z.string().min(2).max(60)).min(3).max(15),
    long_tail: z.array(z.string().min(5).max(90)).min(3).max(15),
  }),
});

export const videoIdeasOnlySchema = z.object({
  video_ideas: z.array(ideaSchema).min(10).max(20),
  shorts_ideas: z.array(ideaSchema).min(10).max(20),
});

// ── Image generation inputs ──
export const brandBriefSchema = z.object({
  brand_name: z.string().min(1).max(60),
  visual_identity: z.string().min(3).max(300),
  style: z.enum(LOGO_STYLES),
  colors: z.array(hexColor).min(1).max(6),
  symbols: z.array(z.string().min(1).max(40)).max(8).default([]),
  avoid: z.array(z.string().min(1).max(60)).max(8).default([]),
});
export type BrandBrief = z.infer<typeof brandBriefSchema>;

export const logoRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  style: z.enum(LOGO_STYLES).optional(),
  regenerate: z.boolean().optional(),
});

export const bannerRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  tagline: z.string().max(120).optional(),
  uploadSchedule: z.string().max(80).optional(),
  regenerate: z.boolean().optional(),
});

export const watermarkRequestSchema = z.object({
  projectId: z.string().min(1).max(64),
  kind: z.enum(["logo", "initials", "icon"]).default("initials"),
  regenerate: z.boolean().optional(),
});

// standalone tool pages
export const logoToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  niche: z.string().trim().min(2).max(120),
  style: z.enum(LOGO_STYLES).default("Modern"),
  colorPreference: hexColor.optional(),
});
export const bannerToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  tagline: z.string().trim().max(120).default(""),
  niche: z.string().trim().min(2).max(120),
  colorPreference: hexColor.optional(),
});
export const watermarkToolSchema = z.object({
  channelName: z.string().trim().min(2).max(60),
  kind: z.enum(["initials", "icon"]).default("initials"),
  colorPreference: hexColor.optional(),
});
export const keywordToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  language: z.enum(LANGUAGES).optional(),
});
export const nameToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  personality: z.enum(PERSONALITIES).optional(),
});
export const videoIdeaToolSchema = z.object({
  niche: z.string().trim().min(2).max(200),
  contentType: z.enum(CONTENT_TYPES).optional(),
});

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  name: z.string().trim().min(1).max(80),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

// ── Basic content-safety screen (layer 1; providers add layer 2) ──
const BLOCKED = ["child porn", "csam", "terrorist recruit", "how to make a bomb", "buy illegal", "sell drugs"];
export function isSafePrompt(text: string): boolean {
  const t = text.toLowerCase();
  return !BLOCKED.some(b => t.includes(b));
}
