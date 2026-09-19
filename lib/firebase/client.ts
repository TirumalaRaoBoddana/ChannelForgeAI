import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore, type Firestore } from "firebase/firestore";

import { getStorage, type FirebaseStorage } from "firebase/storage";

import appletConfig from "@/firebase-applet-config.json";

export const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || appletConfig.apiKey,

  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,

  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || appletConfig.projectId,

  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,

  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,

  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || appletConfig.appId,

};

// Initialize Firebase App

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services

export const auth: Auth = getAuth(app);

export const db: Firestore = appletConfig.firestoreDatabaseId

  ? getFirestore(app, appletConfig.firestoreDatabaseId)

  : getFirestore(app);

export const storage: FirebaseStorage = getStorage(app);

// Safe connection verification on client startup

if (typeof window !== "undefined") {

  import("firebase/firestore").then(({ doc, getDocFromServer }) => {

    getDocFromServer(doc(db, "test", "connection")).catch((err) => {

      if (err instanceof Error && err.message.includes("the client is offline")) {

        console.warn("Firebase client offline warning:", err.message);

      }

    });

  });

}

// Providers

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;