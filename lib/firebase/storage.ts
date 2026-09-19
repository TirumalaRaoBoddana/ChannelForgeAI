import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./client";

/**
 * Structured storage paths:
 * users/{uid}/projects/{projectId}/assets/{assetId}/{filename}
 */
export function buildAssetStoragePath(params: {
  userId: string;
  projectId: string;
  assetId: string;
  filename: string;
}): string {
  const cleanName = params.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `users/${params.userId}/projects/${params.projectId}/assets/${params.assetId}/${cleanName}`;
}

/**
 * Uploads a file buffer or Blob to Firebase Cloud Storage
 */
export async function uploadAssetFile(params: {
  userId: string;
  projectId: string;
  assetId: string;
  filename: string;
  file: Blob | Uint8Array | ArrayBuffer;
  contentType: string;
}): Promise<{ storageKey: string; downloadUrl: string }> {
  const path = buildAssetStoragePath(params);
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, params.file, {
    contentType: params.contentType,
    customMetadata: {
      userId: params.userId,
      projectId: params.projectId,
      assetId: params.assetId,
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return { storageKey: path, downloadUrl };
}

/**
 * Deletes an asset file from Firebase Cloud Storage
 */
export async function deleteAssetFile(storageKey: string): Promise<boolean> {
  try {
    const storageRef = ref(storage, storageKey);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.warn(`Could not delete storage object ${storageKey}:`, error);
    return false;
  }
}
