import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase/server";
import { AssetService } from "@/services/asset.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const assetType = searchParams.get("assetType") || undefined;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId query parameter" }, { status: 400 });
    }

    const assets = await AssetService.getProjectAssets(projectId, assetType);
    return NextResponse.json({ assets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch assets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const verifiedUser = await verifyAuthHeader(req);
    const body = await req.json();

    if (!body.projectId || !body.assetType) {
      return NextResponse.json({ error: "Missing required fields (projectId, assetType)" }, { status: 400 });
    }

    const filename = body.filename || `${body.assetType}.svg`;
    const storageKey =
      body.storageKey ||
      (verifiedUser?.uid
        ? `users/${verifiedUser.uid}/projects/${body.projectId}/assets/${body.assetType}/${filename}`
        : `projects/${body.projectId}/${body.assetType}/${filename}`);
    const storageUrl = body.storageUrl || null;

    const asset = await AssetService.registerAsset({
      projectId: body.projectId,
      userId: verifiedUser?.uid || undefined,
      assetType: body.assetType,
      storageKey,
      storageUrl,
      mimeType: body.mimeType || "image/svg+xml",
      width: body.width,
      height: body.height,
      fileSize: body.fileSize,
      prompt: body.prompt,
    });

    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save asset" }, { status: 500 });
  }
}
