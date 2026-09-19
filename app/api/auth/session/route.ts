import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader, adminDb } from "@/lib/firebase/server";

export async function GET(req: NextRequest) {
  try {
    const verifiedUser = await verifyAuthHeader(req);
    if (!verifiedUser?.uid) {
      return NextResponse.json({ user: null });
    }

    let profile: any = null;
    try {
      const docSnap = await adminDb.collection("users").doc(verifiedUser.uid).get();
      profile = docSnap.exists ? docSnap.data() : null;
    } catch {
      // Safe fallback if server credentials are not provisioned
    }

    return NextResponse.json({
      user: {
        id: verifiedUser.uid,
        email: verifiedUser.email,
        name: profile?.displayName || verifiedUser.name || verifiedUser.email?.split("@")[0] || "Creator",
        image: profile?.photoURL || verifiedUser.picture || null,
        emailVerified: profile?.emailVerified ?? false,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ user: null });
  }
}
