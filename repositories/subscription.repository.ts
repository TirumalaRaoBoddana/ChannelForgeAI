import { SubscriptionService } from "@/services/subscription.service";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types";

export class SubscriptionRepository {
  static async getSubscription(userId: string) {
    return await SubscriptionService.getUserSubscription(userId);
  }

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
  ) {
    return await SubscriptionService.upsertSubscription(userId, data);
  }

  static async getOrCreateUsageLimit(userId: string) {
    return await SubscriptionService.getUserUsage(userId);
  }

  static async recordUsageIncrement(
    userId: string,
    increments: {
      generations?: number;
      images?: number;
      tokens?: number;
    }
  ) {
    if (increments.generations || increments.tokens) {
      await SubscriptionService.recordGeneration(userId, increments.tokens || 1000);
    }
    return { success: true };
  }

  static async recordApiUsage(_data: any) {
    return { id: `api_${Date.now()}` };
  }

  static async recordPayment(_data: any) {
    return { id: `pay_${Date.now()}` };
  }
}
