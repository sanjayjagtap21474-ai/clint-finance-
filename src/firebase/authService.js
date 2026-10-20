import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
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
    case 'auth/missing-email':
      return 'Please enter the email address for this account.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if you believe this is an error.';
    default:
      return error.message || 'Authentication request failed.';
  }
}

/**
 * Client-side password policy (Firebase still enforces a 6-character minimum).
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include at least one letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }
  return '';
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

  let userCredential;
  let user;

  try {
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
    console.log('[Auth] User created in Firebase Authentication:', user.uid);
  } catch (authError) {
    console.error('[Auth] Firebase Authentication error:', authError);
    throw authError;
  }

  // Set the Auth displayName
  if (fullName) {
    try {
      await updateProfile(user, { displayName: fullName });
      console.log('[Auth] Display name set successfully');
    } catch (profileErr) {
      console.warn('[Auth] Could not set displayName on Auth profile:', profileErr);
    }
  }

  // Create initial user document in Firestore users/{uid}
  let firestoreProfile;
  try {
    firestoreProfile = await createUserProfileDoc(user.uid, {
      email: user.email,
      fullName: fullName || user.displayName || 'Sight Finance Client',
      country: country || 'United Arab Emirates',
      emailVerified: Boolean(user.emailVerified)
    });
    console.log('[Auth] Firestore profile created successfully');
  } catch (firestoreError) {
    console.error('[Auth] Firestore profile creation failed:', firestoreError);
    // User exists in Auth but profile creation failed
    // We'll return the user with a null profile and let the frontend handle recovery
    return {
      user,
      profile: null,
      emailVerificationSent: false,
      isNewUser: true,
      firestoreError: firestoreError.message
    };
  }

  let emailVerificationSent = false;
  try {
    await sendEmailVerification(user);
    emailVerificationSent = true;
    console.log('[Auth] Email verification sent');
  } catch (verifyErr) {
    console.warn('[Auth] Optional verification email could not be sent:', verifyErr);
  }

  return { user, profile: firestoreProfile, emailVerificationSent, isNewUser: true };
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
    throw new Error('Google Authentication is not enabled in Firebase Console. Enable it under Build > Authentication > Sign-in method > Google.');
  }

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Fetch or initialize profile
  let profile = await getUserProfileDoc(user.uid);
  const isNewUser = !profile;
  if (!profile) {
    profile = await createUserProfileDoc(user.uid, {
      email: user.email,
      fullName: user.displayName || 'Google User',
      emailVerified: Boolean(user.emailVerified)
    });
  }

  return { user, profile, isNewUser };
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
