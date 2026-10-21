import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Client Configuration
 *
 * Values are loaded from Vite environment variables (e.g. .env.local).
 * Never expose service account keys or private server secrets here.
 * Client-side Firebase configuration only requires public Web SDK keys.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBohCWN2v44tAhwRPwspUim-g9llc6tAuI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sightfinince.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sightfinince",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sightfinince.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "710315569153",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:710315569153:web:dd8111baebdaa278f4d000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZSLQC4YSX9"
};

// Check if valid Firebase configuration has been supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your-api-key-here"
);

// Initialize Firebase App safely (singleton pattern)
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    console.log('[Firebase] Firebase initialized successfully');
    console.log('[Firebase] Project ID:', firebaseConfig.projectId);
    console.log('[Firebase] Auth initialized:', !!auth);
    console.log('[Firebase] Firestore initialized:', !!db);
  } catch (error) {
    console.error("[Firebase] Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "[Sight Finance] Firebase credentials not yet configured. " +
    "Provide values in .env.local or update src/firebase/config.js to enable live Firebase Authentication & Firestore."
  );
}

export { app, auth, db, googleProvider };
