// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Ensure all required environment variables are present
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    !process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
      // In a real application, you might want to handle this more gracefully,
      // perhaps showing an error message to the user or logging a more detailed error.
      // For development, throwing an error makes the missing config clear.
      console.error("Firebase configuration environment variables are missing. Please check your .env.local file.");
      // throw new Error("Firebase configuration environment variables are missing.");
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Handle initialization error appropriately
    // For example, you might want to prevent the app from rendering
    // or show a specific error state to the user.
  }
} else {
  app = getApp();
}

// Initialize Firebase services only if the app was successfully initialized
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null; // Initialize Firestore
// const storage = app ? getStorage(app) : null; // Uncomment if you need Storage

export { app, auth, db /*, storage */ }; // Export other services if needed
