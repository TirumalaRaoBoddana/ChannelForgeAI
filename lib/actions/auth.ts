"use server";

<<<<<<< HEAD
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function handleGoogleSignIn() {
  await signIn("google");
}

export async function handleSignOut() {
  await signOut();
}

export async function signup(prevState: string | undefined, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
      return "Email and password are required.";
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "User already exists with this email.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Auto sign in after signup
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return "Failed to sign in automatically.";
    }
    throw error;
  }
}
=======
import { adminAuth, adminDb } from "@/lib/firebase/server";

export async function handleSignOut() {
  // Client handles signOut via Firebase Auth, this is a clean server hook
  return { success: true };
}

export async function registerUser(formData: {
  name?: string;
  email: string;
  password?: string;
}) {
  try {
    const email = formData.email.toLowerCase().trim();
    if (!formData.password) {
      return { error: "Password is required" };
    }

    const userRecord = await adminAuth.createUser({
      email,
      password: formData.password,
      displayName: formData.name || email.split("@")[0],
      emailVerified: false,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      provider: "password",
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      user: {
        id: userRecord.uid,
        name: userRecord.displayName,
        email: userRecord.email,
      },
    };
  } catch (error: any) {
    console.error("Firebase admin user registration error:", error);
    return {
      error: error.message || "Failed to create account. Please try again.",
    };
  }
}
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
