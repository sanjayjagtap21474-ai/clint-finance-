import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  submitDepositRequest,
  subscribeToUserDepositRequests
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
  RupeeIcon
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
   2. RECHARGE VIEW (Screenshot 4.15.54 PM.jpeg)
   ========================================================================== */
function RechargeView() {
  const { user, userDepositRequests, showToast } = useApp();
  const [showQrModal, setShowQrModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [submitting, setSubmitting] = useState(false);

  const depositAddress = "TQn9Y2khEsLJW1ChVWFMSMeSTow5KAnsP5";

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
        depositAddress
      });
      showToast('Deposit request submitted for confirmation', 'success');
      setAmount('');
      setTxHash('');
      setShowQrModal(false);
    } catch (err) {
      showToast('Error submitting request: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
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

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Recharge</h2>
      <Breadcrumb parent="Package" page="Recharge" />

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowQrModal(true)}
          className="btn-blue"
          style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
        >
          View QR
        </button>
      </div>

      {/* Payment History Card */}
      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">
            <span style={{ fontSize: '1.1rem' }}>📊</span>
            <span>Payment History</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={userDepositRequests || []}
          emptyMessage="No data available in table"
        />
      </div>

      {/* QR & Recharge Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>USDT / INR Deposit QR</h3>
              <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                background: '#ffffff',
                padding: '1rem',
                borderRadius: '8px',
                display: 'inline-block',
                margin: '0 auto 1rem auto'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddress}`}
                  alt="Deposit QR"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Deposit Address (TRC20 / BEP20)
              </div>
              <div style={{
                background: '#0a1220',
                border: '1px solid #1d2c48',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                wordBreak: 'break-all'
              }}>
                <span>{depositAddress}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(depositAddress);
                    showToast('Address copied to clipboard', 'success');
                  }}
                  className="table-action-btn"
                  style={{ padding: '0.25rem 0.6rem' }}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            <form onSubmit={handleDepositSubmit}>
              <div className="form-group">
                <label className="form-label">Deposit Amount (₹ / USDT)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="Enter amount"
                  className="form-control-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transaction Hash / UTR (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter TX hash or reference code"
                  className="form-control-input"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" disabled={submitting} className="btn-blue" style={{ flex: 1 }}>
                  {submitting ? 'Submitting...' : 'Submit Deposit'}
                </button>
                <button type="button" onClick={() => setShowQrModal(false)} className="btn-reset" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
   6. PACKAGE ACTIVATION VIEWS (Basic Package & FD Package)
   ========================================================================== */
function BasicPackageView() {
  const { user, showToast } = useApp();
  const [selectedTier, setSelectedTier] = useState('100');
  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);

  const handleActivate = (e) => {
    e.preventDefault();
    showToast(`Basic Package (₹ ${selectedTier}) activation request submitted`, 'success');
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'package', label: 'PACKAGE' },
    { key: 'amount', label: 'AMOUNT' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Basic Package</h2>
      <Breadcrumb parent="Package Activation" page="Basic Package" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Basic Package Activation</div>
        </div>

        <form onSubmit={handleActivate}>
          <div className="form-group">
            <label className="form-label">Available Fund</label>
            <div className="input-addon-group">
              <div className="addon-prefix-box">₹</div>
              <input type="text" disabled value={availableFund} className="form-control-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Package</label>
            <select
              className="form-control-input"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="100">Package 1 — ₹ 100 (Daily Yield: ₹ 5.00)</option>
              <option value="250">Package 2 — ₹ 250 (Daily Yield: ₹ 12.50)</option>
              <option value="500">Package 3 — ₹ 500 (Daily Yield: ₹ 25.00)</option>
              <option value="1000">Package 4 — ₹ 1,000 (Daily Yield: ₹ 50.00)</option>
              <option value="2500">Package 5 — ₹ 2,500 (Daily Yield: ₹ 125.00)</option>
            </select>
          </div>

          <button type="submit" className="btn-blue" style={{ marginTop: '0.5rem' }}>
            Activate Package
          </button>
        </form>
      </div>

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">Activation History</div>
        </div>
        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>
    </div>
  );
}

function FDPackageView() {
  const { user, showToast } = useApp();
  const [amount, setAmount] = useState('500');
  const availableFund = (user.balances?.availableFund ?? 0).toFixed(2);

  const handleActivate = (e) => {
    e.preventDefault();
    showToast(`FD Package (₹ ${amount}) lock submitted`, 'success');
  };

  const columns = [
    { key: 'sr', label: 'SR', render: (_, __, idx) => idx + 1 },
    { key: 'date', label: 'DATE' },
    { key: 'tenure', label: 'TENURE' },
    { key: 'amount', label: 'AMOUNT' },
    { key: 'status', label: 'STATUS' }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>FD Package</h2>
      <Breadcrumb parent="Package Activation" page="FD package" />

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">FD Package Activation</div>
        </div>

        <form onSubmit={handleActivate}>
          <div className="form-group">
            <label className="form-label">Available Fund</label>
            <div className="input-addon-group">
              <div className="addon-prefix-box">₹</div>
              <input type="text" disabled value={availableFund} className="form-control-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">FD Lock Amount</label>
            <input
              type="number"
              className="form-control-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <button type="submit" className="btn-blue" style={{ marginTop: '0.5rem' }}>
            Lock FD Package
          </button>
        </form>
      </div>

      <div className="exact-card">
        <div className="exact-card-header">
          <div className="exact-card-title">FD History</div>
        </div>
        <DataTable columns={columns} data={[]} emptyMessage="No data available in table" />
      </div>
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
      {(activePage === 'recharge' || activePage === 'deposits') && <RechargeView />}
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
