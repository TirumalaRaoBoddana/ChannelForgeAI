import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { collections } from "@/lib/db";
import { storage } from "@/lib/storage";
import { resolveIdentity } from "@/lib/auth/identity";
import { findOwnedProject } from "@/lib/images/routes";
import { DEMO_PROJECT_ID } from "@/lib/db/seed";
import { fail } from "@/lib/utils/api-response";

// Builds the complete channel kit ZIP server-side. Handles both the legacy
// one-shot analysis projects (demo kit) and the staged wizard projects
// (Brand Identity Object + per-asset generations).
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const idn = resolveIdentity(req);
  // The demo kit is public (mirrors the public kit page + asset file route);
  // every other project stays ownership-gated.
  const project = params.id === DEMO_PROJECT_ID
    ? collections.projects().find(p => p.id === DEMO_PROJECT_ID) ?? null
    : findOwnedProject(params.id, idn);
  if (!project) return fail("NOT_FOUND", "Project not found.", 404);

  const a = project.analysis;
  const bi = project.brandIdentity;
  if (!a && !bi) return fail("NO_ANALYSIS", "This project has nothing to download yet.", 400);

  const zip = new JSZip();
  const branding = zip.folder("branding")!;
  const strategy = zip.folder("strategy")!;
  const brand = zip.folder("brand")!;

  // Current asset versions only (versioned regenerations keep old files).
  const currentAssets = collections.assets().filter(x => x.projectId === project.id && x.current !== false);
  for (const asset of currentAssets) {
    const bytes = await storage.get(asset.storageKey);
    if (bytes) branding.file(`${asset.assetType}.png`, new Uint8Array(bytes));
  }

  const channelName = bi?.channelName ?? a?.channel_names[0]?.name ?? "Channel";

  if (bi) {
    // ── staged wizard project ──
    strategy.file("channel-description.txt",
      project.description
        ? `${channelName}\n${project.tagline ?? ""}\n\nShort description:\n${project.description.short}\n\nFull (SEO) description:\n${project.description.seo}\n`
        : `${channelName}\n${project.tagline ?? ""}\n\n(Description not generated for this project.)\n`);
    if (project.keywords?.length) {
      strategy.file("keywords.txt", project.keywords.map(g => `## ${g.category}\n${g.keywords.join("\n")}`).join("\n\n"));
    }
    if (project.thumbnailGuide) {
      const tg = project.thumbnailGuide;
      strategy.file("thumbnail-style-guide.txt",
        `THUMBNAIL STYLE GUIDE — ${channelName}\n${"=".repeat(40)}\n\nStyle:\n${tg.style}\n\nLayout:\n${tg.layout}\n\nTypography:\n${tg.typography}\n\nDO:\n${tg.doList.map(d => `• ${d}`).join("\n")}\n\nAVOID:\n${tg.avoidList.map(d => `• ${d}`).join("\n")}\n\nEXAMPLES:\n${tg.examples.map(e => `• "${e.title}" — ${e.concept}`).join("\n")}\n`);
    }
    if (project.tagline) brand.file("tagline.txt", `${channelName}\n"${project.tagline}"\n`);
    brand.file("colors.json", JSON.stringify({
      paletteName: bi.paletteName, source: bi.source,
      primary: bi.primaryColor, secondary: bi.secondaryColor, accent: bi.accentColor,
    }, null, 2));
    brand.file("brand-identity.json", JSON.stringify(bi, null, 2));
    const allNames = project.nameGenerations.flatMap(s => s.names);
    if (allNames.length) brand.file("channel-names.txt", allNames.map(n => `${n.name} — ${n.rationale} [${n.personality}]${n.id === project.selectedNameId ? "  ← SELECTED" : ""}`).join("\n"));
    zip.file("README.txt", `ChannelForge AI — Channel Kit for "${channelName}"\nGenerated ${new Date().toISOString()}\n\nbranding/  → logo, banner, watermark PNGs\nstrategy/  → description, keywords, thumbnail guide\nbrand/     → colors, brand identity, name options\n`);
  } else if (a) {
    // ── legacy one-shot analysis project (demo kit) ──
    strategy.file("channel-description.txt",
      `${channelName}\n${a.tagline}\n\nShort description:\n${a.channel_description.short}\n\nFull (SEO) description:\n${a.channel_description.seo}\n`);
    strategy.file("keywords.txt",
      a.channel_keywords.map(g => `## ${g.category}\n${g.keywords.join("\n")}`).join("\n\n") +
      `\n\n## SEO — Primary\n${a.seo_keywords.primary.join("\n")}` +
      `\n\n## SEO — Secondary\n${a.seo_keywords.secondary.join("\n")}` +
      `\n\n## SEO — Long tail\n${a.seo_keywords.long_tail.join("\n")}`);
    strategy.file("content-pillars.txt", a.content_pillars.map(p => `## ${p.name}\n${p.description}`).join("\n\n"));
    strategy.file("video-ideas.txt",
      `LONG-FORM VIDEO IDEAS\n${"=".repeat(40)}\n\n` +
      a.video_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}\n   Keyword: ${v.target_keyword} | Difficulty: ${v.difficulty} | Pillar: ${v.content_pillar}`).join("\n\n") +
      `\n\n\nSHORTS IDEAS\n${"=".repeat(40)}\n\n` +
      a.shorts_ideas.map((v, i) => `${i + 1}. ${v.title}\n   Hook: ${v.hook}\n   Keyword: ${v.target_keyword}`).join("\n\n"));
    brand.file("colors.json", JSON.stringify(a.color_palette, null, 2));
    brand.file("fonts.txt", a.font_recommendations.map(f => `${f.name} — ${f.usage} (fallback: ${f.fallback})`).join("\n"));
    brand.file("channel-names.txt", a.channel_names.map(n => `${n.name} — ${n.rationale}`).join("\n"));
    zip.file("README.txt", `ChannelForge AI — Channel Kit for "${channelName}"\nGenerated ${new Date().toISOString()}\n\nbranding/  → logo, banner, watermark PNGs\nstrategy/  → description, keywords, pillars, video ideas\nbrand/     → colors, fonts, name options\n`);
  }

  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="channel-kit-${project.id}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
