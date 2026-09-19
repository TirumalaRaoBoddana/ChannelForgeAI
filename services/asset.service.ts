import { adminDb } from "@/lib/firebase/server";
import type { GeneratedAssetDoc } from "@/types";
import type { Query, DocumentData } from "firebase-admin/firestore";

export class AssetService {
  /**
   * Register generated asset in Firestore.
   */
  static async registerAsset(params: {
    projectId: string;
    userId?: string;
    assetType: string;
    storageKey: string;
    storageUrl?: string;
    mimeType: string;
    width?: number;
    height?: number;
    fileSize?: number;
    prompt?: string;
  }): Promise<GeneratedAssetDoc> {
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const assetRecord: GeneratedAssetDoc = {
      id: assetId,
      assetId,
      projectId: params.projectId,
      assetType: params.assetType,
      storageKey: params.storageKey,
      storageUrl: params.storageUrl || null,
      mimeType: params.mimeType,
      width: params.width || null,
      height: params.height || null,
      fileSize: params.fileSize || null,
      prompt: params.prompt || null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await adminDb.collection("generatedAssets").doc(assetId).set({
        ...assetRecord,
        userId: params.userId || null,
      });

      // Also append asset reference to the project document if available
      try {
        const projRef = adminDb.collection("projects").doc(params.projectId);
        const projDoc = await projRef.get();
        if (projDoc.exists) {
          const existingAssets = (projDoc.data()?.assets as any[]) || [];
          await projRef.update({
            assets: [...existingAssets, assetRecord],
            updatedAt: now,
          });
        }
      } catch {
        // Non-critical
      }

      return assetRecord;
    } catch (error) {
      console.warn(`Could not record asset ${assetId} in Firestore:`, error);
      return assetRecord;
    }
  }

  /**
   * Get all assets for a project
   */
  static async getProjectAssets(projectId: string, assetType?: string): Promise<GeneratedAssetDoc[]> {
    try {
      let query: Query<DocumentData> = adminDb
        .collection("generatedAssets")
        .where("projectId", "==", projectId);

      if (assetType) {
        query = query.where("assetType", "==", assetType);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((d: any) => ({
        id: d.id,
        ...(d.data() as any),
      })) as GeneratedAssetDoc[];
    } catch (error) {
      console.warn(`Could not get project assets for ${projectId}:`, error);
      return [];
    }
  }

  /**
   * Delete asset
   */
  static async deleteAsset(assetId: string): Promise<boolean> {
    try {
      await adminDb.collection("generatedAssets").doc(assetId).delete();
      return true;
    } catch (error) {
      console.warn(`Could not delete asset ${assetId}:`, error);
      return false;
    }
  }
}
