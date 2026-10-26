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
    console.log('[Firestore] Profile already exists for UID:', uid);
    return snap.data();
  }

  const generatedRefCode = `SIGHT-${uid.slice(-6).toUpperCase()}`;
  const displayId = `USR-${uid.substring(0, 8).toUpperCase()}`;

  const profile = {
    uid: uid,
    firebaseUid: uid,
    id: displayId,
    email: initialData.email || '',
    fullName: initialData.fullName || initialData.displayName || 'Sight Finance Client',
    country: initialData.country || 'United Arab Emirates',
    role: 'customer', // PRIVILEGED: read-only to client in security rules
    verifiedStatus: 'Unverified (KYC Required)', // PRIVILEGED
    accountStatus: 'active', // PRIVILEGED
    emailVerified: Boolean(initialData.emailVerified),
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

  try {
    console.log('[Firestore] Attempting to create profile for UID:', uid);
    await setDoc(userRef, profile);
    console.log('[Firestore] Profile created successfully for UID:', uid);
    return profile;
  } catch (error) {
    console.warn('[Firestore] Notice: Firestore write failed (likely permission rules). Falling back to local profile session.', error);
    return profile;
  }
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
    console.warn('[Firestore] Notice: Could not fetch user profile (permission rules). Returning null fallback.', error);
    return null;
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
// DEPOSIT REQUEST SUBMISSION & ADMIN SUBSCRIPTIONS
// ============================================================

/**
 * Submit a deposit notification to Firestore for backend review.
 * DOES NOT credit any balance. DOES NOT verify on-chain.
 */
export async function submitDepositRequest(uid, userDisplayId, requestData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('[Firestore] Firebase not configured; deposit request cannot be submitted.');
  }
  if (!uid) {
    throw new Error('User must be authenticated to submit a deposit request.');
  }

  const { network, txHash, tokenAmountClaimed } = requestData;

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
    verificationStatus: 'pending_backend_review',
    destinationAddressAtSubmission: null,
    chainTxId: null,
    verifiedAmount: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const depositsRef = collection(db, 'depositRequests');
    const docRef = await addDoc(depositsRef, depositRecord);
    return { id: docRef.id };
  } catch (error) {
    console.warn('[Firestore] Notice: Deposit write failed (permission rules). Returning local ID.', error);
    return { id: `DEP-${Date.now()}` };
  }
}

/**
 * Subscribe to a user's own deposit request records in real-time.
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

/**
 * Subscribe to ALL deposit request records in real-time (Admin access).
 */
export function subscribeToAllDepositRequests(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const depositsRef = collection(db, 'depositRequests');
    const q = query(
      depositsRef,
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
        console.warn('[Firestore] All depositRequests subscription warning:', error.message);
        if (onError) onError(error);
        onUpdate([]);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Exception subscribing to all depositRequests:', err);
    onUpdate([]);
    return () => {};
  }
}

/**
 * Subscribe to ALL user records in real-time (Admin access).
 */
export function subscribeToAllUsers(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(100));

    return onSnapshot(
      q,
      (snap) => {
        const usersList = snap.docs.map(d => {
          const data = d.data();
          return {
            id: data.id || `USR-${d.id.substring(0, 8).toUpperCase()}`,
            uid: d.id,
            name: data.fullName || data.email || 'Customer',
            email: data.email || 'No email',
            country: data.country || 'N/A',
            balance: data.balances?.availableUSDT || 0.0,
            plansActive: 0,
            kycStatus: data.verifiedStatus || 'Unverified',
            role: data.role || 'customer',
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString().split('T')[0] : 'N/A'
          };
        });
        onUpdate(usersList);
      },
      (error) => {
        console.warn('[Firestore] All users subscription warning:', error.message);
        if (onError) onError(error);
        onUpdate([]);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Exception subscribing to all users:', err);
    onUpdate([]);
    return () => {};
  }
}

/**
 * Subscribe to ALL support tickets in real-time (Admin access).
 */
export function subscribeToAllTickets(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, limit(50));

    return onSnapshot(
      q,
      (snap) => {
        const ticketList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(ticketList);
      },
      (error) => {
        console.warn('[Firestore] All tickets subscription warning:', error.message);
        if (onError) onError(error);
        onUpdate([]);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Exception subscribing to all tickets:', err);
    onUpdate([]);
    return () => {};
  }
}

/**
 * Purchase an investment package in Firestore under userPlans collection
 * and deduct the plan amount from the user's available balance in users/{uid}.
 */
export async function purchaseInvestmentPlanDoc(uid, planData) {
  if (!uid) {
    throw new Error('User authentication required to purchase a plan.');
  }

  const numericAmount = parseFloat(String(planData.amount).replace(/,/g, '')) || 0;
  if (numericAmount <= 0) {
    throw new Error('Invalid plan amount.');
  }

  if (!isFirebaseConfigured || !db) {
    return {
      docId: `UP-${Date.now()}`,
      uid,
      planName: planData.name,
      amount: numericAmount,
      dailyRoi: planData.dailyRoi || '0.00',
      days: planData.days,
      totalReturn: planData.totalReturn,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
  }

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  let currentBalance = 0;
  let currentActiveInvested = 0;

  if (userSnap.exists()) {
    const userData = userSnap.data();
    currentBalance = userData.balances?.availableFund ?? userData.balances?.availableUSDT ?? 0;
    currentActiveInvested = userData.balances?.activeInvested ?? 0;
  }

  let newBalance = currentBalance;
  let newActiveInvested = currentActiveInvested + numericAmount;

  if (currentBalance >= numericAmount) {
    newBalance = currentBalance - numericAmount;
  }

  try {
    await updateDoc(userRef, {
      'balances.availableFund': newBalance,
      'balances.availableUSDT': newBalance,
      'balances.activeInvested': newActiveInvested,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Firestore] Profile update notice during plan purchase:', err.message);
  }

  const newPlanDoc = {
    uid,
    planName: planData.name,
    amount: numericAmount,
    dailyRoi: planData.dailyRoi || '0.00',
    days: planData.days,
    totalReturn: planData.totalReturn,
    status: 'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const plansRef = collection(db, 'userPlans');
    const docRef = await addDoc(plansRef, newPlanDoc);
    return { docId: docRef.id, ...newPlanDoc };
  } catch (error) {
    console.warn('[Firestore] userPlans write notice:', error.message);
    return { docId: `UP-${Date.now()}`, ...newPlanDoc };
  }
}

/**
 * Subscribe to a user's own purchased packages / investment plans in real-time.
 */
export function subscribeToUserPlans(uid, onUpdate, onError) {
  if (!isFirebaseConfigured || !db || !uid) {
    onUpdate([]);
    return () => {};
  }

  try {
    const plansRef = collection(db, 'userPlans');
    const q = query(
      plansRef,
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
        console.warn('[Firestore] userPlans subscription warning:', error.message);
        if (onError) onError(error);
        onUpdate([]);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Exception subscribing to userPlans:', err);
    onUpdate([]);
    return () => {};
  }
}
