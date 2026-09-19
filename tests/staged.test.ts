import { describe, it, expect } from "vitest";
import { generateDemoNamesV2, generateDemoPalettes, generateDemoThumbnailGuide } from "../lib/ai/demo/services";
import { channelNamesV2Schema, palettesSchema, thumbnailGuideSchema, projectPatchSchema, assetSelectionSchema, channelIdeaSchema, ASSET_CHOICES } from "../lib/validation/schemas";

const IDEA = "A channel that explains quantum physics with simple kitchen experiments";

describe("demo names v2 (spec §5-§6)", () => {
  it("returns 10-20 schema-valid names with rationale, personality and tagline", () => {
    const out = generateDemoNamesV2({ idea: IDEA, generation: 1 });
    const parsed = channelNamesV2Schema.safeParse(out);
    expect(parsed.success).toBe(true);
    expect(out.channel_names.length).toBeGreaterThanOrEqual(10);
    expect(out.channel_names.length).toBeLessThanOrEqual(20);
    for (const n of out.channel_names) {
      expect(n.name.length).toBeGreaterThan(1);
      expect(n.rationale.length).toBeGreaterThan(4);
      expect(n.personality.length).toBeGreaterThan(2);
      expect(n.tagline.length).toBeGreaterThan(4);
    }
  });

  it("is deterministic for the same idea + generation", () => {
    const a = generateDemoNamesV2({ idea: IDEA, generation: 2 });
    const b = generateDemoNamesV2({ idea: IDEA, generation: 2 });
    expect(a.channel_names.map(n => n.name)).toEqual(b.channel_names.map(n => n.name));
  });

  it("produces different names on the next generation", () => {
    const a = generateDemoNamesV2({ idea: IDEA, generation: 1 });
    const b = generateDemoNamesV2({ idea: IDEA, generation: 2 });
    const aNames = new Set(a.channel_names.map(n => n.name));
    const overlap = b.channel_names.filter(n => aNames.has(n.name)).length;
    expect(overlap).toBeLessThan(b.channel_names.length); // not identical sets
  });

  it("avoids previously rejected names and still returns 10+ schema-valid names", () => {
    const first = generateDemoNamesV2({ idea: IDEA, generation: 1 });
    const rejected = first.channel_names.map(n => n.name);
    const second = generateDemoNamesV2({ idea: IDEA, generation: 2, previousNames: rejected });
    expect(second.channel_names.length).toBeGreaterThanOrEqual(10);
    expect(channelNamesV2Schema.safeParse(second).success).toBe(true);
    for (const n of second.channel_names) {
      expect(rejected.map(s => s.toLowerCase())).not.toContain(n.name.toLowerCase());
    }
  });

  it("survives a third generation avoiding 28 previous names", () => {
    const g1 = generateDemoNamesV2({ idea: IDEA, generation: 1 });
    const g2 = generateDemoNamesV2({ idea: IDEA, generation: 2, previousNames: g1.channel_names.map(n => n.name) });
    const avoid = [...g1.channel_names, ...g2.channel_names].map(n => n.name);
    const g3 = generateDemoNamesV2({ idea: IDEA, generation: 3, previousNames: avoid });
    expect(g3.channel_names.length).toBeGreaterThanOrEqual(10);
    expect(channelNamesV2Schema.safeParse(g3).success).toBe(true);
    const avoidLower = avoid.map(s => s.toLowerCase());
    for (const n of g3.channel_names) expect(avoidLower).not.toContain(n.name.toLowerCase());
  });
});

describe("demo palettes (spec §8-§9)", () => {
  it("returns 3-5 schema-valid palettes with hex colors", () => {
    const out = generateDemoPalettes({ idea: IDEA, channelName: "Quantum Kitchen" });
    const parsed = palettesSchema.safeParse(out);
    expect(parsed.success).toBe(true);
    expect(out.palettes.length).toBeGreaterThanOrEqual(3);
    expect(out.palettes.length).toBeLessThanOrEqual(5);
    for (const p of out.palettes) {
      expect(p.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.reason.length).toBeGreaterThan(9);
    }
  });

  it("gives distinct palettes", () => {
    const out = generateDemoPalettes({ idea: IDEA, channelName: "Quantum Kitchen" });
    const keys = new Set(out.palettes.map(p => `${p.primary}|${p.secondary}|${p.accent}`));
    expect(keys.size).toBe(out.palettes.length);
  });
});

describe("demo thumbnail guide (spec §10)", () => {
  it("matches the snake_case schema and includes do/avoid lists", () => {
    const out = generateDemoThumbnailGuide({ idea: IDEA, channelName: "Quantum Kitchen", colors: "#4f46e5, #111827, #f59e0b" });
    const parsed = thumbnailGuideSchema.safeParse(out);
    expect(parsed.success).toBe(true);
    expect(out.do_list.length).toBeGreaterThanOrEqual(3);
    expect(out.avoid_list.length).toBeGreaterThanOrEqual(2);
    expect(out.examples.length).toBeGreaterThanOrEqual(2);
  });
});

describe("projectPatchSchema (spec §7, §9, §12)", () => {
  it("accepts a selected name id", () => {
    expect(projectPatchSchema.safeParse({ selectedNameId: "nm_abc123" }).success).toBe(true);
  });
  it("accepts user colors with source", () => {
    const r = projectPatchSchema.safeParse({
      colors: { primary: "#4f46e5", secondary: "#111827", accent: "#f59e0b", paletteName: "My Palette", source: "user" },
    });
    expect(r.success).toBe(true);
  });
  it("accepts an explicit null paletteName (manual colors)", () => {
    const r = projectPatchSchema.safeParse({
      colors: { primary: "#4f46e5", secondary: "#111827", accent: "#f59e0b", paletteName: null, source: "user" },
    });
    expect(r.success).toBe(true);
  });
  it("rejects invalid hex colors", () => {
    const r = projectPatchSchema.safeParse({
      colors: { primary: "blue", secondary: "#111827", accent: "#f59e0b", source: "ai" },
    });
    expect(r.success).toBe(false);
  });
  it("rejects unknown asset choices", () => {
    expect(assetSelectionSchema.safeParse(["logo", "notAnAsset"]).success).toBe(false);
    expect(assetSelectionSchema.safeParse([...ASSET_CHOICES]).success).toBe(true);
  });
  it("accepts chosenAssets and stage", () => {
    const r = projectPatchSchema.safeParse({ chosenAssets: ["logo", "description"], stage: "generating" });
    expect(r.success).toBe(true);
  });
});

describe("channel idea schema — new staged fields", () => {
  it("accepts category and keywords", () => {
    const r = channelIdeaSchema.safeParse({ idea: IDEA, category: "Science & Technology", keywords: "physics, experiments" });
    expect(r.success).toBe(true);
  });
  it("rejects overlong category", () => {
    const r = channelIdeaSchema.safeParse({ idea: IDEA, category: "x".repeat(101) });
    expect(r.success).toBe(false);
  });
});
