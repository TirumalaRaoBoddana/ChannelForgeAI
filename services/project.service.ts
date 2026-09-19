import { adminDb } from "@/lib/firebase/server";
import type {
  ProjectDoc,
  ChannelProfileDoc,
  BrandKitDoc,
  ChannelNameDoc,
  GeneratedAssetDoc,
  KeywordDoc,
  ContentIdeaDoc,
  FullProjectWithRelations,
} from "@/types";
import { DEMO_PROJECTS_DATA } from "@/lib/demo-data";
export { DEMO_PROJECTS_DATA };

export class ProjectService {
  /**
   * Retrieves all projects belonging to a user, falling back to demo projects if empty
   */
  static async getUserProjects(userId?: string | null): Promise<FullProjectWithRelations[]> {
    try {
      if (userId) {
        const snapshot = await adminDb
          .collection("projects")
          .where("userId", "==", userId)
          .orderBy("createdAt", "desc")
          .get();

        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...(doc.data() as any),
          })) as FullProjectWithRelations[];
        }
      }

      // Check for saved demo projects in Firestore
      const demoSnapshot = await adminDb
        .collection("projects")
        .where("isDemo", "==", true)
        .get();

      if (!demoSnapshot.empty) {
        return demoSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...(doc.data() as any),
        })) as FullProjectWithRelations[];
      }

      return DEMO_PROJECTS_DATA;
    } catch (error) {
      console.warn("Could not query Firestore projects (using demo fallback):", error);
      return DEMO_PROJECTS_DATA;
    }
  }

  /**
   * Retrieves demo projects for showroom / showcase
   */
  static async getDemoProjects(): Promise<FullProjectWithRelations[]> {
    try {
      const demoSnapshot = await adminDb
        .collection("projects")
        .where("isDemo", "==", true)
        .get();

      if (!demoSnapshot.empty) {
        return demoSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...(doc.data() as any),
        })) as FullProjectWithRelations[];
      }
      return DEMO_PROJECTS_DATA;
    } catch {
      return DEMO_PROJECTS_DATA;
    }
  }

  /**
   * Retrieves full details for a project including brand kit, assets, keywords, ideas
   */
  static async getProjectById(projectId: string): Promise<FullProjectWithRelations | null> {
    try {
      // Check demo projects first
      const demo = DEMO_PROJECTS_DATA.find((p) => p.id === projectId);
      if (demo) return demo;

      const docSnap = await adminDb.collection("projects").doc(projectId).get();
      if (!docSnap.exists) {
        return null;
      }

      return {
        id: docSnap.id,
        ...(docSnap.data() as any),
      } as FullProjectWithRelations;
    } catch (error) {
      console.warn(`Could not get project ${projectId}:`, error);
      const demo = DEMO_PROJECTS_DATA.find((p) => p.id === projectId);
      return demo || null;
    }
  }

  /**
   * Creates a new project from generated YouTube channel data in Firestore
   */
  static async createChannelProject(data: {
    userId?: string;
    title: string;
    targetNiche: string;
    description?: string;
    profile: {
      primaryNiche: string;
      subNiches: string[];
      targetAudience: string;
      valueProposition: string;
      toneOfVoice: string;
      contentPillars: string[];
      uploadSchedule?: string;
    };
    brandKit: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      backgroundColor?: string;
      headlineFont: string;
      bodyFont: string;
      visualStyle: string;
      tagline?: string;
      brandPersonality?: string;
    };
    channelNames?: Array<{
      name: string;
      handle?: string;
      rationale?: string;
      score?: number;
      isPrimary?: boolean;
    }>;
    keywords?: Array<{
      keyword: string;
      searchVolume?: number;
      competition?: string;
      cpc?: number;
      category?: string;
      relevanceScore?: number;
    }>;
    contentIdeas?: Array<{
      title: string;
      hook?: string;
      description?: string;
      format?: string;
      targetLengthMinutes?: number;
      estimatedViews?: string;
      difficulty?: string;
      tags: string[];
      isPlanned?: boolean;
    }>;
  }): Promise<FullProjectWithRelations> {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const fullProject: FullProjectWithRelations = {
      id: projectId,
      userId: data.userId || null,
      title: data.title,
      description: data.description || null,
      targetNiche: data.targetNiche,
      isDemo: false,
      createdAt: now,
      updatedAt: now,
      channelProfile: {
        id: `cp_${projectId}`,
        projectId,
        primaryNiche: data.profile.primaryNiche,
        subNiches: data.profile.subNiches || [],
        targetAudience: data.profile.targetAudience,
        valueProposition: data.profile.valueProposition,
        toneOfVoice: data.profile.toneOfVoice,
        contentPillars: data.profile.contentPillars || [],
        uploadSchedule: data.profile.uploadSchedule || null,
        createdAt: now,
        updatedAt: now,
      },
      brandKit: {
        id: `bk_${projectId}`,
        projectId,
        primaryColor: data.brandKit.primaryColor,
        secondaryColor: data.brandKit.secondaryColor,
        accentColor: data.brandKit.accentColor,
        backgroundColor: data.brandKit.backgroundColor || "#0B0F17",
        headlineFont: data.brandKit.headlineFont,
        bodyFont: data.brandKit.bodyFont,
        visualStyle: data.brandKit.visualStyle,
        tagline: data.brandKit.tagline || null,
        brandPersonality: data.brandKit.brandPersonality || null,
        createdAt: now,
        updatedAt: now,
      },
      channelNames: (data.channelNames || []).map((cn, i) => ({
        id: `cn_${projectId}_${i}`,
        projectId,
        name: cn.name,
        handle: cn.handle || null,
        rationale: cn.rationale || null,
        score: cn.score || 95,
        isPrimary: cn.isPrimary ?? (i === 0),
        createdAt: now,
      })),
      keywords: (data.keywords || []).map((kw, i) => ({
        id: `kw_${projectId}_${i}`,
        projectId,
        keyword: kw.keyword,
        searchVolume: kw.searchVolume || null,
        competition: kw.competition || null,
        cpc: kw.cpc || null,
        category: kw.category || null,
        relevanceScore: kw.relevanceScore || null,
        createdAt: now,
      })),
      contentIdeas: (data.contentIdeas || []).map((ci, i) => ({
        id: `ci_${projectId}_${i}`,
        projectId,
        title: ci.title,
        hook: ci.hook || null,
        description: ci.description || null,
        format: ci.format || "Standard Video",
        targetLengthMinutes: ci.targetLengthMinutes || 15,
        estimatedViews: ci.estimatedViews || null,
        difficulty: ci.difficulty || "Intermediate",
        tags: ci.tags || [],
        isPlanned: ci.isPlanned ?? false,
        createdAt: now,
        updatedAt: now,
      })),
      assets: [],
    };

    try {
      await adminDb.collection("projects").doc(projectId).set(fullProject);
      return fullProject;
    } catch (dbError) {
      console.warn("Firestore createChannelProject error, returning object:", dbError);
      return fullProject;
    }
  }

  /**
   * Deletes a project and its assets
   */
  static async deleteProject(projectId: string, userId?: string): Promise<boolean> {
    try {
      const docRef = adminDb.collection("projects").doc(projectId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return true;
      }

      if (userId) {
        const data = snapshot.data();
        if (data?.userId && data.userId !== userId) {
          console.warn("Unauthorized attempt to delete project:", projectId);
          return false;
        }
      }

      await docRef.delete();

      // Delete associated assets records
      const assetsSnap = await adminDb
        .collection("generatedAssets")
        .where("projectId", "==", projectId)
        .get();

      const batch = adminDb.batch();
      assetsSnap.docs.forEach((d: any) => batch.delete(d.ref));
      await batch.commit();

      return true;
    } catch (error) {
      console.warn(`Could not delete project ${projectId}:`, error);
      return false;
    }
  }
}
