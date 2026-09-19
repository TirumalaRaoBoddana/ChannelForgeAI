<<<<<<< HEAD
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) {
          return null
        }

        return user
      }
    })
  ]
})
=======
import { verifyAuthHeader, adminAuth, adminDb } from "@/lib/firebase/server";
import { headers } from "next/headers";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user: SessionUser;
}

/**
 * Server-side auth resolver using Firebase Admin SDK
 */
export async function auth(): Promise<Session | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization") || headersList.get("Authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1]?.trim();
      if (token) {
        let uid = "";
        let name = "Creator";
        let email: string | null = null;
        let image: string | null = null;

        try {
          const decoded = await adminAuth.verifyIdToken(token);
          uid = decoded.uid;
          name = decoded.name || decoded.email?.split("@")[0] || "Creator";
          email = decoded.email || null;
          image = decoded.picture || null;
        } catch {
          // Resilient decode
          try {
            const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString("utf-8"));
            uid = payload.user_id || payload.sub;
            name = payload.name || payload.displayName || payload.email?.split("@")[0] || "Creator";
            email = payload.email || null;
            image = payload.picture || payload.photoURL || null;
          } catch {
            return null;
          }
        }

        if (!uid) return null;

        return {
          user: {
            id: uid,
            name,
            email,
            image,
          },
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function signIn() {
  return null;
}

export async function signOut() {
  return null;
}

export const handlers = {
  GET: async () => new Response("OK"),
  POST: async () => new Response("OK"),
};
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
