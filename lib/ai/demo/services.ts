import type { ChannelNamesV2Output, PalettesOutput, ThumbnailGuideOutput } from "../../validation/schemas";
import { paletteFor } from "../../utils/colors";
import { detectNiche, type NicheProfile } from "./niches";

// Deterministic demo implementations of the staged-flow services
// (channelNameService / colorRecommendationService / thumbnailGuideService).
// Same contract as the AI prompts; used when no API key is configured.

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(r: () => number, arr: T[]): T { return arr[Math.floor(r() * arr.length) % arr.length]; }
function shuffle<T>(r: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function titleCase(s: string) { return s.replace(/\b\w/g, c => c.toUpperCase()); }

const ADJECTIVES = ["Clear", "Bright", "Sharp", "Daily", "Prime", "Honest", "Simple", "Curious", "Bold", "Steady", "Open", "Vivid", "Keen", "Lucid"];
const PERSONA_TRAITS = ["Modern", "Educational", "Technical", "Friendly", "Energetic", "Minimal", "Premium", "Playful", "Focused", "Practical"];
const TAGLINE_SHAPES = [
  (t: string) => `Understand ${t}, not just use it.`,
  (t: string) => `${titleCase(t)}, explained properly.`,
  (t: string) => `One ${t} idea at a time.`,
  (t: string) => `Your shortcut to real ${t} skills.`,
  (t: string) => `${titleCase(t)} without the fluff.`,
  (t: string) => `Learn ${t} the way it clicks.`,
];

export interface DemoNamesV2Input {
  idea: string;
  targetAudience?: string;
  category?: string;
  tone?: string;
  language?: string;
  keywords?: string;
  generation?: number;      // seeds variation between regenerations
  previousNames?: string[]; // avoided on regeneration (spec §4)
}

export function generateDemoNamesV2(input: DemoNamesV2Input): ChannelNamesV2Output {
  const gen = Math.max(1, input.generation ?? 1);
  const seed = hash(`${input.idea.toLowerCase().trim()}::${gen}`);
  const r = mulberry(seed);
  const niche = detectNiche(input.idea);
  const avoid = new Set((input.previousNames ?? []).map(n => n.toLowerCase()));

  const usedNouns = shuffle(r, niche.nouns);
  const names: ChannelNamesV2Output["channel_names"] = [];
  const seen = new Set<string>();
  const topic = niche.topics[gen % niche.topics.length];
  const topicWord = titleCase(topic.split(" ")[0]);
  const adjs = shuffle(r, ADJECTIVES);
  // Sweep the full pattern × noun × adjective space (hundreds of combos) so
  // regeneration can avoid every previous name and still hit the schema
  // minimum of 10 fresh names.
  const total = niche.namePatterns.length * usedNouns.length * adjs.length;
  for (let i = 0; i < total && names.length < 14; i++) {
    const pattern = niche.namePatterns[(i + gen) % niche.namePatterns.length];
    const noun = usedNouns[(i * 3 + gen) % usedNouns.length];
    const adj = adjs[(Math.floor(i / usedNouns.length) + gen) % adjs.length];
    let name = pattern.replace("{N}", noun).replace("{A}", adj).replace("{T}", topicWord).replace(/\s+/g, "");
    if (name.length < 4 || name.length > 24) continue;
    if (/^(\w+?)\1$/i.test(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key) || avoid.has(key)) continue;
    seen.add(key);
    const traits = shuffle(r, PERSONA_TRAITS).slice(0, 2 + (i % 2));
    names.push({
      name,
      rationale: [
        `Combines a memorable brand word with a clear ${niche.label.toLowerCase()} signal.`,
        `Short and pronounceable — works as a handle (@${key}) and as a small circular avatar.`,
        `Sounds like a media brand rather than a username; room to grow beyond one series.`,
        `Distinctive in search: unlikely to collide with generic ${niche.label.toLowerCase()} terms.`,
        `Hints at the promise of the channel — ${input.targetAudience ? `speaks directly to ${input.targetAudience.split(",")[0].trim()}` : "clear value for new viewers"}.`,
      ][i % 5],
      personality: traits.join(" • "),
      tagline: TAGLINE_SHAPES[(seed + i) % TAGLINE_SHAPES.length](topic),
    });
  }
  return { channel_names: names };
}

export interface DemoPalettesInput {
  channelName: string;
  idea: string;
  audience?: string;
  category?: string;
  personality?: string;
  tone?: string;
}

const PALETTE_VARIANTS: Record<string, { name: string; colors: [string, string, string]; reason: string }[]> = {
  ai: [
    { name: "Modern AI", colors: ["#6C63FF", "#111827", "#22D3EE"], reason: "Electric indigo + deep navy + cyan reads as modern technology — trustworthy for educational AI content." },
    { name: "Neural Dawn", colors: ["#8B5CF6", "#1E1B4B", "#F472B6"], reason: "Violet-led palette feels intelligent and slightly futuristic while staying friendly for beginners." },
    { name: "Lab Clean", colors: ["#2563EB", "#0F172A", "#38BDF8"], reason: "Classic blue family signals clarity and precision — great contrast for formula and diagram overlays." },
  ],
  education: [
    { name: "Classroom Trust", colors: ["#4338CA", "#14532D", "#F59E0B"], reason: "Blue + green + amber is the classic education triad: calm, growth, attention." },
    { name: "Study Fresh", colors: ["#0EA5E9", "#166534", "#FACC15"], reason: "Bright and legible at thumbnail size; green keeps the tone encouraging." },
    { name: "Scholar Minimal", colors: ["#4F46E5", "#111827", "#F8FAFC"], reason: "High-contrast minimal palette that keeps focus on the lesson, not the decoration." },
  ],
  gaming: [
    { name: "Neon Arcade", colors: ["#7C3AED", "#0F172A", "#22D3EE"], reason: "Dark base with neon purple/cyan is instantly readable as gaming branding." },
    { name: "Boss Fight", colors: ["#EC4899", "#111827", "#A3E635"], reason: "High-energy magenta + lime on near-black pops in feeds and small avatars." },
    { name: "Retro Play", colors: ["#F59E0B", "#7C2D12", "#38BDF8"], reason: "Warm retro tones evoke classic gaming while staying distinct from typical neon." },
  ],
  finance: [
    { name: "Market Calm", colors: ["#0F766E", "#064E3B", "#EAB308"], reason: "Teal/green signals growth and money; gold adds a premium accent for numbers." },
    { name: "Trust Blue", colors: ["#1D4ED8", "#0F172A", "#22C55E"], reason: "Blue = trust for money content, green confirms positive outcomes." },
    { name: "Compound", colors: ["#059669", "#111827", "#F59E0B"], reason: "Deep green + amber reads as serious-but-approachable personal finance." },
  ],
  cooking: [
    { name: "Warm Kitchen", colors: ["#EA580C", "#7C2D12", "#FDE68A"], reason: "Warm orange/red tones stimulate appetite and feel homemade." },
    { name: "Fresh Market", colors: ["#DC2626", "#166534", "#FEF3C7"], reason: "Produce-market reds and greens signal fresh ingredients." },
    { name: "Street Food", colors: ["#F59E0B", "#9A3412", "#FFFBEB"], reason: "Golden amber + spice brown evokes street-food energy and warmth." },
  ],
  travel: [
    { name: "Open Sky", colors: ["#0284C7", "#0F766E", "#F59E0B"], reason: "Sky blue + teal + sunset amber captures open-road optimism." },
    { name: "Wander Warm", colors: ["#14B8A6", "#78350F", "#FDE68A"], reason: "Lagoon teal with earthy warmth balances adventure and comfort." },
    { name: "Passport", colors: ["#1E3A8A", "#B45309", "#F0F9FF"], reason: "Deep navy + stamp-ink amber feels like classic travel documentation." },
  ],
  default: [
    { name: "Brand Core", colors: ["#4F46E5", "#111827", "#F59E0B"], reason: "Indigo + charcoal + amber is a versatile, high-contrast identity that suits most niches." },
    { name: "Clean Signal", colors: ["#2563EB", "#0F172A", "#22D3EE"], reason: "Blue family with cyan accent reads modern, clean and technical." },
    { name: "Warm Contrast", colors: ["#DB2777", "#1F2937", "#FBBF24"], reason: "Magenta + gold on charcoal stands out in crowded feeds while staying professional." },
  ],
};

export function generateDemoPalettes(input: DemoPalettesInput): PalettesOutput {
  const niche = detectNiche(input.idea);
  const variants = PALETTE_VARIANTS[niche.key] ?? PALETTE_VARIANTS.default;
  const seed = hash(`${input.channelName.toLowerCase()}::${input.idea.toLowerCase()}`);
  const r = mulberry(seed);
  const chosen = shuffle(r, variants).slice(0, 3);
  // Guarantee a fourth distinct option built from the niche base palette.
  const base = paletteFor(niche.key);
  chosen.push({
    name: `${titleCase(niche.label)} Signature`,
    colors: [base[0], base[1], base[2]] as [string, string, string],
    reason: `Drawn from the core ${niche.label.toLowerCase()} identity — ${input.personality ? `matches the ${input.personality.toLowerCase()} personality` : "balanced for this niche"}.`,
  });
  return {
    palettes: chosen.map(p => ({
      name: p.name, primary: p.colors[0], secondary: p.colors[1], accent: p.colors[2], reason: p.reason,
    })),
  };
}

export function generateDemoThumbnailGuide(input: DemoPalettesInput & { colors?: string }): ThumbnailGuideOutput {
  const niche = detectNiche(input.idea);
  const seed = hash(input.channelName.toLowerCase());
  const r = mulberry(seed);
  const topics = shuffle(r, niche.topics).slice(0, 3);
  return {
    style: `${pick(r, ["Bold and high-contrast", "Clean and editorial", "Vivid and expressive"])} thumbnails in the ${input.channelName} brand palette${input.colors ? ` (${input.colors})` : ""}. One clear focal subject, minimal clutter, instantly readable at mobile size.`,
    layout: `Rule of thirds with the focal subject left-of-center; short title text right or bottom in a solid contrast block. Keep the outer 8% free of critical detail (mobile cropping). Faces or hero objects larger than feels natural — thumbnails render small.`,
    typography: `Heavy sans-serif (700-900 weight), max 4-5 words, sentence-case or ALL-CAPS for emphasis words only. White or accent-colored text on a dark scrim when placed over imagery; never thin fonts.`,
    do_list: [
      `Use the brand accent color for emphasis words so thumbnails are recognizable as ${input.channelName} at a glance.`,
      "Test every thumbnail at 120px wide — if you can't read it, redesign it.",
      "Keep one emotion or question per thumbnail; curiosity beats summary.",
      `Stay consistent: same font family and color language across all ${niche.label.toLowerCase()} videos.`,
      "Show the payoff (result, transformation, answer-hint), not just the topic.",
    ],
    avoid_list: [
      "No clickbait that the video doesn't deliver — it kills retention and trust.",
      "Avoid more than two fonts or rainbow color noise.",
      "Don't put critical text or faces in the bottom-right corner (timestamp overlay).",
      "Skip stock-photo stiffness; genuine expressions outperform posed shots.",
    ],
    examples: [
      { title: `${titleCase(topics[0])} Explained in 10 Minutes`, concept: `Split frame: confused face left, glowing '${titleCase(topics[0])}' diagram right; big amber '10 MIN' badge; dark scrim + white heavy type.` },
      { title: `5 ${titleCase(topics[1])} Mistakes Beginners Make`, concept: `Numbered '5' as the hero element in accent color; mistake icons around it; red cross accents; title in two-line heavy sans.` },
      { title: `I Tried ${titleCase(topics[2])} for 30 Days`, concept: `Before/after split with day counter; genuine reaction face; accent-color '30 DAYS' ribbon; minimal background blur.` },
    ],
  };
}
