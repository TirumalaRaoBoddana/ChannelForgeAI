import { describe, it, expect } from "vitest";
import { channelIdeaSchema, channelAnalysisSchema, logoToolSchema, registerSchema, isSafePrompt, IDEA_DEFAULTS } from "../lib/validation/schemas";
import { CHANNEL_ANALYSIS_PROMPT } from "../lib/ai/prompts";
import { generateDemoAnalysis } from "../lib/ai/demo/generator";
import { extractJson } from "../lib/ai/json-repair";

describe("input validation", () => {
  it("rejects ideas that are too short", () => {
    expect(channelIdeaSchema.safeParse({ idea: "hi" }).success).toBe(false);
  });
  it("accepts a valid idea with optional fields", () => {
    const r = channelIdeaSchema.safeParse({ idea: "AI and math for beginners", language: "Telugu", personality: "Friendly" });
    expect(r.success).toBe(true);
  });
  it("rejects invalid enum values", () => {
    expect(channelIdeaSchema.safeParse({ idea: "a valid long idea", personality: "Evil" }).success).toBe(false);
  });
  it("requires strong passwords", () => {
    expect(registerSchema.safeParse({ email: "a@b.com", password: "short", name: "A" }).success).toBe(false);
    expect(registerSchema.safeParse({ email: "a@b.com", password: "longenough1", name: "A" }).success).toBe(true);
  });
});

describe("demo engine output passes the Zod schema (AI output contract)", () => {
  it("full analysis validates", () => {
    const out = generateDemoAnalysis({ idea: "explain AI and mathematics to beginners" });
    const r = channelAnalysisSchema.safeParse(out);
    expect(r.success).toBe(true);
    if (!r.success) console.error(r.error.issues);
  });
  it("is deterministic for the same idea", () => {
    const a = generateDemoAnalysis({ idea: "gaming channel about indie platformers" });
    const b = generateDemoAnalysis({ idea: "gaming channel about indie platformers" });
    expect(a.channel_names[0].name).toBe(b.channel_names[0].name);
  });
  it("produces niche-specific (not generic) names", () => {
    const ai = generateDemoAnalysis({ idea: "explaining neural networks visually" });
    const cook = generateDemoAnalysis({ idea: "15 minute dinners for students" });
    expect(ai.channel_names[0].name).not.toBe(cook.channel_names[0].name);
    expect(ai.niche).toBe("ai-math");
    expect(cook.niche).toBe("cooking");
  });
  it("logo tool schema validates hex colors only", () => {
    expect(logoToolSchema.safeParse({ channelName: "XY", niche: "ai", colorPreference: "not-a-color" }).success).toBe(false);
    expect(logoToolSchema.safeParse({ channelName: "XY", niche: "ai", colorPreference: "#4f46e5" }).success).toBe(true);
  });
});

describe("JSON extraction & repair path", () => {
  it("extracts JSON from fenced code blocks", () => {
    const r = extractJson('Sure! Here you go:\n```json\n{"a":1}\n```\nHope that helps');
    expect(r).toEqual({ a: 1 });
  });
  it("extracts JSON surrounded by prose", () => {
    const r = extractJson('Blah blah {"b": [1,2]} trailing');
    expect(r).toEqual({ b: [1, 2] });
  });
  it("throws on non-JSON", () => {
    expect(() => extractJson("no json here")).toThrow();
  });
});

describe("content safety", () => {
  it("blocks disallowed prompts", () => {
    expect(isSafePrompt("how to make a bomb at home")).toBe(false);
  });
  it("allows normal channel ideas", () => {
    expect(isSafePrompt("a channel about bread baking")).toBe(true);
  });
});

