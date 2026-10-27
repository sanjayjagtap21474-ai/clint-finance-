import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  createUserProfileDoc,
  subscribeToAllUsers,
  subscribeToAllTickets,
  subscribeToUserPlans,
  purchaseInvestmentPlanDoc,
  subscribeToUserDepositRequests,
  subscribeToUserTransactions,
  subscribeToAllTransactions,
  updateTransactionStatusInFirestore
} from '../firebase/firestoreService';
import {
  DEFAULT_BRANDING,
  DEFAULT_CONTENT,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_FEATURE_SETTINGS,
  DEFAULT_INVESTMENT_PLANS,
  DEFAULT_REFERRAL_REWARDS,
  DEFAULT_FAQS,
  DEFAULT_LEGAL_PAGES,
  subscribeToSiteSettingDoc,
  saveSiteSettingDoc,
  recordAdminAuditLog,
  subscribeToAdminLogs
} from '../firebase/siteSettingsService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State
  const [activePage, setActivePage] = useState('home');
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
  const [userDepositRequests, setUserDepositRequests] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [tickets, setTickets] = useState([]);
  // adminLogs now has two sources: legacy local INITIAL_ADMIN_LOGS (for prototype display)
  // and the real Firestore adminLogs subscribed below.
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

  // ============================================================
  // SITE SETTINGS STATE (Stage 1 — Dynamic Configuration Layer)
  // ============================================================
  // All fields default to platform constants from platformData.js / siteSettingsService.js.
  // When Firebase is configured, each is overwritten in real-time by Firestore subscriptions.
  // This means the existing website continues to work identically with zero downtime
  // while Firestore data is being loaded or is absent.

  const [siteBranding, setSiteBranding] = useState(DEFAULT_BRANDING);
  const [siteContent, setSiteContent] = useState(DEFAULT_CONTENT);
  const [homepageSections, setHomepageSections] = useState(DEFAULT_HOMEPAGE_SECTIONS);
  const [dashboardLayout, setDashboardLayout] = useState(DEFAULT_DASHBOARD_LAYOUT);
  const [featureSettings, setFeatureSettings] = useState(DEFAULT_FEATURE_SETTINGS);
  const [siteInvestmentPlans, setSiteInvestmentPlans] = useState(DEFAULT_INVESTMENT_PLANS);
  const [siteReferralRewards, setSiteReferralRewards] = useState(DEFAULT_REFERRAL_REWARDS);
  const [siteFaqs, setSiteFaqs] = useState(DEFAULT_FAQS);
  const [siteLegal, setSiteLegal] = useState(DEFAULT_LEGAL_PAGES);
  const [siteSettingsLoading, setSiteSettingsLoading] = useState(true);

  // ============================================================
  // SITE SETTINGS: FIRESTORE REAL-TIME SUBSCRIPTIONS
  // Subscribes once on mount. Each module is independent so a
  // partial failure (e.g. missing 'legal' doc) does not affect others.
  // All subscriptions fall back to defaults gracefully.
  // ============================================================
  useEffect(() => {
    let settled = 0;
    const TOTAL_MODULES = 9;

    const markSettled = () => {
      settled++;
      if (settled >= TOTAL_MODULES) setSiteSettingsLoading(false);
    };

    const unsubBranding = subscribeToSiteSettingDoc('branding', (data) => {
      setSiteBranding(data);
      markSettled();
    });
    const unsubContent = subscribeToSiteSettingDoc('content', (data) => {
      setSiteContent(data);
      markSettled();
    });
    const unsubSections = subscribeToSiteSettingDoc('homepageSections', (data) => {
      setHomepageSections(Array.isArray(data) ? data : DEFAULT_HOMEPAGE_SECTIONS);
      markSettled();
    });
    const unsubDashboard = subscribeToSiteSettingDoc('dashboardLayout', (data) => {
      setDashboardLayout(data);
      markSettled();
    });
    const unsubFeatures = subscribeToSiteSettingDoc('features', (data) => {
      setFeatureSettings(data);
      markSettled();
    });
    const unsubPlans = subscribeToSiteSettingDoc('investmentPlans', (data) => {
      setSiteInvestmentPlans(data);
      markSettled();
    });
    const unsubRewards = subscribeToSiteSettingDoc('referralRewards', (data) => {
      setSiteReferralRewards(data);
      markSettled();
    });
    const unsubFaqs = subscribeToSiteSettingDoc('faqs', (data) => {
      setSiteFaqs(Array.isArray(data) ? data : DEFAULT_FAQS);
      markSettled();
    });
    const unsubLegal = subscribeToSiteSettingDoc('legal', (data) => {
      setSiteLegal(data);
      markSettled();
    });

    // Real-time Firestore subscriptions for users and tickets
    const unsubAllUsers = subscribeToAllUsers(
      (usersList) => {
        setAllRegisteredUsers(Array.isArray(usersList) ? usersList : []);
      },
      (err) => {
        console.warn('[AppContext] All users subscription skipped:', err.message);
      }
    );

    const unsubAllTickets = subscribeToAllTickets(
      (ticketList) => {
        setTickets(Array.isArray(ticketList) ? ticketList : []);
      },
      (err) => {
        console.warn('[AppContext] All tickets subscription skipped:', err.message);
      }
    );

    // Real-time Firestore admin log subscription (supplements local prototype logs)
    const unsubAdminLogs = subscribeToAdminLogs(
      (firestoreLogs) => {
        if (firestoreLogs && firestoreLogs.length > 0) {
          // Merge Firestore logs on top, keeping local prototype entries as fallback
          setAdminLogs(prev => {
            const merged = [...firestoreLogs, ...INITIAL_ADMIN_LOGS];
            return merged;
          });
        }
      },
      (err) => {
        // Non-fatal: admin logs subscription fails silently (likely missing Custom Claims)
        console.warn('[AppContext] adminLogs subscription skipped:', err.message);
      }
    );

    return () => {
      unsubBranding();
      unsubContent();
      unsubSections();
      unsubDashboard();
      unsubFeatures();
      unsubPlans();
      unsubRewards();
      unsubFaqs();
      unsubLegal();
      unsubAdminLogs();
      unsubAllUsers();
      unsubAllTickets();
    };
  }, []);

  const showToast = (message, type = 'gold') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ============================================================
  // ADMIN SAVE HELPER
  // All admin config writes go through this single point so that:
  //   1. The Firestore write is attempted only when Firebase is available.
  //   2. An audit log entry is always created alongside the write.
  //   3. On Firestore write failure (e.g., Custom Claims not yet configured),
  //      a clear error toast is shown — the local state IS updated so the UI
  //      preview works during development, but the failure is communicated.
  //   4. Financial data (balances, investment returns) is NEVER mutated here.
  // ============================================================
  const saveAdminSetting = useCallback(async (moduleName, data, localSetter) => {
    // Update local state immediately for responsive UI preview
    if (localSetter) localSetter(data);

    const actor = {
      uid: firebaseUser?.uid || 'prototype-admin',
      email: firebaseUser?.email || 'admin@sightfinance.io'
    };

    const result = await saveSiteSettingDoc(moduleName, data, actor);

    if (result.success) {
      showToast(`${moduleName} settings saved to Firestore.`, 'gold');
    } else {
      // Firestore write blocked (Custom Claims not set up yet in prototype)
      showToast(
        `Local preview updated. Firestore write pending admin authorization: ${result.error}`,
        'warning'
      );
      console.warn(`[AppContext] saveAdminSetting '${moduleName}' Firestore error:`, result.error);
    }

    return result;
  }, [firebaseUser]);

  // ============================================================
  // TYPED ADMIN SAVE ACTIONS (one per module)
  // These are the functions exposed to the Admin Panel components.
  // Financial fields (balances, investment ROI) are explicitly excluded.
  // ============================================================

  const saveAdminBranding = useCallback((data) =>
    saveAdminSetting('branding', data, setSiteBranding), [saveAdminSetting]);

  const saveAdminContent = useCallback((data) =>
    saveAdminSetting('content', data, setSiteContent), [saveAdminSetting]);

  const saveAdminHomepageSections = useCallback((data) =>
    saveAdminSetting('homepageSections', data, setHomepageSections), [saveAdminSetting]);

  const saveAdminDashboardLayout = useCallback((data) =>
    saveAdminSetting('dashboardLayout', data, setDashboardLayout), [saveAdminSetting]);

  const saveAdminFeatures = useCallback((data) =>
    saveAdminSetting('features', data, setFeatureSettings), [saveAdminSetting]);

  const saveAdminInvestmentPlans = useCallback((data) =>
    // NOTE: Only display settings (names, labels, notes) may be changed here.
    // Actual financial yields, rates, and balances are never mutated by admin UI.
    saveAdminSetting('investmentPlans', data, setSiteInvestmentPlans), [saveAdminSetting]);

  const saveAdminReferralRewards = useCallback((data) =>
    // NOTE: Only display/configuration settings changed. Real bonus credit
    // calculations remain locked and require backend Cloud Functions.
    saveAdminSetting('referralRewards', data, setSiteReferralRewards), [saveAdminSetting]);

  const saveAdminFaqs = useCallback((data) =>
    saveAdminSetting('faqs', data, setSiteFaqs), [saveAdminSetting]);

  const saveAdminLegal = useCallback((data) =>
    saveAdminSetting('legal', data, setSiteLegal), [saveAdminSetting]);

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

    // NOTE: Role is read from the Firestore profile document (server-set field).
    // Customers cannot set role='admin' on their own profile because:
    //   1. firestore.rules now enforces isPermittedProfileUpdate() which
    //      PREVENTS any client from changing the role field on their own document.
    //   2. The admin write path (siteSettings, adminLogs) requires Custom Claims
    //      (request.auth.token.admin == true), which only a server process can set.
    // The role field here is DISPLAY-ONLY for routing — the actual privileged
    // Firestore writes are gate-kept by server-verified Custom Claims.
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
    let unsubscribePlans = null;
    let unsubscribeDeposits = null;

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

        // Subscribe to real-time userPlans for user
        unsubscribePlans = subscribeToUserPlans(
          fbUser.uid,
          (records) => {
            if (records && records.length > 0) {
              setUserPlans(records);
            }
          },
          (err) => {
            console.warn('[AppContext] userPlans subscription skipped:', err.message);
          }
        );

        // Subscribe to real-time deposit requests for user
        unsubscribeDeposits = subscribeToUserDepositRequests(
          fbUser.uid,
          (records) => {
            if (records && records.length > 0) {
              setUserDepositRequests(records);
            }
          },
          (err) => {
            console.warn('[AppContext] userDepositRequests subscription skipped:', err.message);
          }
        );
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        if (unsubscribePlans) {
          unsubscribePlans();
          unsubscribePlans = null;
        }
        if (unsubscribeDeposits) {
          unsubscribeDeposits();
          unsubscribeDeposits = null;
        }
        resetGuestState();
        setAuthLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribePlans) unsubscribePlans();
      if (unsubscribeDeposits) unsubscribeDeposits();
    };
  }, []);

  // Real-time transactions subscription (Customer or Admin)
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) {
      return;
    }

    let unsubscribe = null;
    if (currentRole === 'admin') {
      unsubscribe = subscribeToAllTransactions(
        (records) => {
          if (records) setTransactions(records);
        },
        (err) => console.warn('[AppContext] All transactions subscription error:', err)
      );
    } else {
      unsubscribe = subscribeToUserTransactions(
        firebaseUser.uid,
        (records) => {
          if (records) setTransactions(records);
        },
        (err) => console.warn('[AppContext] User transactions subscription error:', err)
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseUser, currentRole]);

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
      logSystemEvent('User Login', email, 'Successfully authenticated via Email/Password', 'Success');
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

      logSystemEvent('User Registration', email, `New member account registered (${country})`, 'Success');
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
      logSystemEvent('Google Auth Login', res.user.email, 'Successfully authenticated via Google OAuth', 'Success');
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

  // Helper: Log Admin Event (also writes to Firestore if authenticated admin)
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

    // Also persist to Firestore adminLogs if the current user has admin access
    // (will silently fail if Custom Claims are not set — non-destructive)
    if (firebaseUser && user?.role === 'admin') {
      recordAdminAuditLog({
        adminUid: firebaseUser.uid,
        adminEmail: firebaseUser.email || 'admin',
        module: 'system',
        action: event,
        details,
        status
      }).catch(() => {});
    }
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
      status: 'Submitted',
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
  const updateTransactionStatus = async (txId, newStatus, reason = '') => {
    if (isFirebaseConfigured) {
      await updateTransactionStatusInFirestore(txId, newStatus, reason);
    }
    setTransactions(prev => prev.map(t => {
      if (t.docId === txId || t.id === txId) {
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
        // Navigation
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

        // Auth & User
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

        // Operational Collections
        transactions,
        setTransactions,
        userPlans,
        setUserPlans,
        userDepositRequests,
        setUserDepositRequests,
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

        // UI
        toast,
        showToast,

        // Actions
        processSimulatedDeposit,
        requestWithdrawal,
        updateTransactionStatus,
        activatePlan,
        createSupportTicket,
        logSystemEvent,

        // ========================================================
        // SITE SETTINGS (Stage 1)
        // Read-only access for all components; writes via admin helpers below.
        // ========================================================
        siteSettingsLoading,
        siteBranding,
        siteContent,
        homepageSections,
        dashboardLayout,
        featureSettings,
        siteInvestmentPlans,
        siteReferralRewards,
        siteFaqs,
        siteLegal,

        // Admin Write Actions (used only by AdminPortal — all guarded by admin role check)
        saveAdminBranding,
        saveAdminContent,
        saveAdminHomepageSections,
        saveAdminDashboardLayout,
        saveAdminFeatures,
        saveAdminInvestmentPlans,
        saveAdminReferralRewards,
        saveAdminFaqs,
        saveAdminLegal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
