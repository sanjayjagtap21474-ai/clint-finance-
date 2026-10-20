// SIGHT FINANCE PLATFORM SPECIFICATION DATA
// All figures are demonstrative and subject to regulatory, compliance and financial review.

export const BRAND = {
  name: "SIGHT FINANCE",
  tagline: "Institutional Digital Wealth & USDT Clearing Gateway",
  jurisdiction: "Dubai, United Arab Emirates",
  legalEntity: "Sight Financial Technologies Ltd.",
  operatingStatus: "OPERATIONAL",
  contactEmail: "compliance@sightfinance.ae",
  supportEmail: "support@sightfinance.ae",
  address: "DIFC Gate Precinct, Building 4, Level 7, Dubai, UAE"
};

// 7. PROPOSED INVESTMENT PLAN STRUCTURE
// Plan A: 5% daily-growth label | Plan B: 6% daily-growth label
export const INVESTMENT_PLANS = {
  planA: {
    id: "plan-a",
    name: "Plan A — Prime Core",
    label: "5% Daily-Growth Label",
    rate: 0.05,
    ratePercent: "5%",
    description: "Proposed institutional yield model with 5% nominal daily growth label across 3 duration-calibrated tiers.",
    tiers: {
      basic: {
        id: "plan-a-basic",
        name: "Basic",
        tierLabel: "Entry Access",
        duration: "1 year",
        durationDays: 365,
        payoutFrequency: "Daily Simulated",
        items: [
          { no: 1, entry: 10, listed: 125, duration: "1 year", dailyYield: 0.50 },
          { no: 2, entry: 25, listed: 310, duration: "1 year", dailyYield: 1.25 },
          { no: 3, entry: 50, listed: 625, duration: "1 year", dailyYield: 2.50 },
          { no: 4, entry: 75, listed: 930, duration: "1 year", dailyYield: 3.75 },
          { no: 5, entry: 100, listed: 1200, duration: "1 year", dailyYield: 5.00 },
          { no: 6, entry: 125, listed: 1560, duration: "1 year", dailyYield: 6.25 },
          { no: 7, entry: 150, listed: 1850, duration: "1 year", dailyYield: 7.50 },
          { no: 8, entry: 200, listed: 2500, duration: "1 year", dailyYield: 10.00 },
          { no: 9, entry: 500, listed: 6250, duration: "1 year", dailyYield: 25.00 },
          { no: 10, entry: 1000, listed: 12500, duration: "1 year", dailyYield: 50.00 }
        ]
      },
      prime: {
        id: "plan-a-prime",
        name: "Prime",
        tierLabel: "Extended Horizon",
        duration: "2 years",
        durationDays: 730,
        payoutFrequency: "Daily Simulated",
        items: [
          { no: 1, entry: 50, listed: 1250, duration: "2 years", dailyYield: 2.50 },
          { no: 2, entry: 100, listed: 2500, duration: "2 years", dailyYield: 5.00 },
          { no: 3, entry: 200, listed: 5000, duration: "2 years", dailyYield: 10.00 },
          { no: 4, entry: 250, listed: 6250, duration: "2 years", dailyYield: 12.50 },
          { no: 5, entry: 500, listed: 12500, duration: "2 years", dailyYield: 25.00 }
        ]
      },
      bolt: {
        id: "plan-a-bolt",
        name: "Bolt",
        tierLabel: "High Capital",
        duration: "1 year",
        durationDays: 365,
        payoutFrequency: "Daily Simulated",
        items: [
          { no: 1, entry: 1000, listed: 12500, duration: "1 year", dailyYield: 50.00 },
          { no: 2, entry: 2500, listed: 31500, duration: "1 year", dailyYield: 125.00 },
          { no: 3, entry: 5000, listed: 62500, duration: "1 year", dailyYield: 250.00 },
          { no: 4, entry: 7500, listed: 93500, duration: "1 year", dailyYield: 375.00 },
          { no: 5, entry: 10000, listed: 125000, duration: "1 year", dailyYield: 500.00 }
        ]
      }
    }
  },
  planB: {
    id: "plan-b",
    name: "Plan B — Accelerated Yield",
    label: "6% Daily-Growth Label",
    rate: 0.06,
    ratePercent: "6%",
    description: "High-velocity simulated growth model with 6% nominal daily-growth label.",
    tiers: {
      basic: {
        id: "plan-b-basic",
        name: "Basic",
        tierLabel: "Accelerated Micro",
        duration: "1 year",
        durationDays: 365,
        payoutFrequency: "Daily Simulated",
        items: [
          { no: 1, entry: 25, listed: 370, duration: "1 year", dailyYield: 1.50 },
          { no: 2, entry: 50, listed: 750, duration: "1 year", dailyYield: 3.00 },
          { no: 3, entry: 75, listed: 1125, duration: "1 year", dailyYield: 4.50 },
          { no: 4, entry: 100, listed: 1500, duration: "1 year", dailyYield: 6.00 },
          { no: 5, entry: 125, listed: 1800, duration: "1 year", dailyYield: 7.50 },
          { no: 6, entry: 150, listed: 2250, duration: "1 year", dailyYield: 9.00 },
          { no: 7, entry: 175, listed: 2625, duration: "1 year", dailyYield: 10.50 },
          { no: 8, entry: 200, listed: 3000, duration: "1 year", dailyYield: 12.00 }
        ]
      },
      prime: {
        id: "plan-b-prime",
        name: "Prime",
        tierLabel: "Accelerated Mid",
        duration: "1 year",
        durationDays: 365,
        payoutFrequency: "Daily Simulated",
        items: [
          { no: 1, entry: 250, listed: 3750, duration: "1 year", dailyYield: 15.00 },
          { no: 2, entry: 500, listed: 7500, duration: "1 year", dailyYield: 30.00 },
          { no: 3, entry: 750, listed: 11250, duration: "1 year", dailyYield: 45.00 },
          { no: 4, entry: 1000, listed: 15000, duration: "1 year", dailyYield: 60.00 }
        ]
      },
      bolt: {
        id: "plan-b-bolt",
        name: "Bolt",
        tierLabel: "Institutional Ultra",
        duration: "1 year",
        durationDays: 365,
        payoutFrequency: "Daily Simulated",
        hasAdminInconsistencyWarning: true,
        inconsistencyNote: "ADMIN AUDIT ALERT: In Plan B Bolt, rows 1-5 list listed amounts ($3,700-$9,700) slightly above entry ($2,500-$6,500), whereas rows 6-8 jump significantly to $112,500-$142,500. Preserved accurately per owner specifications; marked for formal financial compliance review.",
        items: [
          { no: 1, entry: 2500, listed: 3700, duration: "1 year", dailyYield: 150.00 },
          { no: 2, entry: 3500, listed: 5200, duration: "1 year", dailyYield: 210.00 },
          { no: 3, entry: 4500, listed: 6700, duration: "1 year", dailyYield: 270.00 },
          { no: 4, entry: 5500, listed: 8200, duration: "1 year", dailyYield: 330.00 },
          { no: 5, entry: 6500, listed: 9700, duration: "1 year", dailyYield: 390.00 },
          { no: 6, entry: 7500, listed: 112500, duration: "1 year", dailyYield: 450.00 },
          { no: 7, entry: 8500, listed: 127500, duration: "1 year", dailyYield: 510.00 },
          { no: 8, entry: 9500, listed: 142500, duration: "1 year", dailyYield: 570.00 }
        ]
      }
    }
  }
};

