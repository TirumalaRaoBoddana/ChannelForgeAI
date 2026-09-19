import { AssetService } from "@/services/asset.service";

export class AssetRepository {
  static async createAsset(data: {
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
  }) {
    return await AssetService.registerAsset(data);
  }

  static async findByProjectId(projectId: string, assetType?: string) {
    return await AssetService.getProjectAssets(projectId, assetType);
  }

  static async deleteAsset(id: string) {
    return await AssetService.deleteAsset(id);
  }
}
