import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from './config';
import {
  BRAND,
  INVESTMENT_PLANS,
  REFERRAL_PROGRAM,
  SALARY_LEVELS,
  FAQS
} from '../data/platformData';

/**
 * ============================================================================
 * DEFAULT SITE SETTINGS (Non-destructive Fallbacks)
 * ============================================================================
 * These default values mirror the existing hardcoded platform data and ensure
 * that if Firestore documents do not exist yet or if the app is offline, the
 * website maintains 100% of its current appearance and behavior.
 */

export const DEFAULT_BRANDING = {
  websiteName: BRAND.name || "SIGHT FINANCE",
  tagline: BRAND.tagline || "YOUR VISION. OUR CAPITAL.",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  primaryColor: "#060b13",
  accentColor: "#d4af37",
  contactEmail: BRAND.contactEmail || "support@sightfinance.io",
  supportEmail: BRAND.supportEmail || "support@sightfinance.io",
  physicalAddress: BRAND.address || "Sight Finance Global • Dubai DIFC Architecture",
  socialLinks: {
    telegram: "https://t.me/sightfinance",
    twitter: "https://x.com/sightfinance",
    linkedin: "https://linkedin.com/company/sightfinance"
  },
  copyrightText: "© 2026 SIGHT FINANCE. All Rights Reserved."
};

export const DEFAULT_CONTENT = {
  heroHeading: "Next-Generation USDT Digital Wealth Architecture",
  heroSubheading: "Designed around mathematical clarity, automated TRC20/BEP20 clearing, structured multi-tier yield models, and autonomous AI risk administration.",
  heroBadge: "INSTITUTIONAL CONCEPT • DUBAI, UAE ARCHITECTURE",
  heroCtaText: "Launch Customer Portal",
  heroSecondaryCtaText: "Review Yield Models",
  aboutHeading: "Pioneering Regulated Digital Asset Growth Architecture",
  aboutSubheading: "Conceived at the intersection of Dubai financial innovation, algorithmic clearing, and rigorous compliance oversight.",
  servicesHeading: "Core Institutional Digital Wealth Capabilities",
  riskNoticeText: "DEMONSTRATION PROTOTYPE: SIGHT FINANCE is currently an interactive interface demonstration and technical prototype. No real-money transactions, live investments, deposits, or withdrawals are enabled. Yield models are illustrative simulations only."
};

export const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 'hero', title: 'Hero & Mission Statement', visible: true, order: 1 },
  { id: 'metrics', title: 'Platform Metrics & Statistics', visible: true, order: 2 },
  { id: 'plans', title: 'Investment Yield Structures', visible: true, order: 3 },
  { id: 'calculator', title: 'Simulated Growth Calculator', visible: true, order: 4 },
  { id: 'howItWorks', title: 'How It Works (Workflow)', visible: true, order: 5 },
  { id: 'features', title: 'Security & Custody Architecture', visible: true, order: 6 },
  { id: 'faq', title: 'Frequently Asked Questions', visible: true, order: 7 },
  { id: 'cta', title: 'Call-To-Action Banner', visible: true, order: 8 }
];

export const DEFAULT_DASHBOARD_LAYOUT = {
  announcementBanner: {
    enabled: true,
    text: "Welcome to Sight Finance Wealth Portal. Platform is operating in technical prototype mode.",
    type: "info" // info | warning | alert
  },
  cardVisibility: {
    basicPackage: true,
    fdPackage: true,
    availableFund: true,
    availableBalance: true,
    totalIncome: true,
    totalWithdrawal: true,
    teamSummary: true,
    incomeBreakdown: true
  },
  navItems: {
    recharge: true,
    packages: true,
    downline: true,
    income: true,
    transactional: true,
    reports: true,
    support: true
  },
  currencySymbol: "$" // Configurable currency display symbol
};

export const DEFAULT_FEATURE_SETTINGS = {
  enableInvestments: true,
  enableReferrals: true,
  enableSalaryProgram: true,
  enableSupportTickets: true,
  maintenanceMode: false,
  maintenanceMessage: "Sight Finance is currently undergoing scheduled platform optimization. All simulated account data remains completely safe.",
  allowAdminBypass: true
};

export const DEFAULT_INVESTMENT_PLANS = INVESTMENT_PLANS;
export const DEFAULT_REFERRAL_REWARDS = {
  bonusPercentage: REFERRAL_PROGRAM.bonusPercentage || 10,
  exampleInvestment: REFERRAL_PROGRAM.exampleInvestment || 1000,
  salaryLevels: SALARY_LEVELS
};

export const DEFAULT_FAQS = FAQS;

export const DEFAULT_LEGAL_PAGES = {
  termsContent: "SIGHT FINANCE operates as an institutional digital asset wealth management and USDT clearing gateway prototype. All structured growth plans, token asset clearing pipelines, and affiliate rewards adhere to governed platform risk management policies. Live operations will not commence until all necessary regulatory approvals are obtained.",
  privacyContent: "We collect only essential operational data required to maintain account integrity: full name, contact email, country of residence, and public wallet addresses. We never store private cryptographic keys or plaintext passwords.",
  riskDisclosureContent: "Digital asset structured investment concepts carry inherent theoretical financial volatility. Yield rates presented on this prototype are for demonstrative modeling only and do not constitute an offer, solicitation, or guarantee of future returns."
};

