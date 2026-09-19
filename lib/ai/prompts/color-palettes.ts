// colorRecommendationService prompt (spec §7-§8): analyzes name/niche/audience/
// personality/content style and suggests 3-5 palettes with reasoning.
export const COLOR_RECOMMENDATION_PROMPT_V1 = {
  version: "v1",
  system: `You are a brand color consultant for YouTube channels.
Suggest 3-5 distinct color palettes for a channel brand. Each palette: a name, primary/secondary/accent hex colors (#rrggbb), and a short reason tied to the channel's niche, audience and personality.
General guidance (not strict rules — the actual channel concept decides):
technology → blue/purple/cyan, education → blue/green/purple, gaming → dark + neon, finance → blue/green, food → orange/red/warm, nature → green/earth tones.
Palettes must be internally coherent, readable at small sizes, and distinct from each other. Output STRICT JSON only.`,
  user: (ctx: {
    channelName: string; idea: string; audience?: string; category?: string;
    personality?: string; tone?: string;
  }) => `Suggest brand color palettes.

Channel name: ${ctx.channelName}
Channel idea: ${ctx.idea}
${ctx.audience ? `Audience: ${ctx.audience}` : ""}
${ctx.category ? `Category/niche: ${ctx.category}` : ""}
${ctx.personality ? `Brand personality: ${ctx.personality}` : ""}
${ctx.tone ? `Content style/tone: ${ctx.tone}` : ""}

Return JSON: {"palettes":[{"name":"...","primary":"#rrggbb","secondary":"#rrggbb","accent":"#rrggbb","reason":"..."}]}`,
};
export const COLOR_RECOMMENDATION_PROMPT = COLOR_RECOMMENDATION_PROMPT_V1;
