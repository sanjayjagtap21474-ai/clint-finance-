import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TRANSACTION_STATUSES,
  SALARY_LEVELS
} from '../data/platformData';
import {
  adminUpdateUserBalanceDoc
} from '../firebase/firestoreService';
import {
  Shield,
  Users,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Award,
  AlertTriangle,
  Cpu,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Lock,
  Eye,
  Sliders,
  Check
} from '../components/Icons';

export default function AdminPortal() {
  const {
    activePage,
    setActivePage,
    allRegisteredUsers,
    setAllRegisteredUsers,
    transactions,
    updateTransactionStatus,
    adminLogs,
    aiReports,
    networks,
    setNetworks,
    showDemoBanner,
    setShowDemoBanner,
    showToast,
    siteBranding,
    saveAdminBranding,
    logSystemEvent
  } = useApp();

  const [adminTab, setAdminTab] = useState('overview'); // overview, customers, transactions, logs, ai-reports, settings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Config settings form state
  const [trc20AddressInput, setTrc20AddressInput] = useState(networks.TRC20.depositAddress);
  const [bep20AddressInput, setBep20AddressInput] = useState(networks.BEP20.depositAddress);

  // Site Branding form state
  const [brandingForm, setBrandingForm] = useState({
    websiteName: siteBranding?.websiteName || 'SIGHT FINANCE',
    tagline: siteBranding?.tagline || 'Institutional Digital Wealth & USDT Clearing Gateway',
    logoUrl: siteBranding?.logoUrl || '/logo.png',
    contactEmail: siteBranding?.contactEmail || 'support@sightfinance.ae',
    physicalAddress: siteBranding?.physicalAddress || 'DIFC Gate Precinct, Building 4, Level 7, Dubai, UAE',
    copyrightText: siteBranding?.copyrightText || '© 2026 SIGHT FINANCE. All Rights Reserved.'
  });

  React.useEffect(() => {
    if (siteBranding) {
      setBrandingForm(prev => ({
        ...prev,
        ...siteBranding
      }));
    }
  }, [siteBranding]);

  // Edit user balance modal
  const [editingUser, setEditingUser] = useState(null);
  const [editBalanceAmount, setEditBalanceAmount] = useState('');

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    setNetworks(prev => ({
      ...prev,
      TRC20: { ...prev.TRC20, depositAddress: trc20AddressInput },
      BEP20: { ...prev.BEP20, depositAddress: bep20AddressInput }
    }));

    if (saveAdminBranding) {
      await saveAdminBranding(brandingForm);
    }

    if (logSystemEvent) {
      logSystemEvent('Site Branding & Vault Settings Updated', 'Administrator', `Updated name: ${brandingForm.websiteName}, TRC20: ${trc20AddressInput.substring(0, 10)}...`);
    }

    showToast('Site Branding & Vault Configuration saved successfully!', 'gold');
  };

  // Manual Balance Management State
  const [adjustmentType, setAdjustmentType] = useState('credit');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submittingBalance, setSubmittingBalance] = useState(false);

  const previousBalance = parseFloat(editingUser?.balance || 0);
  const numericAmount = parseFloat(adjustmentAmount) || 0;
  let resultingBalance = previousBalance;
  if (adjustmentType === 'credit') resultingBalance = previousBalance + numericAmount;
  else if (adjustmentType === 'debit') resultingBalance = Math.max(0, previousBalance - numericAmount);
  else if (adjustmentType === 'set') resultingBalance = numericAmount;

  const handleReviewAdjustment = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    if (numericAmount <= 0 && adjustmentType !== 'set') {
      showToast('Please enter a valid adjustment amount greater than zero.', 'danger');
      return;
    }
    if (!adjustmentReason || adjustmentReason.trim().length < 3) {
      showToast('A mandatory reason / audit note (at least 3 characters) is required for compliance.', 'danger');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmAdjustment = async () => {
    if (!editingUser) return;
    setSubmittingBalance(true);
    try {
      await adminUpdateUserBalanceDoc(
        firebaseUser?.uid || 'admin',
        editingUser.uid || editingUser.id,
        adjustmentType,
        numericAmount,
        adjustmentReason,
        previousBalance
      );

      showToast(`Successfully adjusted balance for ${editingUser.name}. Previous: $${previousBalance.toFixed(2)} -> Resulting: $${resultingBalance.toFixed(2)}`, 'gold');
      if (logSystemEvent) {
        logSystemEvent(
          'Manual Balance Adjustment',
          firebaseUser?.email || 'admin@sightfinance.io',
          `Customer ${editingUser.name} (${editingUser.id}): ${adjustmentType.toUpperCase()} $${numericAmount.toFixed(2)}. Result: $${resultingBalance.toFixed(2)}. Reason: ${adjustmentReason}`,
          'Success'
        );
      }
      setAllRegisteredUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, balance: resultingBalance } : u));
      setEditingUser(null);
      setShowConfirmationModal(false);
      setAdjustmentAmount('');
      setAdjustmentReason('');
      setAdjustmentType('credit');
    } catch (err) {
      showToast('Error updating balance in Firestore: ' + err.message, 'danger');
    } finally {
      setSubmittingBalance(false);
    }
  };

  // Filtered transactions
  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.txHash && t.txHash.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.destinationAddress && t.destinationAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container fade-in" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Admin Header Bar */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>
              SightAI Administrative Sentinel & Operations Core
            </div>
            <div style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>
              Dubai DIFC Operations Node • Role: Sovereign Compliance Admin
            </div>
          </div>
        </div>

        <div className="badge badge-danger">
          RESTRICTED GOVERNANCE ACCESS
        </div>
      </div>

      {/* Admin Subnav */}
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
          onClick={() => setAdminTab('overview')}
          className={`btn btn-sm ${adminTab === 'overview' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <TrendingUp size={15} />
          <span>Operational Health</span>
        </button>
        <button
          onClick={() => setAdminTab('transactions')}
          className={`btn btn-sm ${adminTab === 'transactions' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <ArrowRightLeftIcon />
          <span>Ingestion & Clearing Queue</span>
        </button>
        <button
          onClick={() => setAdminTab('customers')}
          className={`btn btn-sm ${adminTab === 'customers' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Users size={15} />
          <span>Registered Customers</span>
        </button>
        <button
          onClick={() => setAdminTab('ai-reports')}
          className={`btn btn-sm ${adminTab === 'ai-reports' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Cpu size={15} />
          <span>SightAI Risk Reports</span>
        </button>
        <button
          onClick={() => setAdminTab('logs')}
          className={`btn btn-sm ${adminTab === 'logs' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <FileText size={15} />
          <span>Security & System Logs</span>
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`btn btn-sm ${adminTab === 'settings' ? 'btn-gold' : 'btn-secondary'}`}
        >
          <Settings size={15} />
          <span>Platform Config</span>
        </button>
      </div>

      {/* SUBVIEW 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid-4">
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Accounts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginTop: '0.5rem' }}>
                {allRegisteredUsers.length} <small style={{ fontSize: '0.8rem', color: '#10B981' }}>Active</small>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                100% KYC Tier 1 or 2
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Simulated Volume Cleared</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-bright)', marginTop: '0.5rem' }}>
                $18.45M <small style={{ fontSize: '0.8rem', color: '#FFF' }}>USDT</small>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Dual-chain ingestion aggregate
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review Queue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.5rem' }}>
                {transactions.filter(t => t.status === 'Under Review' || t.status === 'Submitted').length} Requests
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Awaiting administrative audit
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SightAI Solvency Health</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '0.5rem' }}>
                128.4%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Theoretical reserve coverage
              </div>
            </div>
          </div>

          {/* Quick Queue Action Table */}
          <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>
              Priority Clearing Review Queue
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Click directly on status action buttons to simulate administrator intervention and state machine execution.
            </p>

            <div className="table-wrapper">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Tx ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Network</th>
                    <th>Current Status</th>
                    <th>Submitted Time</th>
                    <th style={{ textAlign: 'right' }}>Admin State Machine</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 6).map(tx => (
                    <tr key={tx.id}>
                      <td data-label="Tx ID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{tx.id}</td>
                      <td data-label="Type"><strong>{tx.type}</strong></td>
                      <td data-label="Amount" style={{ fontWeight: 700, color: '#FFF' }}>${tx.amount.toFixed(2)} USDT</td>
                      <td data-label="Network"><span className="badge badge-neutral">{tx.network}</span></td>
                      <td data-label="Current Status">
                        <span className={`badge ${
                          tx.status === 'Completed' ? 'badge-success' :
                          tx.status === 'Processing' || tx.status === 'Under Review' || tx.status === 'Submitted' ? 'badge-pending' : 'badge-danger'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td data-label="Submitted Time" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</td>
                      <td data-label="Admin State Machine" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          {tx.status !== 'Approved' && tx.status !== 'Completed' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'Approved', 'Cleared by Compliance Admin')}
                              className="btn btn-sm"
                              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 8px', fontSize: '0.725rem' }}
                            >
                              Approve
                            </button>
                          )}
                          {tx.status !== 'Completed' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'Completed', 'Mined into block header')}
                              className="btn btn-sm"
                              style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-bright)', border: '1px solid var(--gold-border)', padding: '3px 8px', fontSize: '0.725rem' }}
                            >
                              Complete
                            </button>
                          )}
                          {tx.status !== 'Rejected' && tx.status !== 'Completed' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'Rejected', 'Failed risk check')}
                              className="btn btn-sm"
                              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '3px 8px', fontSize: '0.725rem' }}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: TRANSACTIONS CLEARING QUEUE */}
      {adminTab === 'transactions' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Full Platform Clearing Ledger</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                All deposit submissions, on-chain verifications, and outbound withdrawal requests.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by ID or TxHash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '220px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              />

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '160px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              >
                <option value="All">All Statuses</option>
                {TRANSACTION_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Tx ID</th>
                  <th>Customer</th>
                  <th>UID</th>
                  <th>Type / Plan</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>State Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No transaction history records found.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map(t => (
                    <tr key={t.docId || t.id}>
                      <td data-label="Tx ID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{t.docId || t.id}</td>
                      <td data-label="Customer">{t.customerName || t.customerEmail || 'Client'}</td>
                      <td data-label="UID" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.uid ? `${t.uid.substring(0, 8)}...` : '—'}</td>
                      <td data-label="Type / Plan"><strong>{t.type}</strong><br/><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.plan || '—'}</span></td>
                      <td data-label="Amount" style={{ fontWeight: 700, color: '#FFF' }}>${Number(t.amount || 0).toFixed(2)} USDT</td>
                      <td data-label="Payment Method"><span className="badge badge-neutral">{t.paymentMethod || t.network || 'USDT'}</span></td>
                      <td data-label="Date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleString() : t.date || '—'}
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${
                          t.status === 'Completed' || t.status === 'Approved' ? 'badge-success' :
                          t.status === 'Submitted' || t.status === 'Under Review' || t.status === 'Pending' ? 'badge-pending' : 'badge-danger'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td data-label="State Action">
                        <select
                          value={t.status}
                          onChange={(e) => updateTransactionStatus(t.docId || t.id, e.target.value, 'State transition by admin')}
                          style={{
                            background: 'rgba(0,0,0,0.6)',
                            border: '1px solid var(--border-medium)',
                            color: '#FFF',
                            borderRadius: '4px',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {TRANSACTION_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: REGISTERED CUSTOMERS */}
      {adminTab === 'customers' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Customer Accounts Management</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Enforce server-side permissions, view client KYC compliance, and audit demo balances.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Client UID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Simulated Balance</th>
                  <th>Active Plans</th>
                  <th>KYC Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allRegisteredUsers.map(u => (
                  <tr key={u.id}>
                    <td data-label="Client UID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{u.id}</td>
                    <td data-label="Full Name" style={{ fontWeight: 600, color: '#FFF' }}>{u.name}</td>
                    <td data-label="Email" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                    <td data-label="Country">{u.country}</td>
                    <td data-label="Simulated Balance" style={{ fontWeight: 700, color: 'var(--gold-bright)' }}>${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
                    <td data-label="Active Plans"><span className="badge badge-neutral">{u.plansActive} Plans</span></td>
                    <td data-label="KYC Status"><span className="badge badge-success">{u.kycStatus}</span></td>
                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditBalanceAmount(u.balance.toString());
                        }}
                        className="btn btn-outline-gold btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                      >
                        Adjust Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: SIGHTAI RISK REPORTS */}
      {adminTab === 'ai-reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {aiReports.map(rep => (
            <div key={rep.id} className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>{rep.id} • Autonomous Audit</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFF' }}>{rep.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {rep.date} • Engine: SightAI Sentinel Neural Mesh v4.2</div>
                </div>
                <div className="badge badge-demo">
                  {rep.riskScore}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {rep.summary}
              </p>

              {/* Metrics Grid */}
              <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
                {rep.metrics.map(m => (
                  <div key={m.label} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>{m.value}</div>
                    <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '2px' }}>{m.status}</div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--gold-border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-bright)', marginBottom: '0.5rem' }}>
                  Mandatory Governance Recommendations:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {rep.recommendations.map((rec, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={14} color="#D4AF37" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBVIEW 5: AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>System Activity & Security Audit Trail</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Immutable event stream with IP telemetry, actor identification, and outcome logging.
              </p>
            </div>
            <span className="badge badge-neutral">{adminLogs.length} Events</span>
          </div>

          <div className="table-wrapper">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Log UID</th>
                  <th>Event Name</th>
                  <th>Actor</th>
                  <th>IP Node</th>
                  <th>Timestamp</th>
                  <th>Action Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {adminLogs.map(l => (
                  <tr key={l.id}>
                    <td data-label="Log UID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)', fontSize: '0.8rem' }}>{l.id}</td>
                    <td data-label="Event Name" style={{ fontWeight: 600, color: '#FFF' }}>{l.event}</td>
                    <td data-label="Actor" style={{ fontSize: '0.85rem' }}>{l.actor}</td>
                    <td data-label="IP Node" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.ip}</td>
                    <td data-label="Timestamp" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.timestamp}</td>
                    <td data-label="Action Details" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.details}</td>
                    <td data-label="Status">
                      <span className={`badge ${
                        l.status === 'Success' || l.status === 'Audit Passed' ? 'badge-success' :
                        l.status === 'Warning' ? 'badge-demo' : 'badge-danger'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 6: PLATFORM & SITE BRANDING SETTINGS */}
      {adminTab === 'settings' && (
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <form onSubmit={handleSaveSettings} className="glass-card gold-rim" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.35rem' }}>
                Site Branding & Platform Configuration
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Customize website name, tagline, contact email, logo URL, and crypto vault addresses across the entire platform.
              </p>
            </div>

            {/* BRANDING SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Website / Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={brandingForm.websiteName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, websiteName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline / Slogan</label>
                <input
                  type="text"
                  className="form-input"
                  value={brandingForm.tagline}
                  onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logo Image URL</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={brandingForm.logoUrl}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact / Support Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={brandingForm.contactEmail}
                  onChange={(e) => setBrandingForm({ ...brandingForm, contactEmail: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Physical Address / Headquarters</label>
                <input
                  type="text"
                  className="form-input"
                  value={brandingForm.physicalAddress}
                  onChange={(e) => setBrandingForm({ ...brandingForm, physicalAddress: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Copyright Notice</label>
                <input
                  type="text"
                  className="form-input"
                  value={brandingForm.copyrightText}
                  onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
                />
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.75rem 0' }} />

            {/* VAULT ADDRESSES SECTION */}
            <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1rem' }}>
              USDT Deposit Vault Addresses
            </h4>

            <div className="form-group">
              <label className="form-label">TRON (TRC20) Deposit Vault Address</label>
              <input
                type="text"
                className="form-input font-mono"
                value={trc20AddressInput}
                onChange={(e) => setTrc20AddressInput(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Administrator-configured TRON wallet address displayed to users.</small>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">BNB Smart Chain (BEP20) Deposit Vault Address</label>
              <input
                type="text"
                className="form-input font-mono"
                value={bep20AddressInput}
                onChange={(e) => setBep20AddressInput(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Binance-Peg USDT smart contract recipient wallet address.</small>
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
              Save Site Branding & Vault Configuration
            </button>
          </form>
        </div>
      )}

      {/* Manual Balance Adjustment Modal (Step 1: Form) */}
      {editingUser && !showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
              Manual Balance Adjustment: {editingUser.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              UID: <code style={{ color: 'var(--gold-champagne)' }}>{editingUser.id}</code> | Current Balance: <strong>${previousBalance.toFixed(2)} USDT</strong>
            </p>

            <form onSubmit={handleReviewAdjustment}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Adjustment Type</label>
                <select
                  className="form-select"
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="credit">Credit (Add Funds)</option>
                  <option value="debit">Debit (Subtract Funds)</option>
                  <option value="set">Set Exact Balance</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Amount (USDT)</label>
                <input
                  type="number"
                  className="form-input"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Calculated Resulting Balance</label>
                <div style={{ padding: '0.75rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', color: 'var(--gold-bright)', fontWeight: 700, fontSize: '1.1rem' }}>
                  ${resultingBalance.toFixed(2)} USDT
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Reason / Audit Note (Required)</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Enter administrative justification for audit trail..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ flex: 1 }}
                >
                  Review & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Step Modal (Step 2) */}
      {editingUser && showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem', maxWidth: '480px', border: '1px solid var(--gold-champagne)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
              Confirm Manual Adjustment
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Please review the adjustment details before persisting to Firestore.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Customer:</strong> {editingUser.name} ({editingUser.id})</div>
              <div><strong>Action:</strong> <span style={{ color: 'var(--gold-champagne)', fontWeight: 700 }}>{adjustmentType.toUpperCase()} ${numericAmount.toFixed(2)}</span></div>
              <div><strong>Existing Balance:</strong> ${previousBalance.toFixed(2)} USDT</div>
              <div><strong>Resulting Balance:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>${resultingBalance.toFixed(2)} USDT</span></div>
              <div><strong>Reason:</strong> {adjustmentReason}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={submittingBalance}
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjustment}
                className="btn btn-gold"
                style={{ flex: 1 }}
                disabled={submittingBalance}
              >
                {submittingBalance ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowRightLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4"/>
      <path d="M20 7H4"/>
      <path d="m8 21-4-4 4-4"/>
      <path d="M4 17h16"/>
    </svg>
  );
}
