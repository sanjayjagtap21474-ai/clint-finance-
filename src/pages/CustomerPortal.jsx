import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  submitDepositRequest,
  subscribeToUserDepositRequests,
  purchaseInvestmentPlanDoc,
  subscribeToUserPlans
} from '../firebase/firestoreService';
import {
  Home,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Send,
  User,
  Key,
  Wallet,
  X,
  RupeeIcon,
  PackageIcon,
  Clock
} from '../components/Icons';

/* ==========================================================================
   REUSABLE SCREENSHOT-MATCH COMPONENTS
   ========================================================================== */

/** Breadcrumb Capsule (Matches Screenshot Breadcrumb) */
function Breadcrumb({ parent, page }) {
  return (
    <div className="breadcrumb-capsule">
      <span className="crumb-icon">
        <Home size={15} />
      </span>
      <span className="crumb-parent">{parent}</span>
      <span className="crumb-sep">/</span>
      <span className="crumb-active">{page}</span>
    </div>
  );
}

/** Payment Modal Component */
function PaymentModal({ isOpen, onClose, plan, user, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !plan) return null;

  const walletAddress = "0x949e2f6b8160eb88fd6fad3a34470f10afe96df5";
  const network = "BNB Smart Chain (BEP20)";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectPay = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        plan,
        paymentMethod: 'crypto'
      });
      onClose();
    } catch (err) {
      alert('Payment failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 700 }}>Complete Payment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
        </div>

        {/* Plan Summary */}
        <div style={{ background: 'rgba(0, 102, 255, 0.1)', border: '1px solid rgba(0, 102, 255, 0.3)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.75rem' }}>{plan.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ color: '#94A3B8' }}>Amount:</div>
            <div style={{ color: '#10B981', fontWeight: 600 }}>₹ {plan.amount}</div>
            {plan.dailyRoi && (
              <>
                <div style={{ color: '#94A3B8' }}>Daily ROI:</div>
                <div style={{ color: '#FFF', fontWeight: 600 }}>₹ {plan.dailyRoi}</div>
              </>
            )}
            <div style={{ color: '#94A3B8' }}>Days:</div>
            <div style={{ color: '#FFF', fontWeight: 600 }}>{plan.days}</div>
            <div style={{ color: '#94A3B8' }}>Total Return:</div>
            <div style={{ color: '#00B4D8', fontWeight: 600 }}>₹ {plan.totalReturn}</div>
          </div>
        </div>

        {/* Payment Details: USDT (BEP20) Only */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF', marginBottom: '0.75rem' }}>Payment Method: USDT (BEP20)</div>
          <div style={{ background: '#FFF', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}`}
              alt="USDT QR"
              style={{ width: '160px', height: '160px', display: 'block' }}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Wallet Address ({network})</div>
          <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600, fontFamily: 'monospace', background: '#091322', padding: '0.5rem 1rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
            {walletAddress}
          </div>
          <div>
            <button
              onClick={handleCopyAddress}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #0066FF',
                background: 'rgba(0, 102, 255, 0.1)',
                color: '#0066FF',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
            ⚠️ Send ONLY USDT on {network}. Sending other coins or using wrong network will result in permanent loss.
          </div>
        </div>

        <button
          type="button"
          onClick={handleDirectPay}
          disabled={submitting}
          className="btn-blue"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
        >
          {submitting ? 'Processing...' : 'Pay & Activate Package'}
        </button>
      </div>
    </div>
  );
}

/** Exact Data Table with 25 entries/page, Copy, Excel, PDF, Print toolbar */
function DataTable({ columns, data = [], emptyMessage = "No data available in table" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data.length === 0) {
      navigator.clipboard.writeText("No data");
    } else {
      const text = data.map(row => Object.values(row).join("\t")).join("\n");
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Table Toolbar */}
      <div className="table-toolbar-row">
        <div>
          <select className="table-length-select" defaultValue="25">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
            entries per page
          </span>
        </div>

        <div className="table-export-group">
          <button onClick={handleCopy} className="table-action-btn">
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => alert('Exporting to Excel format...')} className="table-action-btn">
            Excel
          </button>
          <button onClick={() => alert('Generating PDF report...')} className="table-action-btn">
            PDF
          </button>
          <button onClick={handlePrint} className="table-action-btn">
            Print
          </button>
        </div>
      </div>

      {/* Table Viewport */}
      <div className="exact-table-container">
        <table className="exact-data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>
                  {col.label} {col.sortable !== false && <span style={{ opacity: 0.6 }}>↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="table-empty-row">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>
                      {col.render ? col.render(row[col.key], row, rIdx) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer-row">
        <div>
          Showing {data.length > 0 ? 1 : 0} to {data.length} of {data.length} entries
        </div>
        <div className="pagination-controls">
          <button className="page-nav-btn" title="First Page">«</button>
          <button className="page-nav-btn" title="Previous Page">‹</button>
          <button className="page-nav-btn" title="Next Page">›</button>
          <button className="page-nav-btn" title="Last Page">»</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. DASHBOARD VIEW (Screenshots 4.15.53 PM, 4.15.52 PM (1), 4.15.52 PM)
   ========================================================================== */
function DashboardView() {
  const { user } = useApp();

  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);
  const availableBal = (user.balances?.availableUSDT ?? 50).toFixed(2);
  const totalIncome = (user.balances?.totalIncome ?? 50).toFixed(2);
  const totalWithdrawal = (user.balances?.totalWithdrawn ?? 0).toFixed(2);
  const directTeamCount = user.directReferralsCount ?? 0;

  return (
    <div className="fade-in">
      {/* Dashboard Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.15rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.15rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src="/logo.png"
            alt="SIGHT FINANCE"
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
              SIGHT FINANCE
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8896ab', letterSpacing: '0.05em' }}>
              YOUR VISION. OUR CAPITAL.
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          background: 'rgba(0, 123, 255, 0.15)',
          color: '#38bdf8',
          padding: '0.2rem 0.65rem',
          borderRadius: '9999px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          MEMBER PORTAL
        </div>
      </div>

      {/* Top 2 Cards: BASIC PACKAGE | FD PACKAGE */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">BASIC PACKAGE</div>
          <div className="stat-metric-value val-white">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">FD PACKAGE</div>
          <div className="stat-metric-value val-white">
            <span>₹</span> 0.00
          </div>
        </div>
      </div>

      {/* Balance Summary Header */}
      <div className="dashboard-section-title">
        <span style={{ fontSize: '1.25rem' }}>🎁</span>
        <span>Balance Summary</span>
      </div>

      {/* 4 Cards: Available Fund, Available Balance, Total Income, Total Withdrawal */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">AVAILABLE FUND</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> {availableFund}
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">AVAILABLE BALANCE</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> {availableBal}
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL INCOME</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> {totalIncome}
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL WITHDRAWAL</div>
          <div className="stat-metric-value val-red">
            <span>₹</span> {totalWithdrawal}
          </div>
        </div>
      </div>

      {/* Team Summary Header */}
      <div className="dashboard-section-title">
        <span style={{ fontSize: '1.25rem' }}>👥</span>
        <span>Team Summary</span>
      </div>

      {/* 3 Cards: Direct Team, Total Team, Re-Topup Income */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">DIRECT TEAM</div>
          <div className="stat-metric-value val-green">{directTeamCount}</div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL TEAM</div>
          <div className="stat-metric-value val-cyan">0.00</div>
        </div>
      </div>
      <div style={{ maxWidth: '49%', marginBottom: '1.5rem' }}>
        <div className="stat-metric-card">
          <div className="stat-metric-label">RE-TOPUP INCOME</div>
          <div className="stat-metric-value val-green">0.00</div>
        </div>
      </div>

      {/* Basic Income Breakdown Header */}
      <div className="dashboard-section-title">
        <span style={{ fontSize: '1.25rem' }}>🎁</span>
        <span>Basic Income Breakdown</span>
      </div>

      {/* 6 Cards: Joining Bonus, Referral Income, Today ROI, Today Level, Total ROI, Total Level */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">JOINING BONUS</div>
          <div className="stat-metric-value val-yellow">
            <span>₹</span> 50.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">REFERRAL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TODAY ROI INCOME</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TODAY LEVEL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL ROI INCOME</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL LEVEL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
      </div>

      {/* FD Income Breakdown Header */}
      <div className="dashboard-section-title">
        <span style={{ fontSize: '1.25rem' }}>🎁</span>
        <span>FD Income Breakdown</span>
      </div>

      {/* 6 Cards: Today ROI, Today Level, Total ROI, Total Level, Referral Income, FD Released */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">TODAY ROI INCOME</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TODAY LEVEL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL ROI INCOME</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL LEVEL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">REFERRAL INCOME</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">FD RELEASED</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
      </div>

      {/* Salary Breakdown Header */}
      <div className="dashboard-section-title">
        <span style={{ fontSize: '1.25rem' }}>🎁</span>
        <span>Salary Breakdown</span>
      </div>

      {/* 2 Cards: Monthly Salary, Total Salary */}
      <div className="stat-grid-2">
        <div className="stat-metric-card">
          <div className="stat-metric-label">MONTHLY SALARY</div>
          <div className="stat-metric-value val-green">
            <span>₹</span> 0.00
          </div>
        </div>
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL SALARY</div>
          <div className="stat-metric-value val-cyan">
            <span>₹</span> 0.00
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. DEPOSIT VIEW (Matching Screenshots from recharge type clint.zip)
   ========================================================================== */
function DepositView() {
  const { user, userDepositRequests, userPlans, showToast } = useApp();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForRecharge, setSelectedPlanForRecharge] = useState(null);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState('BEP20');
  const [submitting, setSubmitting] = useState(false);
  const [packageType, setPackageType] = useState('basic'); // 'basic' | 'fd'

  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);
  const depositAddress = "0x949e2f6b8160eb88fd6fad3a34470f10afe96df5";

  const BASIC_PLANS = [
    { id: 'bp-1', name: '5% Daily ROI Plan 1', amount: '200.00', dailyRoi: '10.00', days: 25, totalReturn: '250.00' },
    { id: 'bp-2', name: '5% Daily ROI Plan 2', amount: '500.00', dailyRoi: '25.00', days: 25, totalReturn: '625.00' },
    { id: 'bp-3', name: '5% Daily ROI Plan 3', amount: '1,000.00', dailyRoi: '50.00', days: 25, totalReturn: '1,250.00' },
    { id: 'bp-4', name: '5% Daily ROI Plan 4', amount: '2,000.00', dailyRoi: '100.00', days: 25, totalReturn: '2,500.00' },
    { id: 'bp-5', name: '5% Daily ROI Plan 5', amount: '5,000.00', dailyRoi: '250.00', days: 25, totalReturn: '6,250.00' },
    { id: 'bp-6', name: '5% Daily ROI Plan 6', amount: '10,000.00', dailyRoi: '500.00', days: 25, totalReturn: '12,500.00' },
    { id: 'bp-7', name: '5% Daily ROI Plan 7', amount: '20,000.00', dailyRoi: '1,000.00', days: 25, totalReturn: '25,000.00' },
    { id: 'bp-8', name: '5% Daily ROI Plan 8', amount: '50,000.00', dailyRoi: '2,500.00', days: 25, totalReturn: '62,500.00' },
    { id: 'bp-9', name: '5% Daily ROI Plan 9', amount: '100,000.00', dailyRoi: '5,000.00', days: 25, totalReturn: '125,000.00' },
    { id: 'bp-10', name: '5% Daily ROI Plan 10', amount: '200,000.00', dailyRoi: '10,000.00', days: 25, totalReturn: '250,000.00' },
    { id: 'bp-11', name: '5% Daily ROI Plan 11', amount: '500,000.00', dailyRoi: '25,000.00', days: 25, totalReturn: '625,000.00' }
  ];

  const FD_PLANS = [
    { id: 'fd-1a', name: '6% Daily ROI Plan 1', amount: '1,000.00', days: 365, totalReturn: '3,650.00' },
    { id: 'fd-1b', name: '6% Daily ROI Plan 2', amount: '1,000.00', days: 515, totalReturn: '7,725.00' },
    { id: 'fd-2a', name: '6% Daily ROI Plan 3', amount: '2,000.00', days: 365, totalReturn: '7,300.00' },
    { id: 'fd-2b', name: '6% Daily ROI Plan 4', amount: '2,000.00', days: 515, totalReturn: '15,450.00' },
    { id: 'fd-3a', name: '6% Daily ROI Plan 5', amount: '5,000.00', days: 365, totalReturn: '18,250.00' },
    { id: 'fd-3b', name: '6% Daily ROI Plan 6', amount: '5,000.00', days: 515, totalReturn: '38,625.00' },
    { id: 'fd-4a', name: '6% Daily ROI Plan 7', amount: '10,000.00', days: 365, totalReturn: '36,500.00' },
    { id: 'fd-4b', name: '6% Daily ROI Plan 8', amount: '10,000.00', days: 515, totalReturn: '77,250.00' },
    { id: 'fd-5a', name: '6% Daily ROI Plan 9', amount: '20,000.00', days: 365, totalReturn: '73,000.00' },
    { id: 'fd-5b', name: '6% Daily ROI Plan 10', amount: '20,000.00', days: 515, totalReturn: '154,500.00' }
  ];

  const handlePurchaseClick = (plan) => {
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await purchaseInvestmentPlanDoc(user?.uid || 'guest', paymentData.plan);
      showToast(`Package ${paymentData.plan.name} purchased and activated successfully!`, 'success');
    } catch (err) {
      showToast('Error purchasing package: ' + err.message, 'error');
      throw err;
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitDepositRequest(user?.uid || 'guest', {
        userId: user?.id || 'IF124471',
        amount: parseFloat(amount),
        network,
        txHash: txHash || 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        depositAddress,
        planName: selectedPlanForRecharge?.name || 'Fund Recharge'
      });
      showToast(`Recharge request for ₹ ${amount} submitted successfully!`, 'success');
      setAmount('');
      setTxHash('');
      setSelectedPlanForRecharge(null);
      setShowQrModal(false);
    } catch (err) {
      showToast('Error submitting request: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const depositColumns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'createdAt', label: 'DATE', render: (val) => val ? new Date(val?.seconds ? val.seconds * 1000 : val).toLocaleString() : '—' },
    { key: 'depositAddress', label: 'ADDRESS', render: (val) => val ? `${val.substring(0, 8)}...${val.substring(val.length - 6)}` : '—' },
    { key: 'amount', label: 'AMOUNT', render: (val) => `₹ ${parseFloat(val || 0).toFixed(2)}` },
    { key: 'status', label: 'STATUS', render: (val) => (
      <span style={{
        color: val === 'Approved' || val === 'Completed' ? '#10b981' : val === 'Rejected' ? '#ef4444' : '#00b4d8',
        fontWeight: 600
      }}>
        {val || 'Pending'}
      </span>
    )}
  ];

  const packageColumns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'createdAt', label: 'DATE', render: (val) => val ? new Date(val?.seconds ? val.seconds * 1000 : val).toLocaleString() : '—' },
    { key: 'planName', label: 'PACKAGE' },
    { key: 'amount', label: 'AMOUNT', render: (val) => `₹ ${parseFloat(val || 0).toFixed(2)}` },
    { key: 'dailyRoi', label: 'DAILY ROI', render: (val) => `₹ ${parseFloat(val || 0).toFixed(2)}` },
    { key: 'days', label: 'DAYS' },
    { key: 'totalReturn', label: 'TOTAL RETURN', render: (val) => `₹ ${parseFloat(val || 0).toFixed(2)}` },
    { key: 'status', label: 'STATUS', render: (val) => (
      <span style={{
        color: val === 'Active' ? '#10b981' : val === 'Completed' ? '#00b4d8' : '#ef4444',
        fontWeight: 600
      }}>
        {val || 'Unknown'}
      </span>
    )}
  ];

  const activePlansList = packageType === 'basic' ? BASIC_PLANS : FD_PLANS;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>Deposit</h2>
      <Breadcrumb parent="Package" page="Deposit" />

      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', marginTop: '0.75rem' }}>
        Available Fund Balance : <span style={{ color: '#10B981' }}>{availableFund}</span>
      </div>

      {/* Package Type Selector Tabs & QR Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#091322', padding: '0.35rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setPackageType('basic')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: packageType === 'basic' ? '#0066FF' : 'transparent',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Basic Package Plans
          </button>
          <button
            onClick={() => setPackageType('fd')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: packageType === 'fd' ? '#0066FF' : 'transparent',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            FD Package Plans
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedPlanForRecharge(null);
            setAmount('');
            setShowQrModal(true);
          }}
          className="btn-blue"
          style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
        >
          <span>QR / Custom Recharge</span>
        </button>
      </div>

      {/* Plan Cards Grid inside Recharge Section */}
      <div className="plan-cards-grid">
        {activePlansList.map((plan) => (
          <div key={plan.id} className="plan-card-exact">
            <div className="plan-card-icon-badge">
              <PackageIcon size={32} color="#FFFFFF" />
            </div>

            <div className="plan-card-title">{plan.name}</div>

            <div className="plan-card-details">
              <div className="plan-detail-row">
                <span className="plan-detail-label">Amount :</span>
                <span className="plan-detail-value">{plan.amount}</span>
              </div>
              {plan.dailyRoi && (
                <div className="plan-detail-row">
                  <span className="plan-detail-label">Daily ROI :</span>
                  <span className="plan-detail-value">{plan.dailyRoi}</span>
                </div>
              )}
              <div className="plan-detail-row">
                <span className="plan-detail-label">Days :</span>
                <span className="plan-detail-value">{plan.days}</span>
              </div>
              <div className="plan-detail-row">
                <span className="plan-detail-label">Total Return :</span>
                <span className="plan-detail-value">{plan.totalReturn}</span>
              </div>
            </div>

            <button className="plan-card-purchase-btn" onClick={() => handlePurchaseClick(plan)}>
              Purchase
            </button>
          </div>
        ))}
      </div>

      {/* Payment History Card */}
      <div className="exact-card" style={{ marginTop: '2.5rem' }}>
        <div className="exact-card-header">
          <div className="exact-card-title">
            <Clock size={18} color="#0066FF" />
            <span>Payment History</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
            <select className="form-control-input" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: '#091322', color: '#FFF' }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries per page</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary btn-sm">Copy</button>
            <button className="btn-secondary btn-sm">Excel</button>
            <button className="btn-secondary btn-sm">PDF</button>
            <button className="btn-secondary btn-sm">Print</button>
          </div>
        </div>

        <DataTable
          columns={depositColumns}
          data={userDepositRequests || []}
          emptyMessage="No data available in table"
        />
      </div>

      {/* Package History Card */}
      <div className="exact-card" style={{ marginTop: '2.5rem' }}>
        <div className="exact-card-header">
          <div className="exact-card-title">
            <PackageIcon size={18} color="#0066FF" />
            <span>Package History</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
            <select className="form-control-input" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: '#091322', color: '#FFF' }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries per page</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary btn-sm">Copy</button>
            <button className="btn-secondary btn-sm">Excel</button>
            <button className="btn-secondary btn-sm">PDF</button>
            <button className="btn-secondary btn-sm">Print</button>
          </div>
        </div>

        <DataTable
          columns={packageColumns}
          data={userPlans || []}
          emptyMessage="No package history available"
        />
      </div>

      {/* QR & Recharge Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>
                {selectedPlanForRecharge ? `Recharge for ${selectedPlanForRecharge.name}` : 'Fund Recharge / QR Deposit'}
              </h3>
              <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ background: '#FFF', padding: '0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.75rem' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddress}`}
                    alt="Deposit QR"
                    style={{ width: '160px', height: '160px', display: 'block' }}
                  />
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#94A3B8',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  background: '#091322',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  <span>{depositAddress}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(depositAddress);
                      showToast('Address copied to clipboard', 'success');
                    }}
                    title="Copy address"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#FFF',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Recharge Amount (₹)</label>
                <input
                  type="number"
                  className="form-control-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transaction Hash / UTR</label>
                <input
                  type="text"
                  className="form-control-input"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter Transaction Hash / UTR"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-blue" style={{ width: '100%', marginTop: '0.5rem' }}>
                {submitting ? 'Submitting...' : 'Submit Recharge Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlanForPayment(null);
        }}
        plan={selectedPlanForPayment}
        user={user}
        onSubmit={handlePaymentSubmit}
        directPay
      />
    </div>
  );
}

