import { adminAuth, adminDb } from "@/lib/firebase/server";
import { GenerationService } from "@/services/generation.service";
import type { GenerationStatus } from "@/types";

export class GenerationRepository {
  static async createRequest(data: {
    userId: string;
    projectId?: string;
    provider: string;
    model: string;
    requestType: string;
    requestId?: string;
    status?: GenerationStatus;
  }) {
    return await GenerationService.startRequest(data);
  }

  static async updateRequestStatus(
    id: string,
    update: {
      status: GenerationStatus;
      completedAt?: Date;
      tokensUsed?: number;
      estimatedCost?: number;
      errorMessage?: string;
    }
  ) {
    if (update.status === "completed") {
      try {
        const reqDoc = await adminDb.collection("generationRequests").doc(id).get();
        if (reqDoc.exists) {
          const req = reqDoc.data();
          if (req) {
            await GenerationService.completeRequest({
              requestId: id,
              userId: req.userId,
              tokensUsed: update.tokensUsed || 0,
              estimatedCost: update.estimatedCost,
            });
          }
        }
      } catch {
        // Safe fallback
      }
    }
  }

  static async getRequestsByUser(userId: string) {
    try {
      const snap = await adminDb
        .collection("generationRequests")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      return snap.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      }));
    } catch {
      return [];
    }
  }

  static async getUsageMetrics(userId: string) {
    try {
      const doc = await adminDb.collection("usageLimits").doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch {
      return null;
    }
  }
}