/** Map of default values by collection document ID */
export const SETTINGS_DEFAULTS_MAP = {
  branding: DEFAULT_BRANDING,
  content: DEFAULT_CONTENT,
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
  dashboardLayout: DEFAULT_DASHBOARD_LAYOUT,
  features: DEFAULT_FEATURE_SETTINGS,
  investmentPlans: DEFAULT_INVESTMENT_PLANS,
  referralRewards: DEFAULT_REFERRAL_REWARDS,
  faqs: DEFAULT_FAQS,
  legal: DEFAULT_LEGAL_PAGES
};

/**
 * ============================================================================
 * FIRESTORE SITE SETTINGS SERVICE
 * ============================================================================
 * Provides persistent read, real-time sync, and audited write operations
 * for platform-wide configurations under the `siteSettings` Firestore collection.
 */

/**
 * Subscribes to real-time changes on a specific site setting document.
 * Falls back to DEFAULT values if document does not exist yet.
 *
 * @param {string} moduleName - Document ID under siteSettings (e.g. 'branding')
 * @param {function} onUpdate - Callback invoked with the merged data
 * @param {function} onError - Optional error callback
 * @returns {function} Unsubscribe function
 */
export function subscribeToSiteSettingDoc(moduleName, onUpdate, onError) {
  const fallback = SETTINGS_DEFAULTS_MAP[moduleName] || {};

  if (!isFirebaseConfigured || !db) {
    onUpdate(fallback);
    return () => {};
  }

  try {
    const docRef = doc(db, 'siteSettings', moduleName);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          // Merge with defaults so any newly added fields have safe fallbacks
          if (Array.isArray(fallback)) {
            onUpdate(remoteData.items || fallback);
          } else {
            onUpdate({ ...fallback, ...remoteData });
          }
        } else {
          onUpdate(fallback);
        }
      },
      (error) => {
        console.warn(`[siteSettingsService] Subscription warning on '${moduleName}':`, error.message);
        onUpdate(fallback);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error(`[siteSettingsService] Exception subscribing to '${moduleName}':`, err);
    onUpdate(fallback);
    return () => {};
  }
}

/**
 * Fetches all site settings once (e.g., during initialization)
 *
 * @returns {Promise<object>} Combined site settings object
 */
export async function fetchAllSiteSettings() {
  const result = {
    branding: { ...DEFAULT_BRANDING },
    content: { ...DEFAULT_CONTENT },
    homepageSections: [...DEFAULT_HOMEPAGE_SECTIONS],
    dashboardLayout: { ...DEFAULT_DASHBOARD_LAYOUT },
    features: { ...DEFAULT_FEATURE_SETTINGS },
    investmentPlans: { ...DEFAULT_INVESTMENT_PLANS },
    referralRewards: { ...DEFAULT_REFERRAL_REWARDS },
    faqs: [...DEFAULT_FAQS],
    legal: { ...DEFAULT_LEGAL_PAGES }
  };

  if (!isFirebaseConfigured || !db) {
    return result;
  }

  try {
    const colRef = collection(db, 'siteSettings');
    const snapshot = await getDocs(colRef);
    snapshot.forEach((docSnap) => {
      const id = docSnap.id;
      const data = docSnap.data();
      if (result[id]) {
        if (Array.isArray(result[id])) {
          result[id] = data.items || data || result[id];
        } else {
          result[id] = { ...result[id], ...data };
        }
      }
    });
  } catch (error) {
    console.warn('[siteSettingsService] fetchAllSiteSettings encountered error, using defaults:', error.message);
  }

  return result;
}

/**
 * Saves a site setting document to Firestore.
 * Automatically appends an audit log entry to /adminLogs.
 *
 * @param {string} moduleName - Module ID under siteSettings
 * @param {object|array} data - Configuration data to persist
 * @param {object} adminActor - { uid, email, displayName }
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function saveSiteSettingDoc(moduleName, data, adminActor = {}) {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      error: 'Firebase is not configured. Changes saved in local session only.'
    };
  }

  try {
    const docRef = doc(db, 'siteSettings', moduleName);
    const payload = Array.isArray(data)
      ? { items: data, updatedAt: serverTimestamp(), updatedBy: adminActor.email || adminActor.uid || 'admin' }
      : { ...data, updatedAt: serverTimestamp(), updatedBy: adminActor.email || adminActor.uid || 'admin' };

    await setDoc(docRef, payload, { merge: true });

    // Append to admin audit trail
    await recordAdminAuditLog({
      adminUid: adminActor.uid || 'unknown',
      adminEmail: adminActor.email || 'administrator',
      module: moduleName,
      action: `Updated ${moduleName} configuration`,
      timestamp: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error(`[siteSettingsService] Failed to save setting '${moduleName}':`, error);
    return {
      success: false,
      error: error.message || 'Firestore write failed. Ensure admin privileges are configured.'
    };
  }
}

/**
 * Records an immutable administrative action to the /adminLogs collection.
 *
 * @param {object} logData - { adminUid, adminEmail, module, action, details }
 */
export async function recordAdminAuditLog(logData) {
  if (!isFirebaseConfigured || !db) return;

  try {
    const logsCol = collection(db, 'adminLogs');
    await addDoc(logsCol, {
      ...logData,
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('[siteSettingsService] Could not write to adminLogs collection:', error.message);
  }
}

/**
 * Subscribes to real-time administrative logs from Firestore.
 *
 * @param {function} onUpdate - Callback with array of log objects
 * @param {function} onError - Optional error callback
 * @returns {function} Unsubscribe function
 */
export function subscribeToAdminLogs(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const logsCol = collection(db, 'adminLogs');
    const q = query(logsCol, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onUpdate(logs);
      },
      (error) => {
        console.warn('[siteSettingsService] adminLogs subscription error:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[siteSettingsService] Exception subscribing to adminLogs:', err);
    onUpdate([]);
    return () => {};
  }
}
