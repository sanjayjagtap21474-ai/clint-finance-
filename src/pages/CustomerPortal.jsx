import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  USDT_NETWORKS,
  SALARY_LEVELS,
  TRANSACTION_STATUSES,
  FAQS
} from '../data/platformData';
import {
  submitDepositRequest,
  subscribeToUserDepositRequests
} from '../firebase/firestoreService';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Send,
  HelpCircle,
  MessageSquare,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
  Bot,
  User,
  X
} from '../components/Icons';

export default function CustomerPortal() {
  const { activePage, setActivePage, isLoggedIn, goToAuthPage } = useApp();

  return (
    <div className="container fade-in" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Unauthenticated preview banner */}
      {!isLoggedIn && (
        <div style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid var(--gold-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <strong style={{ color: '#FFF', display: 'block', marginBottom: '2px' }}>You are viewing in Preview Mode</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sign in with Firebase or create an account to access your personal Firestore profile and persistent credentials.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => goToAuthPage('login')} className="btn btn-secondary btn-sm">Sign In</button>
            <button onClick={() => goToAuthPage('register')} className="btn btn-gold btn-sm">Create Account</button>
          </div>
        </div>
      )}

      {/* Sub-navigation for Customer Portal */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActivePage('dashboard')}
          className={`btn btn-sm ${activePage === 'dashboard' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Wallet size={15} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActivePage('deposits')}
          className={`btn btn-sm ${activePage === 'deposits' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <ArrowDownLeft size={15} />
          <span>Deposit USDT</span>
        </button>
        <button
          onClick={() => setActivePage('withdrawals')}
          className={`btn btn-sm ${activePage === 'withdrawals' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <ArrowUpRight size={15} />
          <span>Withdrawals</span>
        </button>
        <button
          onClick={() => setActivePage('investments')}
          className={`btn btn-sm ${activePage === 'investments' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <TrendingUp size={15} />
          <span>My Plans</span>
        </button>
        <button
          onClick={() => setActivePage('customer-referrals')}
          className={`btn btn-sm ${activePage === 'customer-referrals' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Users size={15} />
          <span>Referrals</span>
        </button>
        <button
          onClick={() => setActivePage('customer-salary')}
          className={`btn btn-sm ${activePage === 'customer-salary' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Award size={15} />
          <span>Salary & Tours</span>
        </button>
        <button
          onClick={() => setActivePage('support')}
          className={`btn btn-sm ${activePage === 'support' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <MessageSquare size={15} />
          <span>Support & AI Bot</span>
        </button>
        <button
          onClick={() => setActivePage('faqs')}
          className={`btn btn-sm ${activePage === 'faqs' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <HelpCircle size={15} />
          <span>FAQs</span>
        </button>
      </div>

      {/* Render Subview */}
      {activePage === 'deposits' && <DepositWorkflowView />}
      {activePage === 'withdrawals' && <WithdrawalWorkflowView />}
      {activePage === 'investments' && <CustomerInvestmentsView />}
      {activePage === 'customer-referrals' && <CustomerReferralsView />}
      {activePage === 'customer-salary' && <CustomerSalaryView />}
      {activePage === 'support' && <CustomerSupportView />}
      {activePage === 'faqs' && <CustomerFaqsView />}
      {activePage === 'dashboard' && <CustomerDashboardView />}
    </div>
  );
}

/* ==========================================================================
   CUSTOMER DASHBOARD OVERVIEW
   ========================================================================== */
function CustomerDashboardView() {
  const { user, transactions, userPlans, setActivePage, updateProfileData } = useApp();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName || '');
  const [countryInput, setCountryInput] = useState(user.country || 'United Arab Emirates');
  const [phoneInput, setPhoneInput] = useState(user.phoneNumber || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfileData({
      fullName: nameInput,
      country: countryInput,
      phoneNumber: phoneInput
    });
    setSavingProfile(false);
    setEditProfileOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-card gold-rim" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-gold">{user.salaryLevel} Ambassador</span>
              <span className="badge badge-success">{user.verifiedStatus}</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#FFF' }}>
              Welcome back, <span className="gold-text">{user.fullName || 'Sight Client'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Display ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{user.id || '—'}</span>
              {user.uid && (
                <span> • Firebase UID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{user.uid}</span></span>
              )}
              {user.country && <span> • Jurisdiction: {user.country}</span>}
              {user.email && <span> • Email: <span style={{ color: 'var(--text-white)' }}>{user.email}</span></span>}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setNameInput(user.fullName || '');
                setCountryInput(user.country || 'United Arab Emirates');
                setPhoneInput(user.phoneNumber || '');
                setEditProfileOpen(true);
              }}
              className="btn btn-secondary btn-sm"
            >
              <User size={15} />
              <span>Edit Profile</span>
            </button>
            <button onClick={() => setActivePage('deposits')} className="btn btn-gold btn-sm">
              <ArrowDownLeft size={16} />
              <span>Deposit USDT</span>
            </button>
            <button onClick={() => setActivePage('withdrawals')} className="btn btn-secondary btn-sm">
              <ArrowUpRight size={16} />
              <span>Request Withdrawal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditProfileOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>Edit Permitted Profile Details</h3>
              <button
                onClick={() => setEditProfileOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              In accordance with security rules, users can update display details. Privileged fields (balances, role, verification status) are protected and immutable from client SDK.
            </p>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Jurisdiction / Country
                </label>
                <select
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  className="form-control"
                >
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Other International">Other International</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Contact Phone / Telegram (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+971 50 000 0000"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-gold"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Balance Metric Cards (Simulated) */}
      <div className="grid-4">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Available Balance</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            ${user.balances.availableUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            <span>Liquid USDT Reserves</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Allocated</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>3 Plans</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-bright)', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            ${user.balances.activeInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Accruing nominal daily yields
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Accrued Yield</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Simulated</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            +${user.balances.totalProfitSimulated.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.3rem' }}>
            +$66.00 / 24h simulated rate
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Affiliate Bonuses</span>
            <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>10% Direct</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-champagne)', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
            ${user.balances.totalReferralBonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            From 38 downline members
          </div>
        </div>
      </div>

      {/* Mid-Row: Active Plans Progress & Salary Ladder Progress */}
      <div className="grid-2">
        {/* Active Plans Summary */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>Active Plans</h3>
            <button onClick={() => setActivePage('investments')} style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', fontSize: '0.8rem', cursor: 'pointer' }}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userPlans.map(plan => (
              <div key={plan.id} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: '#FFF', fontSize: '0.9rem' }}>{plan.planName}</span>
                  <span style={{ fontWeight: 700, color: 'var(--gold-bright)', fontSize: '0.9rem' }}>${plan.entryAmount} USDT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Daily Yield: +${plan.dailyYield}</span>
                  <span>Target: ${plan.targetListed.toLocaleString()}</span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${plan.progressPercent}%`, height: '100%', background: 'var(--gold-gradient)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Level Status */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>Ambassador Salary Tier</h3>
            <span className="badge badge-gold">Basic Level</span>
          </div>

          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid var(--gold-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Monthly Salary:</span>
              <span style={{ fontWeight: 700, color: 'var(--gold-bright)', fontSize: '1.1rem' }}>$25 – $30 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Direct Referrals Count:</span>
              <span style={{ fontWeight: 700, color: '#FFF' }}>{user.directReferralsCount} / 50</span>
            </div>

            {/* Progress to Silver */}
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-champagne)', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Progress to Silver Tier (1 Domestic Tour)</span>
              <span>76%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #D4AF37 0%, #10B981 100%)' }} />
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Only <strong>12 more direct referrals</strong> required to unlock Silver Ambassador rank ($50–$75/month + 1 Complimentary Luxury Domestic Tour Voucher).
          </p>

          <button onClick={() => setActivePage('customer-salary')} className="btn btn-outline-gold btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
            Inspect Complete Salary Ladder
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>Recent Transactions & Clearing History</h3>
          <span className="badge badge-neutral">{transactions.length} Records</span>
        </div>

        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Network</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Note / Confirmations</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx.id}>
                  <td data-label="Tx ID" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gold-champagne)' }}>{tx.id}</td>
                  <td data-label="Type">
                    <span style={{
                      fontWeight: 600,
                      color: tx.type === 'Deposit' ? '#10B981' : tx.type === 'Withdrawal' ? '#EF4444' : 'var(--gold-bright)'
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td data-label="Amount" style={{ fontWeight: 700, color: '#FFF' }}>${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
                  <td data-label="Network"><span className="badge badge-neutral">{tx.network}</span></td>
                  <td data-label="Status">
                    <span className={`badge ${
                      tx.status === 'Completed' ? 'badge-success' :
                      tx.status === 'Processing' || tx.status === 'Under Review' || tx.status === 'Submitted' ? 'badge-pending' : 'badge-danger'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td data-label="Timestamp" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.date}</td>
                  <td data-label="Note / Confirmations" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {tx.note} {tx.confirmations ? `(${tx.confirmations})` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   USDT DEPOSIT — PHASE 1 (Secure Intake Module)
   ========================================================================== */
function DepositWorkflowView() {
  const { networks, showToast, firebaseUser, user, isLoggedIn } = useApp();
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [txHashInput, setTxHashInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [depositHistory, setDepositHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const activeNet = networks[selectedNetwork];
  const isSetupPending = activeNet?.depositSetupPending === true || !activeNet?.depositAddress;

  // Subscribe to the user's own deposit request records
  useEffect(() => {
    if (!isLoggedIn || !firebaseUser?.uid) {
      setDepositHistory([]);
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    const unsub = subscribeToUserDepositRequests(
      firebaseUser.uid,
      (records) => {
        setDepositHistory(records);
        setHistoryLoading(false);
      },
      (err) => {
        console.error('Deposit history error:', err);
        setHistoryLoading(false);
      }
    );
    return () => unsub();
  }, [isLoggedIn, firebaseUser?.uid]);

  const handleSubmitTxNotification = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !firebaseUser?.uid) {
      showToast('Please sign in to submit a deposit notification.', 'danger');
      return;
    }
    if (!txHashInput || txHashInput.trim().length < 16) {
      showToast('Please enter a valid transaction hash (minimum 16 characters).', 'danger');
      return;
    }
    if (!amountInput || isNaN(amountInput) || parseFloat(amountInput) <= 0) {
      showToast('Please enter a valid amount greater than zero.', 'danger');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitDepositRequest(
        firebaseUser.uid,
        user.id || `USR-${firebaseUser.uid.substring(0, 6).toUpperCase()}`,
        {
          network: selectedNetwork,
          txHash: txHashInput.trim(),
          tokenAmountClaimed: parseFloat(amountInput)
        }
      );
      setSubmittedRef(result.id);
      setSubmitted(true);
      setTxHashInput('');
      setAmountInput('');
      showToast('Deposit notification submitted. Our team will verify on-chain.', 'gold');
    } catch (err) {
      console.error('Deposit request error:', err);
      showToast(err.message || 'Submission failed. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'pending_backend_review') return '#F59E0B';
    if (status === 'verified') return '#10B981';
    if (status === 'rejected') return '#EF4444';
    return 'var(--text-secondary)';
  };

  const statusLabel = (status) => {
    if (status === 'pending_backend_review') return 'Pending Review';
    if (status === 'verified') return 'Verified';
    if (status === 'rejected') return 'Rejected';
    return status;
  };

  const formatTs = (ts) => {
    if (!ts) return '—';
    if (ts.toDate) return ts.toDate().toLocaleString();
    return String(ts);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>USDT Deposit</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          USDT-Only <span className="gold-text">Deposit Module</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Supports TRON TRC20 and BNB Smart Chain BEP20. All deposits are independently verified by our backend.
        </p>
      </div>

      {/* Phase 1 — Setup Pending Notice */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.07)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <ShieldAlert size={22} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, color: '#FDE68A', marginBottom: '0.3rem', fontSize: '0.95rem' }}>
            Deposit setup pending security approval.
          </div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Wallet addresses for TRC20 and BEP20 deposits are being provisioned through our secure custody infrastructure.
            No deposit address will be displayed until the configuration has been reviewed and approved by our security team.
            <strong style={{ color: '#FDE68A' }}> Do not send funds until an official address is published through our verified channels.</strong>
          </div>
        </div>
      </div>

      {/* Network Selector */}
      <div className="glass-card gold-rim" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.25rem' }}>
          Select Deposit Network
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* TRC20 */}
          <div
            onClick={() => setSelectedNetwork('TRC20')}
            id="network-trc20"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: selectedNetwork === 'TRC20' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255,255,255,0.02)',
              border: '1.5px solid',
              borderColor: selectedNetwork === 'TRC20' ? 'var(--gold-primary)' : 'var(--border-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1.05rem' }}>TRC20</span>
              <span className="badge badge-neutral">TRON</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TRON Mainnet</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-champagne)', marginTop: '0.4rem' }}>
              {networks.TRC20?.requiredConfirmations} block confirmations required
            </div>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', marginTop: '0.35rem' }}>
              ● Pending address setup
            </div>
          </div>

          {/* BEP20 */}
          <div
            onClick={() => setSelectedNetwork('BEP20')}
            id="network-bep20"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: selectedNetwork === 'BEP20' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255,255,255,0.02)',
              border: '1.5px solid',
              borderColor: selectedNetwork === 'BEP20' ? 'var(--gold-primary)' : 'var(--border-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1.05rem' }}>BEP20</span>
              <span className="badge badge-neutral">BSC</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BNB Smart Chain</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-champagne)', marginTop: '0.4rem' }}>
              {networks.BEP20?.requiredConfirmations} block confirmations required
            </div>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', marginTop: '0.35rem' }}>
              ● Pending address setup
            </div>
          </div>
        </div>

        {/* Official Ingestion Vault Address / Address-Copy UI */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {selectedNetwork} Ingestion Vault Address
            </div>
            <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
              {isSetupPending ? 'Security Approval Pending' : 'Active Ingestion Vault'}
            </span>
          </div>

          {isSetupPending ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px dashed rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontWeight: 600, fontSize: '0.9rem' }}>
                <ShieldAlert size={18} />
                <span>Deposit setup pending security approval.</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.5 }}>
                No wallet address is displayed. Custody infrastructure provisioning is underway. Do not send funds until an official audited address is published.
              </div>
              <button
                id="btn-copy-deposit-address"
                type="button"
                className="btn btn-secondary btn-sm"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed', marginTop: '0.25rem' }}
                title="Address copy is disabled until secure wallet infrastructure is approved."
              >
                <Copy size={14} />
                <span>Copy Address (Pending Setup)</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={activeNet?.depositAddress || ''}
                className="form-input font-mono"
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button
                id="btn-copy-deposit-address"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeNet?.depositAddress || '');
                  showToast('Deposit address copied to clipboard.', 'gold');
                }}
                className="btn btn-gold btn-sm"
              >
                <Copy size={14} />
                <span>Copy Address</span>
              </button>
            </div>
          )}
        </div>

        {/* Deposit Instructions */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Deposit Instructions — {selectedNetwork}
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Wait for an official deposit address to be published through verified Sight Finance channels.
            </li>
            <li style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Send <strong style={{ color: '#FFF' }}>USDT only</strong> on the <strong style={{ color: '#FFF' }}>{activeNet?.name}</strong> network. Sending other assets causes permanent loss.
            </li>
            <li style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              After sending, return here and submit your transaction hash so our team can verify on-chain.
            </li>
            <li style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your deposit will be credited after <strong style={{ color: '#FFF' }}>{activeNet?.requiredConfirmations} block confirmations</strong> are independently verified by our backend.
            </li>
          </ol>
        </div>

        {/* Network fee notice */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          ℹ {activeNet?.feeNotice}
        </div>
      </div>

      {/* Transaction Hash Notification Form */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.4rem' }}>
          Submit Transaction Notification
        </h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          After you have sent USDT to the official address (once published), enter your transaction hash below.
          Our backend will independently verify the transaction on-chain.
          <strong style={{ color: '#FDE68A' }}> Do not submit until real funds have been sent and a valid deposit address has been confirmed.</strong>
        </p>

        {!isLoggedIn ? (
          <div style={{
            background: 'rgba(212, 175, 55, 0.07)',
            border: '1px solid var(--gold-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Please <strong style={{ color: 'var(--gold-bright)' }}>sign in</strong> to submit a deposit notification.
          </div>
        ) : submitted ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.07)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={36} color="#10B981" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1rem', marginBottom: '0.35rem' }}>
              Notification Received
            </div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Reference ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{submittedRef}</span>
              <br />
              Our backend will verify your transaction on-chain. You will see the status update below once reviewed.
              <br />
              <strong style={{ color: '#FDE68A' }}>No balance has been credited yet.</strong> Credits are issued only after independent server-side blockchain verification.
            </div>
            <button
              id="btn-submit-another"
              onClick={() => { setSubmitted(false); setSubmittedRef(null); }}
              className="btn btn-secondary btn-sm"
            >
              Submit Another Notification
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTxNotification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="deposit-network-display">Selected Network</label>
              <div id="deposit-network-display" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.9rem',
                fontSize: '0.9rem',
                color: 'var(--gold-bright)',
                fontWeight: 600
              }}>
                {activeNet?.name}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deposit-amount-input">
                Amount Claimed Sent (USDT) — unverified
              </label>
              <input
                id="deposit-amount-input"
                type="number"
                className="form-input"
                placeholder="e.g. 500.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                min="0.01"
                step="0.01"
                required
                disabled={submitting}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                This is the amount you claim to have sent. It will be verified against blockchain data by our backend.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deposit-txhash-input">
                Transaction Hash / TxID
              </label>
              <input
                id="deposit-txhash-input"
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                placeholder={selectedNetwork === 'BEP20' ? '0x8f2a...' : '4f7a9d...'}
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                minLength={16}
                required
                disabled={submitting}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Must be the exact on-chain transaction hash from your {selectedNetwork === 'BEP20' ? 'BSCScan' : 'Tronscan'} explorer. Screenshots are not accepted.
              </div>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.07)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: '#FCA5A5'
            }}>
              <strong>Warning:</strong> Do not submit this form if you have not yet sent real USDT to an official, published deposit address. No simulated or test transactions are accepted. Submitting false hashes may result in account suspension.
            </div>

            <button
              id="btn-submit-deposit-notification"
              type="submit"
              className="btn btn-gold"
              disabled={submitting || isSetupPending}
              style={{ justifyContent: 'center' }}
            >
              {submitting ? 'Submitting...' : isSetupPending
                ? 'Deposit Intake Disabled — Setup Pending'
                : 'Submit Deposit Notification for Backend Review'}
            </button>
          </form>
        )}
      </div>

      {/* Transaction Status History */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#FFF' }}>
            My Deposit Notifications
          </h3>
          {!historyLoading && (
            <span className="badge badge-neutral">{depositHistory.length} Record{depositHistory.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {!isLoggedIn ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            Sign in to view your deposit notification history.
          </p>
        ) : historyLoading ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            Loading history...
          </p>
        ) : depositHistory.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No deposit notifications submitted yet.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Network</th>
                  <th>Claimed Amount</th>
                  <th>Tx Hash</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory.map((record) => (
                  <tr key={record.docId}>
                    <td data-label="Reference" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold-champagne)' }}>
                      {record.docId ? record.docId.substring(0, 10) + '...' : '—'}
                    </td>
                    <td data-label="Network"><span className="badge badge-neutral">{record.network}</span></td>
                    <td data-label="Claimed Amount" style={{ fontWeight: 700, color: '#FFF' }}>
                      {record.tokenAmountClaimed != null
                        ? `$${Number(record.tokenAmountClaimed).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`
                        : '—'}
                      <div style={{ fontSize: '0.7rem', color: '#F59E0B', marginTop: '2px' }}>Unverified claim</div>
                    </td>
                    <td data-label="Tx Hash" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {record.txHash ? record.txHash.substring(0, 18) + '...' : '—'}
                    </td>
                    <td data-label="Status">
                      <span style={{ fontWeight: 700, color: statusColor(record.verificationStatus), fontSize: '0.82rem' }}>
                        {statusLabel(record.verificationStatus)}
                      </span>
                    </td>
                    <td data-label="Submitted" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {formatTs(record.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> Deposit records shown here are <em>unverified notifications</em> only. Balance credits are issued exclusively after independent, server-side blockchain verification by Sight Finance operations. Verification status updates are processed by our backend team.
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   WITHDRAWAL WORKFLOW (Prompt Section 6)
   ========================================================================== */
function WithdrawalWorkflowView() {
  const { user, requestWithdrawal, transactions, showToast } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState('200');
  const [withdrawNetwork, setWithdrawNetwork] = useState('TRC20');
  const [destAddress, setDestAddress] = useState('');
  const [submittedTx, setSubmittedTx] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destAddress || destAddress.length < 24) {
      showToast('Please provide a valid destination wallet address.', 'danger');
      return;
    }

    const res = requestWithdrawal({
      amount: withdrawAmount,
      network: withdrawNetwork,
      destinationAddress: destAddress
    });

    if (res.success) {
      setSubmittedTx(res.tx);
      setDestAddress('');
    } else {
      showToast('Withdrawal rejected: Insufficient available balance.', 'danger');
    }
  };

  const userWithdrawals = transactions.filter(t => t.type === 'Withdrawal');

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Outbound Liquidity</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          USDT <span className="gold-text">Withdrawal Gateway</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Multi-stage status progression: Draft → Submitted → Under Review → Approved → Processing → Completed.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        {/* Request Form */}
        <form onSubmit={handleSubmit} className="glass-card gold-rim" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1.25rem' }}>
            Request New Withdrawal
          </h3>

          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--gold-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Liquid USDT:</span>
            <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1rem' }}>
              ${user.balances.availableUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Withdrawal Amount (USDT)</label>
            <input
              type="number"
              className="form-input"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="10"
              max={user.balances.availableUSDT}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Destination USDT Network</label>
            <select
              className="form-select"
              value={withdrawNetwork}
              onChange={(e) => setWithdrawNetwork(e.target.value)}
            >
              <option value="TRC20">TRON Network (TRC20) — Verified Standard</option>
              <option value="BEP20">BNB Smart Chain (BEP20) — Binance-Peg</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Destination Wallet Address</label>
            <input
              type="text"
              className="form-input font-mono"
              placeholder={withdrawNetwork === 'TRC20' ? 'TR7NHqjeKQxGTCi8q8ZY4pL...' : '0x71C...'}
              value={destAddress}
              onChange={(e) => setDestAddress(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Submit for Compliance Review
          </button>
        </form>

        {/* Life-Cycle Statuses Guide */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-bright)', marginBottom: '0.75rem' }}>
            Withdrawal Audit Lifecycle
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Every withdrawal is evaluated through rigorous engineering controls to prevent double-spending and ensure AML sanctions screening:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { status: 'Submitted', desc: 'Request registered; queued for automated compliance scan.' },
              { status: 'Under Review', desc: 'Manual or automated fraud scoring underway.' },
              { status: 'Approved', desc: 'Sanctions cleared; scheduled for batch on-chain release.' },
              { status: 'Processing', desc: 'Broadcasted to TRON / BSC network mempool.' },
              { status: 'Completed', desc: 'Mined into block header with immutable hash proof.' }
            ].map(s => (
              <div key={s.status} style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}>
                <div style={{ fontWeight: 700, color: '#FFF' }}>{s.status}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Withdrawal Queue Table */}
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1.25rem' }}>
          Your Outbound Withdrawal History
        </h3>

        {userWithdrawals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No withdrawal requests logged yet.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Amount</th>
                  <th>Network</th>
                  <th>Destination Address</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Review Note</th>
                </tr>
              </thead>
              <tbody>
                {userWithdrawals.map(w => (
                  <tr key={w.id}>
                    <td data-label="Request ID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{w.id}</td>
                    <td data-label="Amount" style={{ fontWeight: 700, color: '#FFF' }}>${w.amount.toFixed(2)} USDT</td>
                    <td data-label="Network"><span className="badge badge-neutral">{w.network}</span></td>
                    <td data-label="Destination Address" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {w.destinationAddress ? `${w.destinationAddress.substring(0, 10)}...` : 'N/A'}
                    </td>
                    <td data-label="Status">
                      <span className={`badge ${
                        w.status === 'Completed' ? 'badge-success' :
                        w.status === 'Submitted' || w.status === 'Under Review' || w.status === 'Processing' ? 'badge-pending' : 'badge-danger'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td data-label="Date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.date}</td>
                    <td data-label="Review Note" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   CUSTOMER ACTIVE PLANS
   ========================================================================== */
function CustomerInvestmentsView() {
  const { userPlans, setActivePage } = useApp();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#FFF' }}>
            My Active <span className="gold-text">Plans</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time simulated yield progression and maturity tracking.
          </p>
        </div>

        <button onClick={() => setActivePage('plans')} className="btn btn-gold btn-sm">
          Subscribe to New Plan
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {userPlans.map(plan => (
          <div key={plan.id} className="glass-card gold-rim" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.35rem' }}>{plan.status} Contract</span>
                <h3 style={{ fontSize: '1.35rem', color: '#FFF' }}>{plan.planName}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Activated: {plan.startDate} • Term: {plan.duration}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allocated Capital</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
                  ${plan.entryAmount.toLocaleString()} USDT
                </div>
              </div>
            </div>

            <div className="grid-3" style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Accrual:</span>
                <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1.1rem' }}>+${plan.dailyYield.toFixed(2)} USDT</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative Yield Accrued:</span>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>${plan.accruedYield.toFixed(2)} USDT</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Listed Return:</span>
                <div style={{ fontWeight: 700, color: 'var(--gold-champagne)', fontSize: '1.1rem' }}>${plan.targetListed.toLocaleString()} USDT</div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Contract Horizon Completion</span>
                <span>{plan.progressPercent}% Elapsed</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${plan.progressPercent}%`, height: '100%', background: 'var(--gold-gradient)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   CUSTOMER REFERRALS
   ========================================================================== */
function CustomerReferralsView() {
  const { user, referrals, showToast } = useApp();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Affiliate Ledger</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Direct Referrals & <span className="gold-text">10% Bonus Tree</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Inspect verified members onboarded through your link and real-time bonus yields.
        </p>
      </div>

      {/* Downline Table */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Direct Downline Associates</h3>
          <span className="badge badge-gold">{referrals.length} Verified Associates</span>
        </div>

        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Jurisdiction</th>
                <th>Join Date</th>
                <th>Qualifying Ingestion</th>
                <th>10% Bonus Earned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id}>
                  <td data-label="Member ID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{r.id}</td>
                  <td data-label="Name" style={{ fontWeight: 600, color: '#FFF' }}>{r.name}</td>
                  <td data-label="Jurisdiction">{r.country}</td>
                  <td data-label="Join Date" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.joinedDate}</td>
                  <td data-label="Qualifying Ingestion" style={{ fontWeight: 700, color: '#FFF' }}>${r.depositTotal.toLocaleString()} USDT</td>
                  <td data-label="10% Bonus Earned" style={{ fontWeight: 700, color: '#10B981' }}>+${r.bonusEarned.toLocaleString()} USDT</td>
                  <td data-label="Status"><span className="badge badge-success">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CUSTOMER SALARY & TOURS
   ========================================================================== */
function CustomerSalaryView() {
  const { user } = useApp();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Career Ladder</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Ambassador Salary & <span className="gold-text">Luxury Tour Rewards</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track qualification towards monthly executive retainers and international delegations.
        </p>
      </div>

      {/* Tour Showcase Cards */}
      <div className="grid-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Silver Tier Benefit</div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.5rem' }}>
            1 Complimentary Domestic Tour
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Attain 50 direct active referrals to unlock a curated luxury UAE retreat. Includes 2 nights at the Al Wadi Desert Oasis, private dinner under the dunes, and executive leadership briefings.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
            Status: {user.directReferralsCount >= 50 ? 'UNLOCKED' : `${50 - user.directReferralsCount} Referrals Remaining`}
          </div>
        </div>

        <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Gold Tier Benefit</div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.5rem' }}>
            2 Domestic Tours + 1 International Tour
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Attain 100 direct active referrals to unlock two UAE luxury retreats plus an all-inclusive International VIP Delegation (choice of Dubai Mega-Yacht Gala, Maldives Overwater Retreat, or Swiss Alpine Forum).
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-bright)', fontWeight: 600 }}>
            Status: {user.directReferralsCount >= 100 ? 'UNLOCKED' : `${100 - user.directReferralsCount} Referrals Remaining`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CUSTOMER SUPPORT & AI BOT CONCIERGE
   ========================================================================== */
function CustomerSupportView() {
  const { tickets, createSupportTicket } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Deposit/Withdrawal');
  const [message, setMessage] = useState('');

  // AI Live Bot Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings. I am SightAI Concierge, your automated guide. How may I assist you with USDT clearing, plan calculations, referral rules, or our Dubai compliance framework?'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuestion('');

    // Automated Intelligent Reply Simulator
    setTimeout(() => {
      let reply = 'Thank you for your inquiry. Our Dubai DIFC compliance and support team is on standby to assist you with any questions.';
      const lower = userText.toLowerCase();

      if (lower.includes('deposit') || lower.includes('usdt') || lower.includes('trc20') || lower.includes('bep20')) {
        reply = 'Sight Finance accepts USDT on TRON (TRC20 - 12 confirmations) and BNB Smart Chain (BEP20 - 15 confirmations). Always send USDT to the specific vault address displayed in your deposit stepper to avoid permanent loss.';
      } else if (lower.includes('plan') || lower.includes('5%') || lower.includes('6%') || lower.includes('return')) {
        reply = 'Plan A features a nominal 5% daily-growth label, and Plan B features a 6% label across Basic, Prime, and Bolt tiers. Please note these are demonstrative mathematical models and require formal financial hedging prior to live deployment.';
      } else if (lower.includes('referral') || lower.includes('bonus') || lower.includes('10%')) {
        reply = 'You receive an instant 10% direct bonus whenever a registered associate subscribes to a qualifying demo plan. Duplicate accounts and self-referrals are automatically rejected by our anti-abuse engine.';
      } else if (lower.includes('salary') || lower.includes('tour') || lower.includes('reward')) {
        reply = 'Our ambassador salary ladder offers Basic (25 refs: $25–$30/mo), Silver (50 refs: $50–$75/mo + 1 Domestic Tour), and Gold (100 refs: $100/mo + 2 Domestic + 1 International Tour).';
      } else if (lower.includes('dubai') || lower.includes('license') || lower.includes('regulation') || lower.includes('legal')) {
        reply = 'Sight Finance is conceived for Dubai, UAE operations under VARA and DFSA principles. Live financial transactions are strictly blocked until all regulatory audits and custody authorisations are completed.';
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    createSupportTicket(subject, category, 'Medium', message);
    setSubject('');
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>24/7 Concierge</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Customer Support & <span className="gold-text">SightAI Concierge</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Instant algorithmic assistance or official ticket dispatch to our Dubai operations center.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        {/* SightAI Live Chat Box */}
        <div className="glass-card gold-rim" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#050507" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>SightAI Autonomous Concierge</div>
              <div style={{ fontSize: '0.7rem', color: '#10B981' }}>● Online • Knowledge Base v4.2</div>
            </div>
          </div>

          {/* Messages scroll area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
            {chatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: m.sender === 'user' ? '#050507' : '#FFF',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '12px',
                  fontSize: '0.825rem',
                  lineHeight: 1.5,
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ask SightAI about USDT, plans, or Dubai rules..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-gold btn-sm" style={{ padding: '0.6rem 1rem' }}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Support Ticket Submission */}
        <form onSubmit={handleTicketSubmit} className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1rem' }}>
            Open Compliance & Support Ticket
          </h3>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ingestion inquiry or tour voucher question"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Deposit/Withdrawal">USDT Deposit & Withdrawal Clearing</option>
              <option value="Investment Plans">Plan Allocation & Accrual</option>
              <option value="Salary & Rewards">Affiliate Bonus & Tour Benefits</option>
              <option value="Compliance">Regulatory & KYC Verification</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Provide complete details including any relevant transaction IDs..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
            Dispatch Ticket to Dubai Desk
          </button>
        </form>
      </div>

      {/* Ticket History */}
      <div className="glass-card" style={{ padding: '1.75rem', marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1rem' }}>
          Your Registered Support Tickets
        </h3>

        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Ticket UID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Latest Official Update</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{t.id}</td>
                  <td style={{ fontWeight: 600, color: '#FFF' }}>{t.subject}</td>
                  <td><span className="badge badge-neutral">{t.category}</span></td>
                  <td>
                    <span className={`badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-pending'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.date}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.lastReply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CUSTOMER FAQS
   ========================================================================== */
function CustomerFaqsView() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Knowledge Base</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Frequently Asked <span className="gold-text">Questions</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Transparent answers regarding prototype demonstration rules, USDT mechanics, and UAE operational intent.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.5rem',
                border: isOpen ? '1px solid var(--gold-border)' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: isOpen ? 'var(--gold-bright)' : '#FFF', fontWeight: 600 }}>
                  {faq.q}
                </h3>
                <span style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', fontWeight: 700 }}>
                  {isOpen ? '−' : '+'}
                </span>
              </div>

              {isOpen && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
