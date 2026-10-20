import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './config';
import { createUserProfileDoc, getUserProfileDoc } from './firestoreService';

/**
 * Human-readable mapping of common Firebase Auth error codes
 */
export function formatAuthError(error) {
  if (!error) return 'An unknown error occurred.';
  const code = error.code || '';
  
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by the browser. Please allow popups for this site.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return error.message || 'Authentication request failed.';
  }
}

/**
 * Register user with Email and Password
 * Automatically creates their user profile in Firestore under users/{uid}
 * NEVER stores the raw password in Firestore!
 */
export async function registerWithEmail(email, password, fullName, country) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured. Please supply Firebase credentials.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set the Auth displayName
  if (fullName) {
    try {
      await updateProfile(user, { displayName: fullName });
    } catch (profileErr) {
      console.warn('Could not set displayName on Auth profile:', profileErr);
    }
  }

  // Create initial user document in Firestore users/{uid}
  const firestoreProfile = await createUserProfileDoc(user.uid, {
    email: user.email,
    fullName: fullName || user.displayName || 'Sight Finance Client',
    country: country || 'United Arab Emirates'
  });

  return { user, profile: firestoreProfile };
}

/**
 * Sign in user with Email and Password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured. Please supply Firebase credentials.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch or create profile
  let profile = await getUserProfileDoc(user.uid);
  if (!profile) {
    profile = await createUserProfileDoc(user.uid, {
      email: user.email,
      fullName: user.displayName
    });
  }

  return { user, profile };
}

/**
 * Sign in or Register using Google Provider popup
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase Google Authentication is not configured. Please supply Firebase credentials.');
  }

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Fetch or initialize profile
  let profile = await getUserProfileDoc(user.uid);
  if (!profile) {
    profile = await createUserProfileDoc(user.uid, {
      email: user.email,
      fullName: user.displayName || 'Google User'
    });
  }

  return { user, profile };
}

/**
 * Sign out the currently authenticated user
 */
export async function logoutUser() {
  if (!isFirebaseConfigured || !auth) {
    return;
  }
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication is not configured.');
  }

  await sendPasswordResetEmail(auth, email);
  return true;
}

/**
 * Subscribe to persistent Auth state
 */
export function subscribeToAuthState(callback) {
  if (!isFirebaseConfigured || !auth) {
    // Invoke immediately with null user if Firebase is not active
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}