// 8. REFERRAL PROGRAMME
export const REFERRAL_PROGRAM = {
  bonusPercentage: 10,
  exampleInvestment: 1000,
  exampleBonus: 100,
  rules: [
    "Qualifying direct referral investment earns instant 10% simulated bonus credit.",
    "Anti-Abuse Engine: Self-referrals and duplicate IP registrations are blocked.",
    "Bonus statuses: Pending, Eligible, Paid, or Cancelled pending admin audit.",
    "Referral link uniquely tied to cryptographic account UID."
  ]
};

// 9. SALARY & REWARDS PROGRAMME
export const SALARY_LEVELS = [
  {
    level: "Basic",
    rank: 1,
    badge: "Bronze Executive",
    requiredDirectReferrals: 25,
    monthlySalaryRange: "$25 – $30 / month",
    monthlySalaryMin: 25,
    monthlySalaryMax: 30,
    travelBenefits: "None specified",
    color: "#CD7F32",
    features: ["Dedicated Account Manager", "Monthly Automated Yield Statement", "Standard Withdrawal Clearance"]
  },
  {
    level: "Silver",
    rank: 2,
    badge: "Silver Ambassador",
    requiredDirectReferrals: 50,
    monthlySalaryRange: "$50 – $75 / month",
    monthlySalaryMin: 50,
    monthlySalaryMax: 75,
    travelBenefits: "1 Domestic Tour (Complimentary)",
    tourDetails: "Full luxury domestic retreat (e.g. Desert Oasis Resort & Spa, Ras Al Khaimah)",
    color: "#E2E8F0",
    features: ["Priority Clearing Queue", "Quarterly Executive Briefings", "1 Luxury Domestic Tour Voucher"]
  },
  {
    level: "Gold",
    rank: 3,
    badge: "Gold Sovereign",
    requiredDirectReferrals: 100,
    monthlySalaryRange: "$100 / month",
    monthlySalaryMin: 100,
    monthlySalaryMax: 100,
    travelBenefits: "2 Domestic Tours + 1 International Tour",
    tourDetails: "2 Luxury UAE domestic retreats + 1 International all-inclusive trip (Dubai / Maldives / Switzerland VIP package)",
    color: "#F6C445",
    features: ["VIP Institutional Concierge", "Zero-Fee Expedited Settlement", "Annual International VIP Delegation Invitation", "2 Domestic Retreats + 1 International Tour"]
  }
];

