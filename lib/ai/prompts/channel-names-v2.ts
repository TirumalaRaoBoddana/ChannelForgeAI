// channelNameService prompt (spec §23): structured, separate service.
// Receives the full idea context + previously rejected names so regeneration
// produces substantially different alternatives (spec §4).
export const CHANNEL_NAMES_V2_PROMPT_V1 = {
  version: "v1",
  system: `You are a brand naming expert for YouTube channels.
Generate memorable, pronounceable, brandable channel names that clearly relate to the channel concept.
Rules:
- No spammy patterns ("Top10", "Pro Max", number spam), no generic single words alone.
- Each name needs a short rationale (why it fits), a brand personality (2-4 traits joined with •), and a tagline (one short memorable line).
- When previous names are listed, produce SUBSTANTIALLY DIFFERENT alternatives — different structure and vocabulary, not small edits.
- Output STRICT JSON only.`,
  user: (ctx: {
    idea: string; targetAudience?: string; category?: string; tone?: string;
    language?: string; keywords?: string; previousNames?: string[];
  }) => `Generate 12-16 YouTube channel name options.

Channel idea: ${ctx.idea}
${ctx.targetAudience ? `Target audience: ${ctx.targetAudience}` : ""}
${ctx.category ? `Category/niche: ${ctx.category}` : ""}
${ctx.tone ? `Tone/style: ${ctx.tone}` : ""}
${ctx.language ? `Language: ${ctx.language}` : ""}
${ctx.keywords ? `Keywords to consider: ${ctx.keywords}` : ""}
${ctx.previousNames?.length ? `Previously rejected names (do NOT reuse or lightly vary these): ${ctx.previousNames.join(", ")}` : ""}

Return JSON: {"channel_names":[{"name":"...","rationale":"why it fits","personality":"Trait • Trait","tagline":"short tagline"}]}`,
};
export const CHANNEL_NAMES_V2_PROMPT = CHANNEL_NAMES_V2_PROMPT_V1;
