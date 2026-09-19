import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { resolveIdentity } from "@/lib/auth/identity";
import { collections, persist } from "@/lib/db";
import { findOwnedProject } from "@/lib/images/routes";

// Restore a previous asset version (spec §22): marks this version current and
// unmarks the others of the same type. Files are never deleted on regenerate.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = guardApi(req);
  if (g.error) return g.error;
  const idn = resolveIdentity(req);

  const asset = collections.assets().find(a => a.id === params.id);
  if (!asset) return fail("NOT_FOUND", "Asset not found.", 404);
  const project = findOwnedProject(asset.projectId, idn);
  if (!project) return fail("FORBIDDEN", "You do not have access to this asset.", 403);

  for (const a of collections.assets()) {
    if (a.projectId === project.id && a.assetType === asset.assetType) a.current = a.id === asset.id;
  }
  project.updatedAt = new Date().toISOString();
  persist();
  return ok({ assetId: asset.id, assetType: asset.assetType, version: asset.version });
}