// 5. USDT NETWORKS CONFIGURATION
//
// SECURITY NOTE (Phase 1):
//   depositAddress is intentionally null on ALL networks.
//   No wallet addresses will be displayed to users until a real, audited
//   custody address has been provisioned through the secure backend
//   infrastructure and admin configuration process.
//   Do NOT populate depositAddress here. It must never be set in frontend
//   source files, browser storage, or Firestore client-accessible documents.
export const USDT_NETWORKS = {
  TRC20: {
    id: "TRC20",
    name: "TRON (TRC20)",
    chain: "TRON Mainnet",
    tokenStandard: "TRC-20 USDT (Tether)",
    depositAddress: null,           // PRODUCTION: set via secure backend only
    depositSetupPending: true,      // Phase 1: address not yet configured
    contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    explorerUrl: "https://tronscan.org/#/transaction/",
    blockTime: "3s",
    requiredConfirmations: 12,
    feeNotice: "Approx. ~1.5 - 2.5 USDT network fee paid by sender",
    status: "Pending Setup"
  },
  BEP20: {
    id: "BEP20",
    name: "BNB Smart Chain (BEP20)",
    chain: "BNB Smart Chain (BSC)",
    tokenStandard: "BEP-20 USDT (Binance-Peg)",
    depositAddress: null,           // PRODUCTION: set via secure backend only
    depositSetupPending: true,      // Phase 1: address not yet configured
    contractAddress: "0x55d398326f99059fF775485246999027B3197955",
    explorerUrl: "https://bscscan.com/tx/",
    blockTime: "3s",
    requiredConfirmations: 15,
    feeNotice: "Approx. ~0.15 - 0.30 USDT network gas paid in BNB",
    status: "Pending Setup"
  }
};

// TRANSACTION STATUSES (Prompt 6)
export const TRANSACTION_STATUSES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled"
];

// INITIAL SAMPLE STATE FOR DEMO
export const INITIAL_USER = {
  id: "USR-774921",
  fullName: "Tariq Al-Mansoor",
  email: "t.mansoor@sightinvest.ae",
  country: "United Arab Emirates",
  role: "customer", // customer | admin
  verifiedStatus: "KYC Verified (Tier 2)",
  memberSince: "Jan 14, 2026",
  referralCode: "SIGHT-7749",
  referralLink: "https://sightfinance.io/ref/SIGHT-7749",
  balances: {
    availableUSDT: 4850.00,
    pendingDeposits: 500.00,
    activeInvested: 6250.00,
    totalProfitSimulated: 1780.50,
    totalReferralBonus: 350.00,
    totalWithdrawn: 1200.00
  },
  directReferralsCount: 38,
  salaryLevel: "Basic",
  nextSalaryGoal: 50,
  unreadNotifications: 3
};

