import { adminAuth, adminDb } from "@/lib/firebase/server";
import { SubscriptionService } from "@/services/subscription.service";

export class UserRepository {
  static async findById(id: string) {
    try {
      const userDoc = await adminDb.collection("users").doc(id).get();
      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data() || {};
      const [subscription, usageLimit] = await Promise.all([
        SubscriptionService.getUserSubscription(id),
        SubscriptionService.getUserUsage(id),
      ]);

      return {
        id: userDoc.id,
        email: userData.email,
        name: userData.displayName || userData.name,
        image: userData.photoURL || userData.image,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
        subscription,
        usageLimit,
      };
    } catch (error) {
      console.warn(`Could not find user ${id} in Firestore:`, error);
      return null;
    }
  }

  static async findByEmail(email: string) {
    try {
      const snap = await adminDb
        .collection("users")
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();

      if (snap.empty) {
        // Also check Firebase Auth directly
        try {
          const authUser = await adminAuth.getUserByEmail(email.toLowerCase());
          return {
            id: authUser.uid,
            email: authUser.email,
            name: authUser.displayName,
            image: authUser.photoURL,
            createdAt: authUser.metadata.creationTime,
            updatedAt: authUser.metadata.lastSignInTime,
          };
        } catch {
          return null;
        }
      }

      const userDoc = snap.docs[0]!;
      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        name: data.displayName || data.name,
        image: data.photoURL || data.image,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (error) {
      console.warn(`Could not find user by email ${email}:`, error);
      return null;
    }
  }

  static async updateUsage(userId: string, generationsIncrement: number = 1, tokensIncrement: number = 0) {
    return await SubscriptionService.recordUsage(userId, generationsIncrement, tokensIncrement);
  }
}
