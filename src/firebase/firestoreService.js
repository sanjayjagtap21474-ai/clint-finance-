import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

/**
 * List of fields the user is PERMITTED to edit from the client.
 * Privileged fields (balances, role, verifiedStatus, directReferralsCount, salaryLevel, etc.)
 * are strictly prohibited from being modified by clients.
 */
export const PERMITTED_PROFILE_FIELDS = [
  'fullName',
  'country',
  'phoneNumber',
  'telegramHandle',
  'preferredLanguage',
  'bio',
  'notificationPreferences'
];

/**
 * Creates an initial user profile in Firestore under users/{uid}.
 * Does NOT store passwords or sensitive server credentials.
 * Initial balances and roles default to zero / customer level.
 */
export async function createUserProfileDoc(uid, initialData = {}) {
  if (!isFirebaseConfigured || !db) {
    console.warn('[Firestore] Firebase not configured; skipping createUserProfileDoc.');
    return null;
  }

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data();
  }

  const generatedRefCode = `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`;

  const profile = {
    uid: uid,
    id: `USR-${uid.substring(0, 6).toUpperCase()}`,
    email: initialData.email || '',
    fullName: initialData.fullName || initialData.displayName || 'Sight Finance Client',
    country: initialData.country || 'United Arab Emirates',
    role: 'customer', // PRIVILEGED: read-only to client in security rules
    verifiedStatus: 'Unverified (KYC Required)', // PRIVILEGED
    memberSince: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    referralCode: generatedRefCode,
    referralLink: `https://sightfinance.io/ref/${generatedRefCode}`,
    balances: {
      availableUSDT: 0.00,
      pendingDeposits: 0.00,
      activeInvested: 0.00,
      totalProfitSimulated: 0.00,
      totalReferralBonus: 0.00,
      totalWithdrawn: 0.00
    },
    directReferralsCount: 0, // PRIVILEGED
    salaryLevel: 'None', // PRIVILEGED
    nextSalaryGoal: 25,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef, profile);
  return profile;
}

/**
 * Fetch a single user profile from Firestore by UID
 */
export async function getUserProfileDoc(uid) {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile doc:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time changes on users/{uid}
 */
export function subscribeToUserProfile(uid, onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  const userRef = doc(db, 'users', uid);
  return onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Firestore user subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Updates ONLY permitted user profile fields.
 * Strips any attempts to modify balances, role, verifiedStatus, or transaction data.
 */
export async function updateUserPermittedProfile(uid, requestedUpdates = {}) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  // Filter updates down to strictly permitted fields
  const safeUpdates = {};
  for (const field of PERMITTED_PROFILE_FIELDS) {
    if (requestedUpdates[field] !== undefined) {
      safeUpdates[field] = requestedUpdates[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw new Error('No permitted profile fields were provided for update.');
  }

  safeUpdates.updatedAt = serverTimestamp();

  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, safeUpdates);
  return safeUpdates;
}