describe("niche detection regression", () => {
  it("does not let 'ai' match inside 'explaining' (word-boundary matching)", () => {
    const out = generateDemoAnalysis({ idea: "A channel explaining stock market basics to college students in simple Telugu" });
    expect(out.niche).toBe("finance");
  });
  it("still detects AI channels from a real 'AI' mention", () => {
    const out = generateDemoAnalysis({ idea: "explaining AI and mathematics to beginners" });
    expect(out.niche).toBe("ai-math");
  });
  it("handles plurals and inflections", () => {
    expect(generateDemoAnalysis({ idea: "15 minute dinners for busy students" }).niche).toBe("cooking");
    expect(generateDemoAnalysis({ idea: "gaming channel about indie platformers" }).niche).toBe("gaming");
  });
});

describe("demo engine schema validity across niches", () => {
  const IDEAS = [
    "A cozy miniature model painting channel with timelapse builds",
    "explaining AI and mathematics to beginners",
    "gaming channel about indie platformers",
    "15 minute dinners for busy students",
    "budget travel in South India",
    "personal finance for first-job earners",
    "home workouts without equipment",
    "untold history stories with voiceover",
    "coding projects built in public",
    "study techniques for exam season",
    "nursery rhymes and learning songs for toddlers",
    "faceless documentary channel about business failures",
    "a channel about something totally unusual like competitive paper folding",
  ];
  it.each(IDEAS)("produces schema-valid analysis for: %s", (idea) => {
    const out = generateDemoAnalysis({ idea });
    const r = channelAnalysisSchema.safeParse(out);
    expect(r.success).toBe(true);
  });
});

describe("optional-field defaults (sent to the AI when the user skips them)", () => {
  const IDEA = "a channel reviewing budget smartphones for college students";

  it("applies every default when only the idea is provided", () => {
    const r = channelIdeaSchema.safeParse({ idea: IDEA });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.targetAudience).toBe(IDEA_DEFAULTS.targetAudience);
    expect(r.data.language).toBe(IDEA_DEFAULTS.language);
    expect(r.data.country).toBe(IDEA_DEFAULTS.country);
    expect(r.data.contentType).toBe(IDEA_DEFAULTS.contentType);
    expect(r.data.personality).toBe(IDEA_DEFAULTS.personality);
  });

  it("treats blank strings as unselected and applies defaults", () => {
    const r = channelIdeaSchema.safeParse({
      idea: IDEA, targetAudience: "  ", language: "", country: "", contentType: "", personality: "",
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.targetAudience).toBe(IDEA_DEFAULTS.targetAudience);
    expect(r.data.language).toBe(IDEA_DEFAULTS.language);
    expect(r.data.country).toBe(IDEA_DEFAULTS.country);
    expect(r.data.contentType).toBe(IDEA_DEFAULTS.contentType);
    expect(r.data.personality).toBe(IDEA_DEFAULTS.personality);
  });

  it("keeps explicit user choices over defaults", () => {
    const r = channelIdeaSchema.safeParse({
      idea: IDEA, targetAudience: "busy parents", language: "Hindi", country: "India",
      contentType: "Technology", personality: "Energetic",
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data).toMatchObject({
      targetAudience: "busy parents", language: "Hindi", country: "India",
      contentType: "Technology", personality: "Energetic",
    });
  });

  it("every defaulted field reaches the AI prompt", () => {
    const r = channelIdeaSchema.safeParse({ idea: IDEA });
    expect(r.success).toBe(true);
    if (!r.success) return;
    const prompt = CHANNEL_ANALYSIS_PROMPT.user(r.data);
    expect(prompt).toContain(`Target audience: ${IDEA_DEFAULTS.targetAudience}`);
    expect(prompt).toContain(`Primary language: ${IDEA_DEFAULTS.language}`);
    expect(prompt).toContain(`Country/region: ${IDEA_DEFAULTS.country}`);
    expect(prompt).toContain(`Content type: ${IDEA_DEFAULTS.contentType}`);
    expect(prompt).toContain(`Channel personality: ${IDEA_DEFAULTS.personality}`);
  });
});
