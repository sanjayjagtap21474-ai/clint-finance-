import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BRAND,
  INVESTMENT_PLANS,
  REFERRAL_PROGRAM,
  SALARY_LEVELS,
  USDT_NETWORKS,
  TRANSACTION_STATUSES,
  EMPTY_USER,
  INITIAL_ADMIN_LOGS,
  INITIAL_AI_REPORTS,
  FAQS
} from '../data/platformData';
import { isFirebaseConfigured } from '../firebase/config';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetPassword,
  subscribeToAuthState,
  formatAuthError
} from '../firebase/authService';
import {
  subscribeToUserProfile,
  updateUserPermittedProfile,
  createUserProfileDoc
} from '../firebase/firestoreService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State
  const [activePage, setActivePage] = useState('home'); // home, about, services, how-it-works, plans, referrals, salary, dashboard, deposits, withdrawals, etc.
  const [portalMode, setPortalMode] = useState('public'); // 'public' | 'customer' | 'admin'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [registrationResult, setRegistrationResult] = useState(null);

  // Authentication & User State
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(EMPTY_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('customer'); // 'customer' | 'admin'

  // Financial & Operational Collections
  const [transactions, setTransactions] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [adminLogs, setAdminLogs] = useState(INITIAL_ADMIN_LOGS);
  const [aiReports, setAiReports] = useState(INITIAL_AI_REPORTS);

  // Platform Configuration
  const [networks, setNetworks] = useState(USDT_NETWORKS);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState([
    { id: "USR-774921", name: "Tariq Al-Mansoor", email: "t.mansoor@sightinvest.ae", country: "United Arab Emirates", balance: 4850.00, plansActive: 3, kycStatus: "Tier 2 Verified", joinDate: "2026-01-14" },
    { id: "USR-774922", name: "Alexander Kramer", email: "a.kramer@zurich-wealth.ch", country: "Switzerland", balance: 12500.00, plansActive: 2, kycStatus: "Tier 2 Verified", joinDate: "2026-02-01" },
    { id: "USR-774923", name: "Nadia Belkacem", email: "n.belkacem@dubai-cre.ae", country: "UAE", balance: 6200.00, plansActive: 1, kycStatus: "Tier 1 Pending", joinDate: "2026-02-19" },
    { id: "USR-774924", name: "Vikram Singhania", email: "vikram@singhania-cap.sg", country: "Singapore", balance: 34000.00, plansActive: 4, kycStatus: "Tier 2 Verified", joinDate: "2026-03-05" },
    { id: "USR-774925", name: "Fatima Al-Sabah", email: "f.alsabah@kuwait-inv.kw", country: "Kuwait", balance: 89000.00, plansActive: 5, kycStatus: "Tier 2 Verified", joinDate: "2026-03-22" }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Toast Alerts
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'gold') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // -------------------------------------------------------------
  // Persistent Firebase Authentication State Listener
  // -------------------------------------------------------------
  const applyAuthenticatedProfile = (fbUser, profileData) => {
    const displayId = profileData?.id || `USR-${fbUser.uid.substring(0, 8).toUpperCase()}`;
    setUser({
      ...EMPTY_USER,
      ...(profileData || {}),
      uid: fbUser.uid,
      firebaseUid: fbUser.uid,
      email: fbUser.email || profileData?.email || '',
      emailVerified: Boolean(fbUser.emailVerified),
      id: displayId,
      fullName: profileData?.fullName || fbUser.displayName || '',
      balances: {
        ...EMPTY_USER.balances,
        ...(profileData?.balances || {})
      }
    });

    if (profileData?.role === 'admin') {
      setCurrentRole('admin');
    } else {
      setCurrentRole('customer');
    }
  };

  const resetGuestState = () => {
    setIsLoggedIn(false);
    setFirebaseUser(null);
    setUser(EMPTY_USER);
    setCurrentRole('customer');
    setTransactions([]);
    setUserPlans([]);
    setReferrals([]);
    setTickets([]);
    setNotifications([]);
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      resetGuestState();
      setAuthLoading(false);
      return;
    }

    let unsubscribeProfile = null;

    const unsubscribeAuth = subscribeToAuthState(async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        setIsLoggedIn(true);
        setTransactions([]);
        setUserPlans([]);
        setReferrals([]);
        setTickets([]);
        setNotifications([]);

        // Subscribe to real-time updates for users/{uid} in Firestore
        unsubscribeProfile = subscribeToUserProfile(
          fbUser.uid,
          (profileData) => {
            if (!profileData) {
              console.log('[AppContext] No profile found, attempting to create one for UID:', fbUser.uid);
              createUserProfileDoc(fbUser.uid, {
                email: fbUser.email,
                fullName: fbUser.displayName,
                emailVerified: Boolean(fbUser.emailVerified)
              }).then((createdProfile) => {
                console.log('[AppContext] Profile created successfully:', createdProfile);
              }).catch((err) => {
                console.error('[AppContext] Profile provisioning error:', err);
                console.error('[AppContext] Error details:', err.code, err.message);
              });
            }
            applyAuthenticatedProfile(fbUser, profileData);
            setAuthLoading(false);
          },
          (err) => {
            console.error('[AppContext] Profile stream error:', err);
            console.error('[AppContext] Error details:', err.code, err.message);
            applyAuthenticatedProfile(fbUser, null);
            setAuthLoading(false);
          }
        );
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        resetGuestState();
        setAuthLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // -------------------------------------------------------------
  // Auth Actions
  // -------------------------------------------------------------
  const captureRegistrationResult = (res, fullNameFallback = '') => {
    const uid = res.user?.uid || res.profile?.uid || '';
    const result = {
      uid,
      displayId: res.profile?.id || (uid ? `USR-${uid.substring(0, 8).toUpperCase()}` : ''),
      email: res.user?.email || res.profile?.email || '',
      fullName: res.profile?.fullName || res.user?.displayName || fullNameFallback,
      emailVerificationSent: Boolean(res.emailVerificationSent),
      createdAt: new Date().toISOString()
    };
    setRegistrationResult(result);
    return result;
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      return { success: false, error: 'Firebase Authentication is not configured. Add credentials in .env.local.' };
    }

    try {
      const res = await loginWithEmail(email, password);
      return { success: true, user: res.user, profile: res.profile };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const register = async (email, password, fullName, country) => {
    if (!isFirebaseConfigured) {
      return { success: false, error: 'Firebase Authentication is not configured. Add credentials in .env.local.' };
    }

    try {
      const res = await registerWithEmail(email, password, fullName, country);

      // Check if Firestore profile creation failed
      if (res.firestoreError) {
        return {
          success: false,
          error: `Account created in Firebase Authentication, but profile creation failed: ${res.firestoreError}. Please ensure Firestore is enabled in Firebase Console and security rules are deployed.`,
          user: res.user,
          partialSuccess: true
        };
      }

      const registration = captureRegistrationResult(res, fullName);
      return { success: true, user: res.user, profile: res.profile, registration };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const loginWithGoogleAuth = async () => {
    if (!isFirebaseConfigured) {
      return { success: false, error: 'Google Authentication is not enabled in Firebase Console. Enable it under Build > Authentication > Sign-in method > Google.' };
    }

    try {
      const res = await loginWithGoogle();
      let registration = null;
      if (res.isNewUser) {
        registration = captureRegistrationResult(res);
      }
      return { success: true, user: res.user, profile: res.profile, isNewUser: res.isNewUser, registration };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await logoutUser();
    } else {
      setIsLoggedIn(false);
    }
    setPortalMode('public');
    setActivePage('home');
    showToast('Signed out of Sight Finance session.', 'gold');
  };

  const sendPasswordReset = async (email) => {
    if (!isFirebaseConfigured) {
      return { success: false, error: 'Firebase Authentication is not configured. Add credentials in .env.local.' };
    }
    try {
      await resetPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const goToAuthPage = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(false);
    setPortalMode('public');
    if (mode === 'register') setActivePage('register');
    else if (mode === 'reset') setActivePage('reset-password');
    else setActivePage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enterCustomerPortal = () => {
    setPortalMode('customer');
    setActivePage('dashboard');
    setCurrentRole('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Permitted Profile Update action (persists to Firestore users/{uid})
  const updateProfileData = async (permittedUpdates) => {
    if (isFirebaseConfigured && firebaseUser) {
      try {
        await updateUserPermittedProfile(firebaseUser.uid, permittedUpdates);
        showToast('Profile information successfully updated in Firestore.', 'gold');
        return { success: true };
      } catch (error) {
        showToast(error.message || 'Profile update failed.', 'danger');
        return { success: false, error: error.message };
      }
    } else {
      // Local state update
      setUser(prev => ({ ...prev, ...permittedUpdates }));
      showToast('Profile updated locally.', 'gold');
      return { success: true };
    }
  };

  // Helper: Log Admin Event
  const logSystemEvent = (event, actor, details, status = 'Success') => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      event,
      actor,
      ip: '194.110.220.8 (Dubai node)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
      status
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  // Role Switcher: seamlessly view Customer Experience or Admin Experience
  const switchRole = (newRole) => {
    if (newRole === 'admin' && user?.role !== 'admin') {
      showToast('Administrator access is limited to authorized accounts.', 'danger');
      return;
    }
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      setPortalMode('admin');
      setActivePage('admin-overview');
      showToast('Switched to Administrator Control Engine', 'gold');
    } else {
      setPortalMode('customer');
      setActivePage('dashboard');
      showToast('Switched to Customer Wealth Portal', 'gold');
    }
  };

  // Action: Add Simulated Deposit — DISABLED IN PHASE 1
  // Client cannot mutate balances. Balance crediting is strictly reserved for
  // backend Cloud Functions upon on-chain consensus verification.
  const processSimulatedDeposit = () => {
    logSystemEvent('Client Deposit Credit Blocked', 'Security Engine', 'Client-side balance crediting is disabled. Backend verification required.', 'Rejected');
    return {
      success: false,
      reason: 'CLIENT_CREDIT_DISABLED',
      message: 'Direct balance crediting from the client is disabled for security compliance.'
    };
  };

  // Action: Request Simulated Withdrawal (non-real-money prototype)
  const requestWithdrawal = ({ amount, network, destinationAddress }) => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > user.balances.availableUSDT) {
      return { success: false, reason: 'INSUFFICIENT_BALANCE' };
    }

    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Withdrawal',
      asset: 'USDT',
      network: network,
      amount: parsedAmount,
      destinationAddress: destinationAddress,
      status: 'Submitted', // Follows status flow: Draft -> Submitted -> Under Review -> Approved -> Processing -> Completed
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: 'Simulated withdrawal queued for compliance review'
    };

    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        availableUSDT: prev.balances.availableUSDT - parsedAmount
      }
    }));

    logSystemEvent('Withdrawal Submitted', user.fullName, `Requested withdrawal of $${parsedAmount} USDT to ${destinationAddress.substring(0, 8)}...`, 'Submitted');
    showToast(`Withdrawal request for $${parsedAmount} USDT submitted for compliance review.`, 'gold');

    return { success: true, tx: newTx };
  };

  // Action: Update Transaction Status (Admin Action)
  const updateTransactionStatus = (txId, newStatus, reason = '') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: newStatus,
          note: reason ? `${t.note || ''} | ${reason}` : t.note
        };
      }
      return t;
    }));

    logSystemEvent('Transaction State Updated', 'Administrator', `Transaction ${txId} transitioned to: ${newStatus}`, 'Updated');
    showToast(`Transaction ${txId} updated to ${newStatus}`, 'gold');
  };

  // Action: Subscribe / Activate Plan (Demo)
  const activatePlan = (planFamily, tierName, item) => {
    if (user.balances.availableUSDT < item.entry) {
      showToast(`Insufficient simulated balance. You need $${item.entry} USDT.`, 'danger');
      return false;
    }

    const newPlan = {
      id: `UP-${Math.floor(100 + Math.random() * 900)}`,
      planName: `${planFamily} (${tierName} #${item.no})`,
      entryAmount: item.entry,
      targetListed: item.listed,
      dailyYield: item.dailyYield,
      duration: item.duration,
      startDate: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      accruedYield: 0.00,
      status: 'Active'
    };

    setUserPlans(prev => [newPlan, ...prev]);
    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        availableUSDT: prev.balances.availableUSDT - item.entry,
        activeInvested: prev.balances.activeInvested + item.entry
      }
    }));

    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Investment',
      asset: 'USDT',
      network: 'Internal',
      amount: item.entry,
      plan: newPlan.planName,
      status: 'Completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Allocated to ${newPlan.planName}`
    };
    setTransactions(prev => [newTx, ...prev]);

    logSystemEvent('Plan Allocation', user.fullName, `Activated demo plan ${newPlan.planName} for $${item.entry}`, 'Success');
    showToast(`Successfully subscribed to ${newPlan.planName} ($${item.entry} USDT)!`, 'gold');
    return true;
  };

  // Action: Submit Support Ticket
  const createSupportTicket = (subject, category, priority, message) => {
    const newTicket = {
      id: `TCK-${Math.floor(880 + Math.random() * 120)}`,
      subject,
      category,
      priority,
      status: 'Open',
      date: new Date().toISOString().replace('T', ' ').substring(0, 10),
      lastReply: `You: ${message}`
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast('Support ticket dispatched to Dubai Helpdesk.', 'gold');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        portalMode,
        setPortalMode,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        showDemoBanner,
        setShowDemoBanner,
        registrationResult,
        setRegistrationResult,
        firebaseUser,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        authLoading,
        currentRole,
        switchRole,
        login,
        register,
        loginWithGoogleAuth,
        logout,
        sendPasswordReset,
        goToAuthPage,
        enterCustomerPortal,
        isFirebaseConfigured,
        updateProfileData,
        transactions,
        setTransactions,
        userPlans,
        setUserPlans,
        referrals,
        setReferrals,
        tickets,
        setTickets,
        adminLogs,
        setAdminLogs,
        aiReports,
        setAiReports,
        networks,
        setNetworks,
        allRegisteredUsers,
        setAllRegisteredUsers,
        notifications,
        setNotifications,
        toast,
        showToast,
        processSimulatedDeposit,
        requestWithdrawal,
        updateTransactionStatus,
        activatePlan,
        createSupportTicket,
        logSystemEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
