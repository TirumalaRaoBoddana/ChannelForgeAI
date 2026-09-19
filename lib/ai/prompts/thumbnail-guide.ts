// thumbnailGuideService prompt: a text asset describing the channel's
// thumbnail style guide, consistent with the shared brand identity (spec §10).
export const THUMBNAIL_GUIDE_PROMPT_V1 = {
  version: "v1",
  system: `You are a YouTube thumbnail design director.
Create a practical thumbnail style guide for a channel: overall style, layout rules, typography treatment, a do-list, an avoid-list, and 2-5 concrete example thumbnail concepts for real video titles.
Keep it consistent with the channel's brand colors, personality and niche. Output STRICT JSON only.`,
  user: (ctx: {
    channelName: string; idea: string; audience?: string; category?: string;
    personality?: string; colors?: string;
  }) => `Create a thumbnail style guide.

Channel name: ${ctx.channelName}
Channel idea: ${ctx.idea}
${ctx.audience ? `Audience: ${ctx.audience}` : ""}
${ctx.category ? `Category/niche: ${ctx.category}` : ""}
${ctx.personality ? `Brand personality: ${ctx.personality}` : ""}
${ctx.colors ? `Brand colors: ${ctx.colors}` : ""}

Return JSON: {"style":"...","layout":"...","typography":"...","do_list":["..."],"avoid_list":["..."],"examples":[{"title":"video title","concept":"thumbnail concept"}]}`,
};
export const THUMBNAIL_GUIDE_PROMPT = THUMBNAIL_GUIDE_PROMPT_V1;
