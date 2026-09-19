"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./client";
import type {
  FullProjectWithRelations,
  GeneratedAssetDoc,
  UsageLimitsDoc,
  SubscriptionDoc,
} from "@/types";
import { DEMO_PROJECTS_DATA } from "@/lib/demo-data";

/**
 * Client-Side Firestore Operations using Firebase Web SDK
 * Evaluated securely against firestore.rules using authenticated end-user context
 */

export async function getProjectsFromFirestore(userId?: string | null): Promise<FullProjectWithRelations[]> {
  try {
    if (userId) {
      const q = query(
        collection(db, "projects"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userProjects = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as FullProjectWithRelations[];

        // Sort by createdAt descending in memory if missing composite index
        return userProjects.sort((a, b) => {
          const tA = new Date(a.createdAt || 0).getTime();
          const tB = new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });
      }
    }

    // Also check for public demo projects in Firestore
    try {
      const demoQ = query(collection(db, "projects"), where("isDemo", "==", true));
      const demoSnap = await getDocs(demoQ);
      if (!demoSnap.empty) {
        return demoSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as FullProjectWithRelations[];
      }
    } catch {
      // ignore
    }

    return DEMO_PROJECTS_DATA;
  } catch (error) {
    console.warn("Client Firestore: could not get projects, using demo data fallback:", error);
    return DEMO_PROJECTS_DATA;
  }
}

export async function getProjectByIdFromFirestore(projectId: string): Promise<FullProjectWithRelations | null> {
  try {
    // Check demo projects first for instant feedback
    const demo = DEMO_PROJECTS_DATA.find((p) => p.id === projectId);
    if (demo) return demo;

    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FullProjectWithRelations;
    }

    return null;
  } catch (error) {
    console.warn(`Client Firestore: could not get project ${projectId}:`, error);
    const demo = DEMO_PROJECTS_DATA.find((p) => p.id === projectId);
    return demo || null;
  }
}

export async function saveProjectToFirestore(params: {
  projectId: string;
  userId: string;
  projectData: Partial<FullProjectWithRelations> | any;
}): Promise<FullProjectWithRelations> {
  const { projectId, userId, projectData } = params;
  const projectRef = doc(db, "projects", projectId);

  const fullRecord: FullProjectWithRelations = {
    id: projectId,
    userId,
    title: projectData.title || "Untitled Channel",
    targetNiche: projectData.targetNiche || "General",
    description: projectData.description || "",
    isDemo: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    channelProfile: projectData.channelProfile || {
      id: `cp_${projectId}`,
      projectId,
      primaryNiche: projectData.targetNiche || "General",
      subNiches: [],
      targetAudience: "YouTube Viewers",
      valueProposition: "High value content",
      toneOfVoice: "Engaging",
      contentPillars: ["Guides", "Tutorials"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    brandKit: projectData.brandKit || {
      id: `bk_${projectId}`,
      projectId,
      primaryColor: "#4F46E5",
      secondaryColor: "#06B6D4",
      accentColor: "#F59E0B",
      backgroundColor: "#0B0F17",
      headlineFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      visualStyle: "Modern Vector",
      tagline: projectData.description || "Channel Tagline",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    channelNames: projectData.channelNames || [
      {
        id: `cn_${projectId}_1`,
        projectId,
        name: projectData.title || "Channel",
        handle: `@${(projectData.title || "channel").replace(/[^a-zA-Z0-9]/g, "")}`,
        isPrimary: true,
        createdAt: new Date().toISOString(),
      },
    ],
    assets: projectData.assets || [],
    keywords: projectData.keywords || [],
    contentIdeas: projectData.contentIdeas || [],
  };

  await setDoc(projectRef, fullRecord);
  return fullRecord;
}

export async function deleteProjectFromFirestore(projectId: string): Promise<boolean> {
  try {
    const projectRef = doc(db, "projects", projectId);
    await deleteDoc(projectRef);
    return true;
  } catch (error) {
    console.warn(`Client Firestore: could not delete project ${projectId}:`, error);
    return false;
  }
}

export async function saveAssetToFirestore(asset: Partial<GeneratedAssetDoc> & {
  id: string;
  projectId: string;
  userId?: string | null;
}): Promise<GeneratedAssetDoc> {
  const assetRef = doc(db, "generatedAssets", asset.id);
  const record: GeneratedAssetDoc = {
    id: asset.id,
    projectId: asset.projectId,
    userId: asset.userId || null,
    assetType: asset.assetType || "custom",
    storageKey: asset.storageKey || "",
    storageUrl: asset.storageUrl || null,
    mimeType: asset.mimeType || "image/svg+xml",
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize,
    prompt: asset.prompt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(assetRef, record);
  return record;
}

export async function getProjectAssetsFromFirestore(projectId: string): Promise<GeneratedAssetDoc[]> {
  try {
    const q = query(
      collection(db, "generatedAssets"),
      where("projectId", "==", projectId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as GeneratedAssetDoc[];
  } catch (error) {
    console.warn(`Client Firestore: could not load assets for ${projectId}:`, error);
    return [];
  }
}

export async function recordGenerationInFirestore(params: {
  requestId: string;
  userId: string;
  prompt: string;
  tokensUsed?: number;
}): Promise<void> {
  try {
    const reqRef = doc(db, "generationRequests", params.requestId);
    await setDoc(reqRef, {
      id: params.requestId,
      userId: params.userId,
      provider: "google",
      model: "gemini-2.5-flash",
      requestType: "channel_branding_generation",
      status: "COMPLETED",
      tokensUsed: params.tokensUsed || 1200,
      estimatedCost: 0.002,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Client Firestore: could not record generation request log:", err);
  }
}

export async function getUserUsageFromFirestore(userId: string): Promise<UsageLimitsDoc | null> {
  try {
    const usageRef = doc(db, "usageLimits", userId);
    const snap = await getDoc(usageRef);
    if (snap.exists()) {
      return snap.data() as UsageLimitsDoc;
    }
    return null;
  } catch (error) {
    console.warn("Client Firestore: could not fetch usage limits:", error);
    return null;
  }
}
