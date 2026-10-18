import React, { createContext, useContext, useState } from 'react';
import {
  BRAND,
  INVESTMENT_PLANS,
  REFERRAL_PROGRAM,
  SALARY_LEVELS,
  USDT_NETWORKS,
  TRANSACTION_STATUSES,
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PLANS,
  INITIAL_REFERRALS,
  INITIAL_TICKETS,
  INITIAL_ADMIN_LOGS,
  INITIAL_AI_REPORTS,
  FAQS
} from '../data/platformData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State
  const [activePage, setActivePage] = useState('home'); // home, about, services, how-it-works, plans, referrals, salary, dashboard, deposits, withdrawals, etc.
  const [portalMode, setPortalMode] = useState('public'); // 'public' | 'customer' | 'admin'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // User State
  const [user, setUser] = useState(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Pre-authenticated demo experience for smooth evaluation
  const [currentRole, setCurrentRole] = useState('customer'); // 'customer' | 'admin'

  // Financial & Operational Collections
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [userPlans, setUserPlans] = useState(INITIAL_USER_PLANS);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
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
  const [notifications, setNotifications] = useState([
    { id: 'NT-1', title: 'Simulated Yield Credited', text: 'Daily return of +$66.00 credited across 3 active demo plans.', time: '10 mins ago', read: false },
    { id: 'NT-2', title: '10% Referral Bonus Released', text: 'You received +$100.00 USDT bonus for referring Alexander K.', time: '2 hours ago', read: false },
    { id: 'NT-3', title: 'Salary Tier Milestone', text: 'You have 38 verified referrals. Only 12 more to reach Silver Tier (Domestic Tour Benefit).', time: '1 day ago', read: false }
  ]);

  // Toast Alerts
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'gold') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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

  // Action: Add Deposit
  const processSimulatedDeposit = ({ network, amount, txHash }) => {
    // Duplicate Hash Detection
    const isDuplicate = transactions.some(t => t.txHash && t.txHash.toLowerCase() === txHash.toLowerCase());
    if (isDuplicate) {
      logSystemEvent('Duplicate Deposit Rejected', 'Security Engine', `Attempted reuse of Tx Hash: ${txHash.substring(0, 12)}...`, 'Rejected');
      return { success: false, reason: 'DUPLICATE_TX_HASH' };
    }

    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Deposit',
      asset: 'USDT',
      network: network,
      amount: parseFloat(amount),
      txHash: txHash,
      walletAddress: networks[network].depositAddress,
      status: 'Completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      confirmations: `${networks[network].requiredConfirmations}/${networks[network].requiredConfirmations}`,
      note: 'Verified On-Chain (Demo Simulation)'
    };

    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        availableUSDT: prev.balances.availableUSDT + parseFloat(amount)
      }
    }));

    logSystemEvent('Deposit Confirmed', 'Oracle Gateway', `Credited +$${amount} USDT (${network}) to ${user.id}`, 'Success');

    setNotifications(prev => [
      {
        id: `NT-${Date.now()}`,
        title: 'USDT Deposit Verified',
        text: `Successfully verified and credited +$${amount} USDT via ${network}.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return { success: true, tx: newTx };
  };

  // Action: Request Withdrawal
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
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        currentRole,
        switchRole,
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