/** Logged-out / newly authenticated empty profile. Never used as a fake logged-in user. */
export const EMPTY_USER = {
  id: '',
  uid: '',
  fullName: '',
  email: '',
  country: '',
  role: 'customer',
  verifiedStatus: 'Unverified (KYC Required)',
  memberSince: '',
  referralCode: '',
  referralLink: '',
  balances: {
    availableUSDT: 0.00,
    pendingDeposits: 0.00,
    activeInvested: 0.00,
    totalProfitSimulated: 0.00,
    totalReferralBonus: 0.00,
    totalWithdrawn: 0.00
  },
  directReferralsCount: 0,
  salaryLevel: 'None',
  nextSalaryGoal: 25,
  unreadNotifications: 0,
  accountStatus: 'active',
  emailVerified: false,
  phoneNumber: ''
};

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-99801",
    type: "Deposit",
    asset: "USDT",
    network: "TRC20",
    amount: 1000.00,
    txHash: "4f7a9d20c58b19e2c451298bf0d8c7ea1b72c91834e5a9b7cd0182479fa6b215",
    walletAddress: "TV6KjZ8bK6J2eP94nQ2YxPqVpYx28zPjL1",
    status: "Completed",
    date: "2026-10-14 14:22:10",
    confirmations: "12/12",
    note: "Demo On-Chain Confirmed"
  },
  {
    id: "TX-99802",
    type: "Investment",
    asset: "USDT",
    network: "Internal",
    amount: 1000.00,
    plan: "Plan A — Prime Core (Bolt #1)",
    status: "Completed",
    date: "2026-10-14 15:05:00",
    note: "Allocated to 1-Year Core Yield"
  },
  {
    id: "TX-99803",
    type: "Bonus",
    asset: "USDT",
    network: "Internal",
    amount: 100.00,
    status: "Completed",
    date: "2026-10-15 09:12:44",
    note: "10% Direct Referral Bonus from Alex K."
  },
  {
    id: "TX-99804",
    type: "Deposit",
    asset: "USDT",
    network: "BEP20",
    amount: 500.00,
    txHash: "0xb7d12f38a9e019c450198ca7120db84e91240cbb173095ba9237612dc4e99f18",
    walletAddress: "0x89D24A6b4C108dC34B8F76DeaE7444158499B77c",
    status: "Under Review",
    date: "2026-10-18 10:15:20",
    confirmations: "15/15",
    note: "Awaiting Compliance Clearing"
  },
  {
    id: "TX-99805",
    type: "Withdrawal",
    asset: "USDT",
    network: "TRC20",
    amount: 300.00,
    destinationAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    status: "Processing",
    date: "2026-10-18 13:40:00",
    note: "Administrator review approved. Dispatching batch transfer."
  }
];

export const INITIAL_USER_PLANS = [
  {
    id: "UP-101",
    planName: "Plan A — Prime (Prime #3)",
    entryAmount: 200,
    targetListed: 5000,
    dailyYield: 10.00,
    duration: "2 years",
    startDate: "2026-06-01",
    progressPercent: 24,
    accruedYield: 1340.00,
    status: "Active"
  },
  {
    id: "UP-102",
    planName: "Plan A — Bolt (Bolt #1)",
    entryAmount: 1000,
    targetListed: 12500,
    dailyYield: 50.00,
    duration: "1 year",
    startDate: "2026-09-15",
    progressPercent: 12,
    accruedYield: 1550.00,
    status: "Active"
  },
  {
    id: "UP-103",
    planName: "Plan B — Basic (Basic #4)",
    entryAmount: 100,
    targetListed: 1500,
    dailyYield: 6.00,
    duration: "1 year",
    startDate: "2026-08-10",
    progressPercent: 19,
    accruedYield: 414.00,
    status: "Active"
  }
];

export const INITIAL_REFERRALS = [
  { id: "REF-01", name: "Alexander Kramer", email: "a.kramer@zurich-wealth.ch", country: "Switzerland", joinedDate: "2026-10-12", depositTotal: 1000, bonusEarned: 100, status: "Active" },
  { id: "REF-02", name: "Nadia Belkacem", email: "n.belkacem@dubai-cre.ae", country: "UAE", joinedDate: "2026-10-10", depositTotal: 500, bonusEarned: 50, status: "Active" },
  { id: "REF-03", name: "Vikram Singhania", email: "vikram@singhania-cap.sg", country: "Singapore", joinedDate: "2026-10-08", depositTotal: 2500, bonusEarned: 250, status: "Active" },
  { id: "REF-04", name: "David Sterling", email: "david.s@london-fx.co.uk", country: "United Kingdom", joinedDate: "2026-10-05", depositTotal: 100, bonusEarned: 10, status: "Active" },
  { id: "REF-05", name: "Fatima Al-Sabah", email: "f.alsabah@kuwait-inv.kw", country: "Kuwait", joinedDate: "2026-10-01", depositTotal: 5000, bonusEarned: 500, status: "Active" }
];

export const INITIAL_TICKETS = [
  { id: "TCK-881", subject: "Inquiry on BEP20 USDT gas fee deduction", category: "Deposit/Withdrawal", priority: "Medium", status: "Resolved", date: "2026-10-15", lastReply: "Support Team: BEP20 transfers require zero BNB from your Sight balance. The gas is settled directly on BSC." },
  { id: "TCK-882", subject: "Silver tier domestic tour redemption timeline", category: "Salary & Rewards", priority: "High", status: "In Progress", date: "2026-10-17", lastReply: "Executive Concierge: Once you reach 50 verified downlines, a dedicated voucher code will be issued within 48 hours." }
];

