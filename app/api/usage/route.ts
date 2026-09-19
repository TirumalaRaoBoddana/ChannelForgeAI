import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase/server";
import { SubscriptionService } from "@/services/subscription.service";

export async function GET(req: NextRequest) {
  try {
    const verifiedUser = await verifyAuthHeader(req);
    if (!verifiedUser?.uid) {
      return NextResponse.json({
        usage: {
          monthlyGenerationsAllowed: 10,
          monthlyGenerationsUsed: 0,
          tokensUsed: 0,
          tokenLimit: 50000,
        },
        subscription: { plan: "FREE", status: "ACTIVE" },
      });
    }

    const [usage, subscription] = await Promise.all([
      SubscriptionService.getUserUsage(verifiedUser.uid),
      SubscriptionService.getUserSubscription(verifiedUser.uid),
    ]);

    return NextResponse.json({ usage, subscription });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch usage" }, { status: 500 });
  }
}
