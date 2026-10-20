import {
  doc,
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit
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

// ============================================================
// DEPOSIT REQUEST SUBMISSION  (Phase 1)
// ============================================================
//
// SECURITY DESIGN:
//   - Creates records in /depositRequests/{autoId}.
//     SEPARATE collection from /deposits/{depositId} (server-only).
//   - Firestore security rules enforce:
//       uid === request.auth.uid
//       verificationStatus === 'pending_backend_review'
//       network in ['TRC20','BEP20']
//       txHash is a non-empty string (>= 16 chars)
//       tokenAmountClaimed > 0
//       No balance, role, or privileged fields present
//   - Users can READ only their own records.
//   - Users can NEVER update or delete submitted records.
//   - Balance crediting and on-chain verification happen
//     EXCLUSIVELY in a Cloud Function / secure backend.
//     The txHash submitted here is an UNVERIFIED CLAIM only.
//
// FIRESTORE DOCUMENT SCHEMA — /depositRequests/{autoId}:
//   uid                            string    Firebase UID (owner)
//   userDisplayId                  string    Human-readable ID (e.g. "USR-AB1234")
//   network                        string    'TRC20' | 'BEP20'
//   txHash                         string    Claimed tx hash (unverified)
//   tokenAmountClaimed             number    Claimed amount (unverified)
//   verificationStatus             string    'pending_backend_review' (immutable by client)
//   destinationAddressAtSubmission null      Phase 1: no address configured
//   chainTxId                      null      Backend-populated after on-chain lookup
//   verifiedAmount                 null      Backend-populated after confirmation
//   createdAt                      timestamp
//   updatedAt                      timestamp
//
// NEVER STORED:
//   Private keys, seed phrases, verified amounts, balance credits,
//   admin tokens, wallet addresses (Phase 1 — address provisioning pending).

/**
 * Submit a deposit notification to Firestore for backend review.
 * DOES NOT credit any balance. DOES NOT verify on-chain.
 * DOES NOT store or display any wallet address.
 *
 * @param {string} uid           - Authenticated Firebase UID
 * @param {string} userDisplayId - Human-readable user ID
 * @param {object} requestData   - { network, txHash, tokenAmountClaimed }
 * @returns {Promise<{id: string}>}
 */
export async function submitDepositRequest(uid, userDisplayId, requestData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('[Firestore] Firebase not configured; deposit request cannot be submitted.');
  }
  if (!uid) {
    throw new Error('User must be authenticated to submit a deposit request.');
  }

  const { network, txHash, tokenAmountClaimed } = requestData;

  // Client-side guards — Firestore rules are the authoritative enforcement layer
  if (!['TRC20', 'BEP20'].includes(network)) {
    throw new Error('Invalid network. Must be TRC20 or BEP20.');
  }
  if (!txHash || typeof txHash !== 'string' || txHash.trim().length < 16) {
    throw new Error('Transaction hash must be at least 16 characters.');
  }
  if (!tokenAmountClaimed || isNaN(tokenAmountClaimed) || Number(tokenAmountClaimed) <= 0) {
    throw new Error('Claimed token amount must be a positive number.');
  }

  const depositRecord = {
    uid: uid,
    userDisplayId: userDisplayId || '',
    network: network,
    txHash: txHash.trim(),
    tokenAmountClaimed: Number(tokenAmountClaimed),
    verificationStatus: 'pending_backend_review', // IMMUTABLE by client after create
    destinationAddressAtSubmission: null,          // Phase 1: no address configured
    chainTxId: null,      // Backend-populated after independent on-chain lookup
    verifiedAmount: null, // Backend-populated after on-chain confirmation
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const depositsRef = collection(db, 'depositRequests');
  const docRef = await addDoc(depositsRef, depositRecord);
  return { id: docRef.id };
}

/**
 * Subscribe to a user's own deposit request records in real-time.
 * Ordered by createdAt descending, limited to 50 most recent.
 * Firestore rules enforce that only the owner's records are accessible.
 *
 * @param {string} uid        - Firebase UID
 * @param {function} onUpdate - Callback with array of deposit records
 * @param {function} onError  - Error callback
 * @returns {function} Unsubscribe function
 */
export function subscribeToUserDepositRequests(uid, onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }
  if (!uid) {
    onUpdate([]);
    return () => {};
  }

  const depositsRef = collection(db, 'depositRequests');
  const q = query(
    depositsRef,
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snap) => {
      const records = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
      onUpdate(records);
    },
    (error) => {
      console.error('[Firestore] depositRequests subscription error:', error);
      if (onError) onError(error);
    }
  );
}