/* ==========================================================================
   3. DOWNLINE VIEWS (Screenshots 4.15.55 PM (1), 4.15.55 PM)
   ========================================================================== */
function DirectTeamView() {
  const { user } = useApp();

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'NAME' },
    { key: 'mobile', label: 'MOBILE' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Direct Team</h2>
      <Breadcrumb parent="Downline" page="Direct Team" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Referal List</div>
        </div>

        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No data available in table"
        />
      </div>
    </div>
  );
}

function TeamListView() {
  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'NAME' },
    { key: 'mobile', label: 'MOBILE' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Team List</h2>
      <Breadcrumb parent="Downline" page="Team List" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Team List</div>
        </div>

        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No data available in table"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   4. INCOME REPORT VIEWS (Screenshots 4.15.56 (1), 4.15.56, 4.15.57 (1),
      4.15.57 (2), 4.15.58, 4.15.59 (1), 4.15.59)
   ========================================================================== */
function GenericIncomeView({ title, breadcrumbPage, cardTitle, hasIdFilter = false }) {
  const [startDate, setStartDate] = useState('27/09/2026, 00:00');
  const [endDate, setEndDate] = useState('27/09/2026, 23:59');
  const [idFilter, setIdFilter] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setTableData([]);
  };

  const handleReset = () => {
    setStartDate('27/09/2026, 00:00');
    setEndDate('27/09/2026, 23:59');
    setIdFilter('');
    setTableData([]);
  };

  const handleRefresh = () => {
    setTableData([]);
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    ...(hasIdFilter ? [{ key: 'id', label: 'ID' }] : []),
    { key: 'amount', label: 'AMOUNT' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{title}</h2>
      <Breadcrumb parent="Income" page={breadcrumbPage} />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">{cardTitle}</div>
          <span className="total-badge-red">Total : 0.00</span>
        </div>

        {/* Filter Inputs Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <input
              type="text"
              className="form-control-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy, --:--"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy, --:--"
            />
          </div>

          {hasIdFilter && (
            <div className="form-group">
              <input
                type="text"
                className="form-control-input"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                placeholder="Id"
              />
            </div>
          )}

          {/* Action Buttons: Search | Reset | Refresh */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-blue">Search</button>
            <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
            <button type="button" onClick={handleRefresh} className="btn-green">Refresh</button>
          </div>
        </form>

        <DataTable
          columns={columns}
          data={tableData}
          emptyMessage="No data available in table"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   5. TRANSACTIONAL VIEWS: P2P TRANSFER & SWAP (Screenshots 4.15.58 (1), 4.16.00 (1), 4.16.01)
   ========================================================================== */
function P2PTransferView() {
  const { user, showToast } = useApp();
  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState('');
  const [tPassword, setTPassword] = useState('');

  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetUser || !amount || !tPassword) {
      showToast('Please fill in all required fields marked with *', 'error');
      return;
    }
    showToast(`Transfer of ₹ ${amount} to ${targetUser} initiated`, 'success');
    setTargetUser('');
    setAmount('');
    setTPassword('');
  };

  const handleReset = () => {
    setTargetUser('');
    setAmount('');
    setTPassword('');
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>P2P Transfer</h2>
      <Breadcrumb parent="Transactional" page="P2P Transfer" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Transfer Fund</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Available Fund Balance with attached ₹ prefix */}
          <div className="form-group">
            <label className="form-label">Available Fund Balance</label>
            <div className="input-addon-group">
              <div className="addon-prefix-box">₹</div>
              <input
                type="text"
                disabled
                value={availableFund}
                className="form-control-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target User ID *</label>
            <input
              type="text"
              required
              placeholder="Enter User ID"
              className="form-control-input"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              step="any"
              required
              placeholder="Enter Amount"
              className="form-control-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">T-Password *</label>
            <input
              type="password"
              required
              placeholder="Enter T-Password"
              className="form-control-input"
              value={tPassword}
              onChange={(e) => setTPassword(e.target.value)}
            />
            <div style={{ marginTop: '0.4rem' }}>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); showToast('T-Password reset link sent to your registered email', 'info'); }}
                style={{ fontSize: '0.85rem' }}
              >
                Forgot T-Password?
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-blue" style={{ minWidth: '120px' }}>Submit</button>
            <button type="button" onClick={handleReset} className="btn-reset" style={{ minWidth: '120px' }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SwapView() {
  const { user, showToast } = useApp();
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('27/09/2026, 00:00');
  const [endDate, setEndDate] = useState('27/09/2026, 23:59');

  const incomeBalance = (user.balances?.totalIncome ?? 50).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    showToast(`Successfully swapped ₹ ${amount} to Fund Wallet`, 'success');
    setAmount('');
  };

  const handleReset = () => {
    setAmount('');
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'amount', label: 'AMOUNT' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Swap</h2>
      <Breadcrumb parent="Transactional" page="Transfer Income To Fund" />

      {/* Card 1: Transfer To Fund */}
      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Transfer To Fund</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Income Balance</label>
            <input
              type="text"
              disabled
              value={incomeBalance}
              className="form-control-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              step="any"
              placeholder="Enter Amount"
              className="form-control-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="btn-blue" style={{ minWidth: '120px' }}>Submit</button>
            <button type="button" onClick={handleReset} className="btn-reset" style={{ minWidth: '120px' }}>Reset</button>
          </div>
        </form>
      </div>

      {/* Card 2: Transfer Income To Fund Details */}
      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Transfer Income To Fund Details</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <input
              type="text"
              className="form-control-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button className="btn-blue">Search</button>
            <button className="btn-reset">Reset</button>
            <button className="btn-green">Refresh</button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No data available in table"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   6. PACKAGE ACTIVATION VIEWS (5% & 6%)
   Lists from Downloads/5% 6% screenshots
   ========================================================================== */
function BasicPackageView() {
  const { user, showToast } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);

  const PLAN_GROUPS = [
    {
      title: '5% Daily-Growth Label • Basic',
      plans: [
        { id: 'p5-b-1', name: '5% Basic Plan 1', amount: '10.00', dailyRoi: '0.50', days: 365, totalReturn: '125.00' },
        { id: 'p5-b-2', name: '5% Basic Plan 2', amount: '25.00', dailyRoi: '1.25', days: 365, totalReturn: '310.00' },
        { id: 'p5-b-3', name: '5% Basic Plan 3', amount: '50.00', dailyRoi: '2.50', days: 365, totalReturn: '625.00' },
        { id: 'p5-b-4', name: '5% Basic Plan 4', amount: '75.00', dailyRoi: '3.75', days: 365, totalReturn: '930.00' },
        { id: 'p5-b-5', name: '5% Basic Plan 5', amount: '100.00', dailyRoi: '5.00', days: 365, totalReturn: '1,200.00' },
        { id: 'p5-b-6', name: '5% Basic Plan 6', amount: '125.00', dailyRoi: '6.25', days: 365, totalReturn: '1,560.00' },
        { id: 'p5-b-7', name: '5% Basic Plan 7', amount: '150.00', dailyRoi: '7.50', days: 365, totalReturn: '1,650.00' },
        { id: 'p5-b-8', name: '5% Basic Plan 8', amount: '200.00', dailyRoi: '10.00', days: 365, totalReturn: '2,500.00' },
        { id: 'p5-b-9', name: '5% Basic Plan 9', amount: '500.00', dailyRoi: '25.00', days: 365, totalReturn: '6,250.00' },
        { id: 'p5-b-10', name: '5% Basic Plan 10', amount: '1,000.00', dailyRoi: '50.00', days: 365, totalReturn: '12,500.00' }
      ]
    },
    {
      title: '5% Daily-Growth Label • Prime',
      plans: [
        { id: 'p5-p-1', name: '5% Prime Plan 1', amount: '50.00', dailyRoi: '2.50', days: 730, totalReturn: '1,250.00' },
        { id: 'p5-p-2', name: '5% Prime Plan 2', amount: '100.00', dailyRoi: '5.00', days: 730, totalReturn: '2,500.00' },
        { id: 'p5-p-3', name: '5% Prime Plan 3', amount: '200.00', dailyRoi: '10.00', days: 730, totalReturn: '5,000.00' },
        { id: 'p5-p-4', name: '5% Prime Plan 4', amount: '250.00', dailyRoi: '12.50', days: 730, totalReturn: '6,250.00' },
        { id: 'p5-p-5', name: '5% Prime Plan 5', amount: '500.00', dailyRoi: '25.00', days: 730, totalReturn: '12,500.00' }
      ]
    },
    {
      title: '5% Daily-Growth Label • Bolt',
      plans: [
        { id: 'p5-bt-1', name: '5% Bolt Plan 1', amount: '1,000.00', dailyRoi: '50.00', days: 365, totalReturn: '12,500.00' },
        { id: 'p5-bt-2', name: '5% Bolt Plan 2', amount: '2,500.00', dailyRoi: '125.00', days: 365, totalReturn: '31,500.00' },
        { id: 'p5-bt-3', name: '5% Bolt Plan 3', amount: '5,000.00', dailyRoi: '250.00', days: 365, totalReturn: '62,500.00' },
        { id: 'p5-bt-4', name: '5% Bolt Plan 4', amount: '7,500.00', dailyRoi: '375.00', days: 365, totalReturn: '93,500.00' },
        { id: 'p5-bt-5', name: '5% Bolt Plan 5', amount: '10,000.00', dailyRoi: '500.00', days: 365, totalReturn: '125,000.00' }
      ]
    }
  ];

  const handlePurchase = (plan) => {
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await purchaseInvestmentPlanDoc(user?.uid || 'guest', paymentData.plan);
      showToast(`Package ${paymentData.plan.name} purchased and activated successfully!`, 'success');
    } catch (err) {
      showToast('Error purchasing package: ' + err.message, 'error');
      throw err;
    }
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'package', label: 'PACKAGE' },
    { key: 'amount', label: 'AMOUNT' },
    { key: 'dailyRoi', label: 'DAILY ROI' },
    { key: 'days', label: 'DAYS' },
    { key: 'totalReturn', label: 'TOTAL RETURN' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>5%</h2>
      <Breadcrumb parent="Package" page="5%" />

      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.75rem', marginTop: '0.75rem' }}>
        Available Fund Balance : <span style={{ color: '#10B981' }}>{availableFund}</span>
      </div>

      {PLAN_GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>{group.title}</h3>
          <div className="plan-cards-grid">
            {group.plans.map((plan) => (
              <div key={plan.id} className="plan-card-exact">
                <div className="plan-card-icon-badge">
                  <PackageIcon size={32} color="#FFFFFF" />
                </div>

                <div className="plan-card-title">{plan.name}</div>

                <div className="plan-card-details">
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Amount :</span>
                    <span className="plan-detail-value">{plan.amount}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Daily ROI :</span>
                    <span className="plan-detail-value">{plan.dailyRoi}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Days :</span>
                    <span className="plan-detail-value">{plan.days}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Total Return :</span>
                    <span className="plan-detail-value">{plan.totalReturn}</span>
                  </div>
                </div>

                <button className="plan-card-purchase-btn" onClick={() => handlePurchase(plan)}>
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Package History Card */}
      <div className="exact-card" style={{ marginTop: '2.5rem' }}>
        <div className="exact-card-header">
          <div className="exact-card-title">
            <Clock size={18} color="#0066FF" />
            <span>Package History</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
            <select className="form-control-input" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: '#091322', color: '#FFF' }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries per page</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary btn-sm">Copy</button>
            <button className="btn-secondary btn-sm">Excel</button>
            <button className="btn-secondary btn-sm">PDF</button>
            <button className="btn-secondary btn-sm">Print</button>
          </div>
        </div>

        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlanForPayment(null);
        }}
        plan={selectedPlanForPayment}
        user={user}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}

function FDPackageView() {
  const { user, showToast } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);

  const PLAN_GROUPS = [
    {
      title: '6% Daily-Growth Label • Basic',
      plans: [
        { id: 'p6-b-1', name: '6% Basic Plan 1', amount: '25.00', dailyRoi: '1.50', days: 365, totalReturn: '370.00' },
        { id: 'p6-b-2', name: '6% Basic Plan 2', amount: '50.00', dailyRoi: '3.00', days: 365, totalReturn: '750.00' },
        { id: 'p6-b-3', name: '6% Basic Plan 3', amount: '75.00', dailyRoi: '4.50', days: 365, totalReturn: '1,125.00' },
        { id: 'p6-b-4', name: '6% Basic Plan 4', amount: '100.00', dailyRoi: '6.00', days: 365, totalReturn: '1,500.00' },
        { id: 'p6-b-5', name: '6% Basic Plan 5', amount: '125.00', dailyRoi: '7.50', days: 365, totalReturn: '1,800.00' },
        { id: 'p6-b-6', name: '6% Basic Plan 6', amount: '150.00', dailyRoi: '9.00', days: 365, totalReturn: '2,250.00' },
        { id: 'p6-b-7', name: '6% Basic Plan 7', amount: '175.00', dailyRoi: '10.50', days: 365, totalReturn: '2,625.00' },
        { id: 'p6-b-8', name: '6% Basic Plan 8', amount: '200.00', dailyRoi: '12.00', days: 365, totalReturn: '3,000.00' }
      ]
    },
    {
      title: '6% Daily-Growth Label • Prime',
      plans: [
        { id: 'p6-p-1', name: '6% Prime Plan 1', amount: '250.00', dailyRoi: '15.00', days: 365, totalReturn: '3,750.00' },
        { id: 'p6-p-2', name: '6% Prime Plan 2', amount: '500.00', dailyRoi: '30.00', days: 365, totalReturn: '7,500.00' },
        { id: 'p6-p-3', name: '6% Prime Plan 3', amount: '750.00', dailyRoi: '45.00', days: 365, totalReturn: '11,250.00' },
        { id: 'p6-p-4', name: '6% Prime Plan 4', amount: '1,000.00', dailyRoi: '60.00', days: 365, totalReturn: '15,000.00' }
      ]
    },
    {
      title: '6% Daily-Growth Label • Bolt',
      plans: [
        { id: 'p6-bt-1', name: '6% Bolt Plan 1', amount: '2,500.00', dailyRoi: '150.00', days: 365, totalReturn: '3,700.00' },
        { id: 'p6-bt-2', name: '6% Bolt Plan 2', amount: '3,500.00', dailyRoi: '210.00', days: 365, totalReturn: '5,200.00' },
        { id: 'p6-bt-3', name: '6% Bolt Plan 3', amount: '4,500.00', dailyRoi: '270.00', days: 365, totalReturn: '6,700.00' },
        { id: 'p6-bt-4', name: '6% Bolt Plan 4', amount: '5,500.00', dailyRoi: '330.00', days: 365, totalReturn: '8,200.00' },
        { id: 'p6-bt-5', name: '6% Bolt Plan 5', amount: '6,500.00', dailyRoi: '390.00', days: 365, totalReturn: '9,700.00' },
        { id: 'p6-bt-6', name: '6% Bolt Plan 6', amount: '7,500.00', dailyRoi: '450.00', days: 365, totalReturn: '112,500.00' },
        { id: 'p6-bt-7', name: '6% Bolt Plan 7', amount: '8,500.00', dailyRoi: '510.00', days: 365, totalReturn: '127,500.00' },
        { id: 'p6-bt-8', name: '6% Bolt Plan 8', amount: '9,500.00', dailyRoi: '570.00', days: 365, totalReturn: '142,500.00' }
      ]
    }
  ];

  const handlePurchase = (plan) => {
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await purchaseInvestmentPlanDoc(user?.uid || 'guest', paymentData.plan);
      showToast(`Package ${paymentData.plan.name} purchased and activated successfully!`, 'success');
    } catch (err) {
      showToast('Error purchasing package: ' + err.message, 'error');
      throw err;
    }
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'package', label: 'PACKAGE' },
    { key: 'amount', label: 'AMOUNT' },
    { key: 'dailyRoi', label: 'DAILY ROI' },
    { key: 'days', label: 'DAYS' },
    { key: 'totalReturn', label: 'TOTAL RETURN' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>6%</h2>
      <Breadcrumb parent="Package" page="6%" />

      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.75rem', marginTop: '0.75rem' }}>
        Available Fund Balance : <span style={{ color: '#10B981' }}>{availableFund}</span>
      </div>

      {PLAN_GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>{group.title}</h3>
          <div className="plan-cards-grid">
            {group.plans.map((plan) => (
              <div key={plan.id} className="plan-card-exact">
                <div className="plan-card-icon-badge">
                  <PackageIcon size={32} color="#FFFFFF" />
                </div>

                <div className="plan-card-title">{plan.name}</div>

                <div className="plan-card-details">
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Amount :</span>
                    <span className="plan-detail-value">{plan.amount}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Daily ROI :</span>
                    <span className="plan-detail-value">{plan.dailyRoi}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Days :</span>
                    <span className="plan-detail-value">{plan.days}</span>
                  </div>
                  <div className="plan-detail-row">
                    <span className="plan-detail-label">Total Return :</span>
                    <span className="plan-detail-value">{plan.totalReturn}</span>
                  </div>
                </div>

                <button className="plan-card-purchase-btn" onClick={() => handlePurchase(plan)}>
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Package History Card */}
      <div className="exact-card" style={{ marginTop: '2.5rem' }}>
        <div className="exact-card-header">
          <div className="exact-card-title">
            <Clock size={18} color="#0066FF" />
            <span>Package History</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
            <select className="form-control-input" style={{ width: 'auto', padding: '0.35rem 0.75rem', background: '#091322', color: '#FFF' }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries per page</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary btn-sm">Copy</button>
            <button className="btn-secondary btn-sm">Excel</button>
            <button className="btn-secondary btn-sm">PDF</button>
            <button className="btn-secondary btn-sm">Print</button>
          </div>
        </div>

        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlanForPayment(null);
        }}
        plan={selectedPlanForPayment}
        user={user}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}

/* ==========================================================================
   7. REPORTS VIEWS
   ========================================================================== */
function ReportView({ title, breadcrumbPage }) {
  const [startDate, setStartDate] = useState('27/09/2026, 00:00');
  const [endDate, setEndDate] = useState('27/09/2026, 23:59');

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'type', label: 'DESCRIPTION' },
    { key: 'credit', label: 'CREDIT' },
    { key: 'debit', label: 'DEBIT' },
    { key: 'balance', label: 'BALANCE' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{title}</h2>
      <Breadcrumb parent="Reports" page={breadcrumbPage} />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">{title}</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <input type="text" className="form-control-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="text" className="form-control-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button className="btn-blue">Search</button>
            <button className="btn-reset">Reset</button>
            <button className="btn-green">Refresh</button>
          </div>
        </div>

        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>
    </div>
  );
}

/* ==========================================================================
   8. SUPPORT TICKET VIEW
   ========================================================================== */
function SupportTicketView() {
  const { user, showToast } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    showToast('Support ticket created. Our team will review shortly.', 'success');
    setSubject('');
    setMessage('');
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'ticketId', label: 'TICKET ID' },
    { key: 'subject', label: 'SUBJECT' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Support Ticket</h2>
      <Breadcrumb parent="Support" page="Support Ticket" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Create Ticket</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              required
              placeholder="Brief summary of your query"
              className="form-control-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue or question..."
              className="form-control-input"
              style={{ height: 'auto', padding: '0.75rem' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-blue">Submit Ticket</button>
        </form>
      </div>

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">My Tickets</div>
        </div>
        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN CUSTOMER PORTAL ROUTER
   ========================================================================== */
export default function CustomerPortal() {
  const { activePage } = useApp();

  return (
    <div className="portal-container">
      {/* Route Router matching all 21 Screenshots & preserved features */}
      {activePage === 'dashboard' && <DashboardView />}
      {(activePage === 'deposit' || activePage === 'deposits') && <DepositView />}
      {(activePage === 'basic-package' || activePage === 'investments') && <BasicPackageView />}
      {activePage === 'fd-package' && <FDPackageView />}

      {/* Downline */}
      {(activePage === 'direct-team' || activePage === 'customer-referrals') && <DirectTeamView />}
      {activePage === 'team-list' && <TeamListView />}

      {/* Income Reports */}
      {activePage === 'basic-roi-income' && (
        <GenericIncomeView
          title="Basic ROI Return"
          breadcrumbPage="Basic ROI Return"
          cardTitle="ROI Return"
          hasIdFilter={false}
        />
      )}
      {activePage === 'basic-referral-income' && (
        <GenericIncomeView
          title="Basic Referral Income"
          breadcrumbPage="Basic Referral Income"
          cardTitle="ROI Return"
          hasIdFilter={true}
        />
      )}
      {activePage === 'basic-level-income' && (
        <GenericIncomeView
          title="Basic Level Income"
          breadcrumbPage="Basic Level Income"
          cardTitle="ROI Return"
          hasIdFilter={true}
        />
      )}
      {activePage === 'fd-roi-income' && (
        <GenericIncomeView
          title="FD ROI Income"
          breadcrumbPage="FD ROI Income"
          cardTitle="FD ROI Income"
          hasIdFilter={false}
        />
      )}
      {activePage === 'fd-referral-income' && (
        <GenericIncomeView
          title="FD Referral Income"
          breadcrumbPage="FD Referral Income"
          cardTitle="FD Referral Income"
          hasIdFilter={true}
        />
      )}
      {(activePage === 'fd-level-income' || activePage === 'rd-level-income') && (
        <GenericIncomeView
          title="RD Level Income"
          breadcrumbPage="RD Level Income"
          cardTitle="ROI Return"
          hasIdFilter={true}
        />
      )}
      {(activePage === 'salary-income' || activePage === 'customer-salary') && (
        <GenericIncomeView
          title="Salary Income"
          breadcrumbPage="Salary Income"
          cardTitle="Salary Income"
          hasIdFilter={false}
        />
      )}

      {/* Transactional */}
      {activePage === 'p2p-transfer' && <P2PTransferView />}
      {activePage === 'swap' && <SwapView />}
      {activePage === 'withdrawals' && <P2PTransferView />}

      {/* Reports */}
      {activePage === 'daily-income-report' && <ReportView title="Daily Income Report" breadcrumbPage="Daily Income Report" />}
      {activePage === 'monthly-income-report' && <ReportView title="Monthly Income Report" breadcrumbPage="Monthly Income Report" />}
      {activePage === 'fund-wallet-summary' && <ReportView title="Fund Wallet Summary" breadcrumbPage="Fund Wallet Summary" />}
      {activePage === 'income-wallet-summary' && <ReportView title="Income Wallet Summary" breadcrumbPage="Income Wallet Summary" />}

      {/* Support */}
      {(activePage === 'support-ticket' || activePage === 'support' || activePage === 'faqs') && <SupportTicketView />}
    </div>
  );
}
