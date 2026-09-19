import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/lib/db";
import { getCurrentUser, guestTokenWithQuery } from "@/lib/auth/session";
import { DEMO_PROJECT_ID } from "@/lib/db/seed";
import { KitView } from "@/components/kit/kit-view";
import { StagedKitView } from "@/components/kit/staged-kit-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { projectId: string } }): Promise<Metadata> {
  const project = collections.projects().find(p => p.id === params.projectId);
  const name = project?.brandIdentity?.channelName ?? project?.analysis?.channel_names[0]?.name ?? "Channel";
  return { title: `${name} — Channel Kit`, robots: { index: params.projectId === DEMO_PROJECT_ID, follow: false } };
}

export default function KitPage({ params, searchParams }: { params: { projectId: string }; searchParams: { g?: string } }) {
  const user = getCurrentUser();
  // ?g= carries the guest identity for cookie-blocked browsers (preview iframe).
  const guestToken = guestTokenWithQuery(searchParams.g ?? null) ?? "";
  const project = collections.projects().find(p => p.id === params.projectId);
  // Legacy projects require an analysis; staged wizard projects require at
  // least a name generation to be viewable.
  if (!project || (!project.analysis && !project.brandIdentity && project.nameGenerations.length === 0)) notFound();

  const isDemo = project.id === DEMO_PROJECT_ID;
  const owned = user ? project.userId === user.id || project.guestToken === guestToken : project.guestToken === guestToken;
  if (!owned && !isDemo) notFound();

  const assets = collections.assets().filter(a => a.projectId === project.id);
  const isStaged = !project.analysis;

  if (isStaged) {
    const allNames = project.nameGenerations.flatMap(s => s.names);
    const selected = allNames.find(n => n.id === project.selectedNameId) ?? null;
    return (
      <StagedKitView
        project={{ id: project.id, idea: project.idea, createdAt: project.createdAt, stage: project.stage }}
        selectedName={selected ? { name: selected.name, tagline: selected.tagline, personality: selected.personality } : null}
        allNames={allNames.map(n => ({ id: n.id, name: n.name }))}
        brandIdentity={project.brandIdentity}
        tagline={project.tagline}
        description={project.description}
        keywords={project.keywords}
        thumbnailGuide={project.thumbnailGuide}
        chosenAssets={project.chosenAssets}
        assets={assets.map(a => ({ id: a.id, assetType: a.assetType, width: a.width, height: a.height, version: a.version, current: a.current !== false }))}
        isGuest={!user}
      />
    );
  }

  const brandKit = collections.brandKits().find(b => b.projectId === project.id) ?? null;
  const keywordSet = collections.keywordSets().find(k => k.projectId === project.id) ?? null;
  const contentIdeas = collections.contentIdeas().filter(c => c.projectId === project.id);

  return (
    <KitView
      project={{ id: project.id, idea: project.idea, createdAt: project.createdAt }}
      analysis={project.analysis!}
      brandKit={brandKit}
      assets={assets.filter(a => a.current !== false).map(a => ({ id: a.id, assetType: a.assetType, width: a.width, height: a.height }))}
      keywordGroups={keywordSet?.groups ?? project.analysis!.channel_keywords}
      contentIdeas={contentIdeas.map(c => ({ id: c.id, kind: c.kind, title: c.title, hook: c.hook, targetKeyword: c.target_keyword, difficulty: c.difficulty, contentPillar: c.content_pillar }))}
      isGuest={!user}
      isDemo={isDemo}
    />
  );
}