export const INITIAL_ADMIN_LOGS = [
  { id: "LOG-5510", event: "USDT Deposit Verification", actor: "System Oracle", ip: "185.191.171.4", timestamp: "2026-10-18 15:42:01", details: "Confirmed 12 block headers for TRC20 Tx 4f7a...b215 ($1,000 USDT)", status: "Success" },
  { id: "LOG-5509", event: "Admin Login", actor: "Compliance Admin #1", ip: "194.110.220.8", timestamp: "2026-10-18 14:10:19", details: "MFA challenge completed from Dubai DIFC node", status: "Audit Passed" },
  { id: "LOG-5508", event: "Withdrawal State Changed", actor: "Operations Officer", ip: "194.110.220.8", timestamp: "2026-10-18 13:41:02", details: "TX-99805 moved from Under Review -> Processing", status: "Updated" },
  { id: "LOG-5507", event: "AI Anomaly Detection Run", actor: "SightAI Sentinel", ip: "Internal Core", timestamp: "2026-10-18 12:00:00", details: "Scanned 142 daily transactions. Zero fraudulent hashes detected. Flagged Plan B Bolt rates for human audit.", status: "Warning" },
  { id: "LOG-5506", event: "Referral Bonus Credited", actor: "Reward Engine", ip: "Internal Core", timestamp: "2026-10-18 09:12:44", details: "Credited 10% bonus ($100.00) to USR-774921", status: "Success" }
];

export const INITIAL_AI_REPORTS = [
  {
    id: "REP-2026-10",
    title: "SightAI Daily Liquidity & Plan Sustainability Audit",
    date: "18 Oct 2026",
    summary: "Simulated stress test of 5% and 6% nominal growth labels indicates that real-world operations require strict capital reserves, yield-generation hedging, and VARA/DIFC compliance controls prior to any live financial launch.",
    riskScore: "High Theoretical Exposure (Prototype Safe)",
    metrics: [
      { label: "Nominal Yield Commitment Ratio", value: "3.42x", status: "Requires Hedge Capital" },
      { label: "Duplicate Hash Rejection Rate", value: "100%", status: "Optimal" },
      { label: "Platform Reserve Coverage (Simulated)", value: "128.4%", status: "Healthy Demo" },
      { label: "Affiliate Referral Velocity", value: "+18.4% / wk", status: "Surging" }
    ],
    recommendations: [
      "Ensure all marketing strictly highlights that 5% and 6% are demonstrative plan concepts and never guaranteed.",
      "Resolve Plan B Bolt listed amounts disparity ($3,700-$9,700 vs $112,500+) prior to live deployment.",
      "Deploy multi-sig cold custody with BitGo / Fireblocks before opening UAE customer onboarding."
    ]
  }
];

export const FAQS = [
  {
    q: "Is SIGHT FINANCE currently accepting USDT deposits and investments?",
    a: "Yes. SIGHT FINANCE supports direct USDT transactions across supported TRC-20 and BEP-20 networks with automated clearing, real-time yield distribution, and dedicated account management."
  },
  {
    q: "Which USDT networks are supported on the platform?",
    a: "Sight Finance supports two major networks: TRC-20 (TRON Network) and BEP-20 (BNB Smart Chain). Users must ensure they only broadcast transactions matching the selected network's verified deposit address."
  },
  {
    q: "How does the USDT deposit verification process work?",
    a: "When a customer submits a transaction hash, the on-chain engine monitors the blockchain for: correct token contract address, exact recipient wallet address, required block confirmations (12 for TRC20, 15 for BEP20), and verifies that the transaction hash has never been submitted previously."
  },
  {
    q: "How does the 10% Referral Bonus work?",
    a: "When a customer invites an associate using their unique referral link or code, they are eligible for a 10% simulated bonus on the qualifying investment amount. For example, a $1,000 investment yields an illustrative $100 bonus."
  },
  {
    q: "What are the requirements for the Salary & Rewards Programme?",
    a: "The monthly salary ladders require active verified direct referrals: Basic (25 referrals -> $25–$30/mo), Silver (50 referrals -> $50–$75/mo + 1 Domestic Tour), and Gold (100 referrals -> $100/mo + 2 Domestic Tours + 1 International Tour)."
  },
  {
    q: "Where is SIGHT FINANCE headquartered and what is its regulatory intent?",
    a: "Sight Finance is conceived for operation out of Dubai, United Arab Emirates, with intent to interface with UAE regulatory frameworks (including DFSA and VARA where applicable) once all compliance and operational custody controls are established."
  }
];
