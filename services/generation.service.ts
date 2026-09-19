import { adminDb } from "@/lib/firebase/server";
import { SubscriptionService } from "./subscription.service";
import type { GenerationRequestDoc, SavedGenerationDoc } from "@/types";
import type { Query, DocumentData } from "firebase-admin/firestore";

export class GenerationService {
  /**
   * Initializes a generation request lifecycle with processing status
   */
  static async startRequest(params: {
    userId: string;
    projectId?: string;
    provider: string;
    model: string;
    requestType: string;
  }): Promise<GenerationRequestDoc> {
    const requestId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: GenerationRequestDoc = {
      id: requestId,
      userId: params.userId,
      projectId: params.projectId || null,
      provider: params.provider,
      model: params.model,
      requestType: params.requestType,
      status: "processing",
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await adminDb.collection("generationRequests").doc(requestId).set(record);
      return record;
    } catch (error) {
      console.warn("Could not record generationRequest in Firestore:", error);
      return record;
    }
  }

  /**
   * Mark request as completed and record telemetry
   */
  static async completeRequest(params: {
    requestId: string;
    userId: string;
    tokensUsed: number;
    estimatedCost?: number;
  }): Promise<void> {
    const now = new Date().toISOString();

    try {
      await adminDb.collection("generationRequests").doc(params.requestId).update({
        status: "completed",
        completedAt: now,
        tokensUsed: params.tokensUsed,
        estimatedCost: params.estimatedCost || 0,
        updatedAt: now,
      });

      // Increment usage in Firestore
      await SubscriptionService.recordUsage(params.userId, 1, params.tokensUsed);
    } catch (error) {
      console.warn("Could not update generationRequest completion status:", error);
    }
  }

  /**
   * Mark request as failed (supports both positional and object params)
   */
  static async failRequest(
    param1: string | { requestId: string; errorMessage: string },
    param2?: string
  ): Promise<void> {
    const requestId = typeof param1 === "string" ? param1 : param1.requestId;
    const errorMessage = typeof param1 === "string" ? param2 || "Generation failed" : param1.errorMessage;
    const now = new Date().toISOString();

    try {
      await adminDb.collection("generationRequests").doc(requestId).update({
        status: "failed",
        errorMessage,
        completedAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.warn("Could not mark generationRequest as failed:", error);
    }
  }

  /**
   * Save an item from a generation output
   */
  static async saveGenerationItem(params: {
    userId: string;
    projectId?: string;
    category: string;
    title: string;
    content: Record<string, any>;
    prompt?: string;
  }): Promise<SavedGenerationDoc> {
    const savedId = `save_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: SavedGenerationDoc = {
      id: savedId,
      userId: params.userId,
      projectId: params.projectId || null,
      category: params.category,
      title: params.title,
      data: params.content,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await adminDb.collection("savedGenerations").doc(savedId).set(record);
      return record;
    } catch (error) {
      console.warn("Could not save generation item in Firestore:", error);
      return record;
    }
  }

  /**
   * Get user's saved generations
   */
  static async getUserSavedGenerations(userId: string, category?: string): Promise<SavedGenerationDoc[]> {
    try {
      let query: Query<DocumentData> = adminDb
        .collection("savedGenerations")
        .where("userId", "==", userId);

      if (category) {
        query = query.where("category", "==", category);
      }

      const snap = await query.orderBy("createdAt", "desc").get();
      return snap.docs.map((d: any) => ({
        id: d.id,
        ...(d.data() as any),
      })) as SavedGenerationDoc[];
    } catch {
      return [];
    }
  }
}
