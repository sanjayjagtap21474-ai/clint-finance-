import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TRANSACTION_STATUSES,
  SALARY_LEVELS
} from '../data/platformData';
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
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState('overview'); // overview, customers, transactions, logs, ai-reports, settings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Config settings form state
  const [trc20AddressInput, setTrc20AddressInput] = useState(networks.TRC20.depositAddress);
  const [bep20AddressInput, setBep20AddressInput] = useState(networks.BEP20.depositAddress);

  // Edit user balance modal
  const [editingUser, setEditingUser] = useState(null);
  const [editBalanceAmount, setEditBalanceAmount] = useState('');

  const handleSaveAddresses = (e) => {
    e.preventDefault();
    setNetworks(prev => ({
      ...prev,
      TRC20: { ...prev.TRC20, depositAddress: trc20AddressInput },
      BEP20: { ...prev.BEP20, depositAddress: bep20AddressInput }
    }));
    showToast('Platform ingestion vault addresses updated.', 'gold');
  };

  const handleSaveUserBalance = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const newBal = parseFloat(editBalanceAmount);
    setAllRegisteredUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, balance: newBal } : u));
    showToast(`Updated balance for ${editingUser.name} to $${newBal} USDT.`, 'gold');
    setEditingUser(null);
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
                {allRegisteredUsers.length + 38} <small style={{ fontSize: '0.8rem', color: '#10B981' }}>Active</small>
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
                  <th>Type</th>
                  <th>Network</th>
                  <th>Amount</th>
                  <th>Hash / Address</th>
                  <th>Status</th>
                  <th>State Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map(t => (
                  <tr key={t.id}>
                    <td data-label="Tx ID" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{t.id}</td>
                    <td data-label="Type"><strong>{t.type}</strong></td>
                    <td data-label="Network"><span className="badge badge-neutral">{t.network}</span></td>
                    <td data-label="Amount" style={{ fontWeight: 700, color: '#FFF' }}>${t.amount.toFixed(2)} USDT</td>
                    <td data-label="Hash / Address" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {t.txHash ? `${t.txHash.substring(0, 14)}...` : t.destinationAddress ? `${t.destinationAddress.substring(0, 14)}...` : 'Internal'}
                    </td>
                    <td data-label="Status">
                      <span className={`badge ${
                        t.status === 'Completed' ? 'badge-success' :
                        t.status === 'Submitted' || t.status === 'Under Review' || t.status === 'Processing' ? 'badge-pending' : 'badge-danger'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td data-label="State Action">
                      <select
                        value={t.status}
                        onChange={(e) => updateTransactionStatus(t.id, e.target.value, 'State transition by admin')}
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
                ))}
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

      {/* SUBVIEW 6: PLATFORM SETTINGS */}
      {adminTab === 'settings' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <form onSubmit={handleSaveAddresses} className="glass-card gold-rim" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '1.5rem' }}>
              Platform Ingestion & Ingestion Vault Configuration
            </h3>

            <div className="form-group">
              <label className="form-label">TRON (TRC20) Deposit Vault Address</label>
              <input
                type="text"
                className="form-input font-mono"
                value={trc20AddressInput}
                onChange={(e) => setTrc20AddressInput(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Only administrator-configured addresses may be displayed to users.</small>
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
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Must match a monitored Binance-Peg USDT smart contract recipient.</small>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.75rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#FFF' }}>Top Demo Banner Notice</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show prototype disclosure header across all pages.</div>
              </div>
              <input
                type="checkbox"
                checked={showDemoBanner}
                onChange={(e) => setShowDemoBanner(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#D4AF37', cursor: 'pointer' }}
              />
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
              Save Platform Configuration
            </button>
          </form>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.5rem' }}>
              Adjust USDT Balance for {editingUser.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Update liquid USDT reserves for client account.
            </p>

            <form onSubmit={handleSaveUserBalance}>
              <div className="form-group">
                <label className="form-label">New Balance (USDT)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editBalanceAmount}
                  onChange={(e) => setEditBalanceAmount(e.target.value)}
                  step="0.01"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
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
                  Save Balance
                </button>
              </div>
            </form>
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
