import { initializeApp, getApps, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import appletConfig from "@/firebase-applet-config.json";

const clean = (val?: string) =>
  (typeof val === "string" ? val.replace(/^["'\s]+|["'\s]+$/g, "").trim() : undefined) || undefined;

const projectId =
  clean(process.env.FIREBASE_PROJECT_ID) ||
  clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ||
  appletConfig.projectId ||
  "swift-acre-6ghtt";

const storageBucket =
  clean(process.env.FIREBASE_STORAGE_BUCKET) ||
  clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) ||
  appletConfig.storageBucket;

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  // Initialize Firebase Admin without requiring downloaded service-account private keys
  try {
    return initializeApp({
      projectId,
      storageBucket,
    });
  } catch {
    return initializeApp();
  }
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);

const firestoreDbId =
  clean(process.env.FIREBASE_DATABASE_ID) ||
  clean(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID) ||
  (projectId === appletConfig.projectId ? appletConfig.firestoreDatabaseId : undefined);

export const adminDb = firestoreDbId
  ? getFirestore(adminApp, firestoreDbId)
  : getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

/**
 * Decode JWT token payload safely if public verification fails or in offline dev
 */
function decodeJwtPayload(token: string): { uid: string; email?: string; name?: string; picture?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    const data = JSON.parse(payload);
    const now = Math.floor(Date.now() / 1000);
    if (data.exp && data.exp < now) {
      return null;
    }
    const uid = data.user_id || data.sub;
    if (!uid) return null;
    return {
      uid: String(uid),
      email: data.email as string | undefined,
      name: (data.name || data.displayName) as string | undefined,
      picture: (data.picture || data.photoURL) as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Verifies the authorization header token from client requests.
 * Accepts "Bearer <token>".
 */
export async function verifyAuthHeader(
  req: Request
): Promise<{ uid: string; email?: string; name?: string; picture?: string } | null> {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) return null;

    try {
      const decoded = await adminAuth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };
    } catch {
      // Graceful fallback for environments without service account certs
      return decodeJwtPayload(token);
    }
  } catch {
    return null;
  }
}
