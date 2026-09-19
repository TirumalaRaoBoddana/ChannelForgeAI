"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase/client";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  emailVerified: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<{ needVerification: boolean }>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile document with Firestore
  const syncProfile = async (fbUser: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", fbUser.uid);
      const snapshot = await getDoc(userRef);

      const providerId = fbUser.providerData[0]?.providerId || "password";

      if (!snapshot.exists()) {
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Creator"),
          photoURL: fbUser.photoURL,
          provider: providerId,
          emailVerified: fbUser.emailVerified,
        };

        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Also bootstrap default usage limits
        const usageRef = doc(db, "usageLimits", fbUser.uid);
        await setDoc(
          usageRef,
          {
            userId: fbUser.uid,
            monthlyGenerationsAllowed: 10,
            monthlyGenerationsUsed: 0,
            imageGenerationsAllowed: 5,
            imageGenerationsUsed: 0,
            tokenLimit: 50000,
            tokensUsed: 0,
            cycleStartDate: new Date().toISOString(),
            cycleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        setProfile(newProfile);
      } else {
        const data = snapshot.data() as UserProfile;
        // Update verification status if changed
        if (data.emailVerified !== fbUser.emailVerified) {
          await setDoc(userRef, { emailVerified: fbUser.emailVerified, updatedAt: serverTimestamp() }, { merge: true });
          data.emailVerified = fbUser.emailVerified;
        }
        setProfile(data);
      }
    } catch (err) {
      console.warn("Could not sync Firestore profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncProfile(cred.user);
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    // Send verification email
    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn("Could not send verification email:", e);
    }
    await syncProfile(cred.user);
    return { needVerification: !cred.user.emailVerified };
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncProfile(cred.user);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const getIdToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        sendVerification,
        signOut,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
