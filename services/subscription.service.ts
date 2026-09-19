import { adminDb } from "@/lib/firebase/server";
import type {
  SubscriptionDoc,
  UsageLimitDoc,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types";

export class SubscriptionService {
  /**
   * Retrieves active subscription for a user from Firestore
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionDoc | null> {
    try {
      const docSnap = await adminDb.collection("subscriptions").doc(userId).get();
      if (!docSnap.exists) return null;

      const data = docSnap.data() as any;
      return {
        id: docSnap.id,
        userId,
        plan: (data.plan as SubscriptionPlan) || "FREE",
        status: (data.status as SubscriptionStatus) || "ACTIVE",
        stripeCustomerId: data.stripeCustomerId || null,
        stripeSubscriptionId: data.stripeSubscriptionId || null,
        stripePriceId: data.stripePriceId || null,
        currentPeriodStart: data.currentPeriodStart || new Date().toISOString(),
        currentPeriodEnd: data.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.warn(`Could not get subscription for user ${userId} from Firestore:`, error);
      return null;
    }
  }

  /**
   * Upserts subscription information
   */
  static async upsertSubscription(
    userId: string,
    data: {
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      stripePriceId?: string;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd?: boolean;
    }
  ): Promise<SubscriptionDoc> {
    const now = new Date().toISOString();

    const subRecord: SubscriptionDoc = {
      id: `sub_${userId}`,
      userId,
      plan: data.plan,
      status: data.status,
      stripeCustomerId: data.stripeCustomerId || null,
      stripeSubscriptionId: data.stripeSubscriptionId || null,
      stripePriceId: data.stripePriceId || null,
      currentPeriodStart: now,
      currentPeriodEnd: data.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await adminDb.collection("subscriptions").doc(userId).set(subRecord, { merge: true });
      return subRecord;
    } catch (error) {
      console.warn("Could not upsert subscription in Firestore:", error);
      return subRecord;
    }
  }

  /**
   * Retrieves usage limits and current consumption
   */
  static async getUserUsage(userId: string): Promise<UsageLimitDoc> {
    const defaultUsage: UsageLimitDoc = {
      id: `usage_${userId}`,
      userId,
      monthlyGenerationsAllowed: 10,
      monthlyGenerationsUsed: 0,
      imageGenerationsAllowed: 5,
      imageGenerationsUsed: 0,
      tokenLimit: 50000,
      tokensUsed: 0,
      cycleStartDate: new Date().toISOString(),
      cycleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      const docSnap = await adminDb.collection("usageLimits").doc(userId).get();
      if (!docSnap.exists) {
        return defaultUsage;
      }

      const data = docSnap.data() as any;
      return {
        id: docSnap.id,
        userId,
        monthlyGenerationsAllowed: data.monthlyGenerationsAllowed ?? 10,
        monthlyGenerationsUsed: data.monthlyGenerationsUsed ?? 0,
        imageGenerationsAllowed: data.imageGenerationsAllowed ?? 5,
        imageGenerationsUsed: data.imageGenerationsUsed ?? 0,
        tokenLimit: data.tokenLimit ?? 50000,
        tokensUsed: data.tokensUsed ?? 0,
        cycleStartDate: data.cycleStartDate || defaultUsage.cycleStartDate,
        cycleEndDate: data.cycleEndDate || defaultUsage.cycleEndDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch {
      return defaultUsage;
    }
  }

  /**
   * Checks if user has remaining generations
   */
  static async canPerformGeneration(userId: string): Promise<boolean> {
    const usage = await this.getUserUsage(userId);
    return usage.monthlyGenerationsUsed < usage.monthlyGenerationsAllowed;
  }

  /**
   * Increment generation counters and tokens used
   */
  static async recordUsage(userId: string, generationsIncrement: number = 1, tokensIncrement: number = 1000): Promise<void> {
    try {
      const docRef = adminDb.collection("usageLimits").doc(userId);
      const snap = await docRef.get();

      if (snap.exists) {
        const data = snap.data() as any;
        await docRef.update({
          monthlyGenerationsUsed: (data.monthlyGenerationsUsed || 0) + generationsIncrement,
          tokensUsed: (data.tokensUsed || 0) + tokensIncrement,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await docRef.set({
          userId,
          monthlyGenerationsAllowed: 10,
          monthlyGenerationsUsed: generationsIncrement,
          imageGenerationsAllowed: 5,
          imageGenerationsUsed: 0,
          tokenLimit: 50000,
          tokensUsed: tokensIncrement,
          cycleStartDate: new Date().toISOString(),
          cycleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn("Could not record usage in Firestore:", error);
    }
  }

  /**
   * Alias for backward compatibility
   */
  static async recordGeneration(userId: string, tokens = 1000): Promise<void> {
    return this.recordUsage(userId, 1, tokens);
  }
}
