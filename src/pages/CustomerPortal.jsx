import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  USDT_NETWORKS,
  SALARY_LEVELS,
  TRANSACTION_STATUSES,
  FAQS
} from '../data/platformData';
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
  Bot
} from '../components/Icons';

export default function CustomerPortal() {
  const { activePage, setActivePage } = useApp();

  return (
    <div className="container fade-in" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
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
  const { user, transactions, userPlans, setActivePage } = useApp();

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
              Welcome back, <span className="gold-text">{user.fullName}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Account UID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{user.id}</span> • Jurisdiction: {user.country}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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

      {/* Balance Metric Cards (Simulated) */}
      <div className="grid-4">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Available Balance</span>
            <span className="badge badge-demo" style={{ fontSize: '0.65rem' }}>Simulated</span>
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
            <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>Active Demo Plans</h3>
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
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gold-champagne)' }}>{tx.id}</td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: tx.type === 'Deposit' ? '#10B981' : tx.type === 'Withdrawal' ? '#EF4444' : 'var(--gold-bright)'
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
                  <td><span className="badge badge-neutral">{tx.network}</span></td>
                  <td>
                    <span className={`badge ${
                      tx.status === 'Completed' ? 'badge-success' :
                      tx.status === 'Processing' || tx.status === 'Under Review' || tx.status === 'Submitted' ? 'badge-pending' : 'badge-danger'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.date}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
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
   USDT DEPOSIT WORKFLOW (Prompt Section 5)
   ========================================================================== */
function DepositWorkflowView() {
  const { networks, processSimulatedDeposit, showToast } = useApp();

  const [selectedNetwork, setSelectedNetwork] = useState('TRC20'); // 'TRC20' | 'BEP20'
  const [depositAmount, setDepositAmount] = useState('500');
  const [txHashInput, setTxHashInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Stepper state: 1: Choose USDT, 2: Show Verified Address, 3: Submit Hash, 4: Verify On-Chain, 5: Confirmed
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [blockConfirmations, setBlockConfirmations] = useState(0);
  const [verifyingStatusText, setVerifyingStatusText] = useState('');
  const [lastTxResult, setLastTxResult] = useState(null);

  const activeNet = networks[selectedNetwork];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeNet.depositAddress);
    setCopied(true);
    showToast('Verified deposit address copied to clipboard.', 'gold');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleStartVerification = (e) => {
    e.preventDefault();
    if (!txHashInput || txHashInput.length < 16) {
      showToast('Please provide a valid transaction hash (minimum 16 hexadecimal chars).', 'danger');
      return;
    }

    setCurrentStep(4);
    setVerificationProgress(10);
    setBlockConfirmations(0);
    setVerifyingStatusText('Contacting blockchain consensus nodes...');

    // Simulate On-Chain Progression
    const targetConfirms = activeNet.requiredConfirmations;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const currentConf = Math.min(Math.round((stepCount / 6) * targetConfirms), targetConfirms);
      const progress = Math.min(Math.round((stepCount / 6) * 100), 100);

      setBlockConfirmations(currentConf);
      setVerificationProgress(progress);

      if (stepCount === 1) setVerifyingStatusText(`Broadcasting to ${activeNet.chain}...`);
      if (stepCount === 2) setVerifyingStatusText(`Verifying recipient contract: ${activeNet.contractAddress.substring(0, 10)}...`);
      if (stepCount === 4) setVerifyingStatusText(`Accumulating block confirmations: ${currentConf}/${targetConfirms}...`);

      if (stepCount >= 6) {
        clearInterval(interval);

        // Process in global state with duplicate detection
        const res = processSimulatedDeposit({
          network: selectedNetwork,
          amount: depositAmount,
          txHash: txHashInput
        });

        if (res.success) {
          setLastTxResult(res.tx);
          setCurrentStep(5);
          showToast(`Successfully verified on-chain! Credited +$${depositAmount} USDT.`, 'success');
        } else {
          setCurrentStep(3);
          showToast('Verification rejected: Duplicate transaction hash detected. Re-submission blocked.', 'danger');
        }
      }
    }, 700);
  };

  const generateSampleHash = () => {
    const chars = '0123456789abcdef';
    let hash = selectedNetwork === 'BEP20' ? '0x' : '';
    for (let i = 0; i < (selectedNetwork === 'BEP20' ? 64 : 64); i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setTxHashInput(hash);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Cryptographic Gateway</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          USDT-Only <span className="gold-text">Deposit Workflow</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Strict 5-step on-chain clearing protocol with automated block verification and duplicate protection.
        </p>
      </div>

      {/* Stepper Progress Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.5rem',
        marginBottom: '2rem'
      }}>
        {['1. Choose USDT', '2. Show Address', '3. Submit TxID', '4. Verify On-Chain', '5. Credited'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;

          return (
            <div key={label} style={{
              textAlign: 'center',
              padding: '0.65rem 0.25rem',
              background: isActive ? 'rgba(212, 175, 55, 0.15)' : isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid',
              borderColor: isActive ? 'var(--gold-primary)' : isDone ? '#10B981' : 'var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: isActive ? 'var(--gold-bright)' : isDone ? '#10B981' : 'var(--text-muted)'
            }}>
              {label}
            </div>
          );
        })}
      </div>

      {/* STEP 1: Choose USDT Network */}
      {currentStep <= 2 && (
        <div className="glass-card gold-rim" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#FFF' }}>
            Step 1: Select Verified USDT Network
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            {/* TRC20 Card */}
            <div
              onClick={() => setSelectedNetwork('TRC20')}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: selectedNetwork === 'TRC20' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: '1.5px solid',
                borderColor: selectedNetwork === 'TRC20' ? 'var(--gold-primary)' : 'var(--border-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>TRC20</span>
                <span className="badge badge-success">Fast / Low Gas</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TRON Network Mainnet</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-champagne)', marginTop: '0.4rem' }}>Required: 12 Block Confirmations</div>
            </div>

            {/* BEP20 Card */}
            <div
              onClick={() => setSelectedNetwork('BEP20')}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: selectedNetwork === 'BEP20' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: '1.5px solid',
                borderColor: selectedNetwork === 'BEP20' ? 'var(--gold-primary)' : 'var(--border-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>BEP20</span>
                <span className="badge badge-pending">Binance-Peg</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BNB Smart Chain (BSC)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-champagne)', marginTop: '0.4rem' }}>Required: 15 Block Confirmations</div>
            </div>
          </div>

          {/* STEP 2: Show Verified Administrator Address */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--gold-bright)', marginBottom: '0.75rem' }}>
              Step 2: Administrator-Configured Deposit Vault
            </h4>

            {/* Safety Warning as mandated by prompt */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'center',
              fontSize: '0.825rem',
              color: '#FDE68A'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>
                <strong>CRITICAL SAFETY WARNING:</strong> Send only <strong>{activeNet.tokenStandard}</strong> to this specific address. Sending any other asset or utilizing the wrong chain causes permanent loss.
              </span>
            </div>

            {/* Address Pill & QR mockup */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* QR Mockup */}
              <div style={{
                width: '110px',
                height: '110px',
                background: '#FFF',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="94" height="94" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#FFF"/>
                  <rect x="10" y="10" width="30" height="30" fill="#000"/>
                  <rect x="15" y="15" width="20" height="20" fill="#FFF"/>
                  <rect x="20" y="20" width="10" height="10" fill="#000"/>
                  <rect x="60" y="10" width="30" height="30" fill="#000"/>
                  <rect x="65" y="15" width="20" height="20" fill="#FFF"/>
                  <rect x="70" y="20" width="10" height="10" fill="#000"/>
                  <rect x="10" y="60" width="30" height="30" fill="#000"/>
                  <rect x="15" y="65" width="20" height="20" fill="#FFF"/>
                  <rect x="20" y="70" width="10" height="10" fill="#000"/>
                  <rect x="50" y="50" width="15" height="15" fill="#D4AF37"/>
                  <rect x="70" y="65" width="15" height="20" fill="#000"/>
                  <rect x="50" y="75" width="12" height="15" fill="#000"/>
                </svg>
              </div>

              {/* Address details */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  OFFICIAL {selectedNetwork} INGESTION VAULT ADDRESS
                </div>
                <div className="hash-pill" style={{ marginBottom: '0.75rem' }}>
                  <span>{activeNet.depositAddress}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleCopyAddress} className="btn btn-secondary btn-sm">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy Vault Address'}</span>
                  </button>
                  <button onClick={() => setCurrentStep(3)} className="btn btn-gold btn-sm">
                    <span>I Have Sent USDT → Next Step</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Submit Transaction Hash */}
      {currentStep === 3 && (
        <form onSubmit={handleStartVerification} className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>
              Step 3: Submit Transaction Hash (TxID)
            </h3>
            <span className="badge badge-gold">{selectedNetwork} Network</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Enter the exact USDT amount transferred and the on-chain transaction hash. Screenshots and payment slips are strictly rejected.
          </p>

          <div className="form-group">
            <label className="form-label">Deposit Amount (USDT)</label>
            <input
              type="number"
              className="form-input"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="10"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Transaction Hash / Reference (TxID)</label>
              <button
                type="button"
                onClick={generateSampleHash}
                style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Generate Demo TxID
              </button>
            </div>
            <input
              type="text"
              className="form-input font-mono"
              placeholder={selectedNetwork === 'BEP20' ? '0x8f2a...' : '4f7a9d...'}
              value={txHashInput}
              onChange={(e) => setTxHashInput(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn btn-secondary"
            >
              Back to Address
            </button>
            <button
              type="submit"
              className="btn btn-gold"
              style={{ flex: 1 }}
            >
              Verify On-Chain Consensus
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Simulated On-Chain Consensus Verification */}
      {currentStep === 4 && (
        <div className="glass-card gold-rim" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div className="pulse-dot-gold" style={{ width: '14px', height: '14px', margin: '0 auto 1.25rem auto' }} />

          <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Step 4: Blockchain Verification in Progress
          </h3>
          <p style={{ color: 'var(--gold-champagne)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            {verifyingStatusText}
          </p>

          {/* Progress Indicator */}
          <div style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Confirmations: <strong>{blockConfirmations} / {activeNet.requiredConfirmations}</strong></span>
              <span>{verificationProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${verificationProgress}%`, height: '100%', background: 'var(--gold-gradient)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Tx: {txHashInput.substring(0, 24)}...
          </div>
        </div>
      )}

      {/* STEP 5: Success Receipt */}
      {currentStep === 5 && lastTxResult && (
        <div className="glass-card gold-rim" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <CheckCircle2 size={36} color="#10B981" />
          </div>

          <div className="badge badge-success" style={{ marginBottom: '0.75rem' }}>On-Chain Verified</div>
          <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Deposit Confirmed & Credited
          </h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold-bright)', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
            +${lastTxResult.amount.toFixed(2)} <small style={{ fontSize: '1rem', color: '#FFF' }}>USDT</small>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            maxWidth: '520px',
            margin: '0 auto 2rem auto',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transaction ID:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{lastTxResult.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Network:</span>
              <span>{lastTxResult.network}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>{lastTxResult.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Confirmations:</span>
              <span>{lastTxResult.confirmations}</span>
            </div>
            <div style={{ wordBreak: 'break-all', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hash: {lastTxResult.txHash}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setCurrentStep(1);
                setTxHashInput('');
              }}
              className="btn btn-secondary"
            >
              Deposit Another Amount
            </button>
            <button
              onClick={() => setActivePage('dashboard')}
              className="btn btn-gold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
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
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{w.id}</td>
                    <td style={{ fontWeight: 700, color: '#FFF' }}>${w.amount.toFixed(2)} USDT</td>
                    <td><span className="badge badge-neutral">{w.network}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {w.destinationAddress ? `${w.destinationAddress.substring(0, 10)}...` : 'N/A'}
                    </td>
                    <td>
                      <span className={`badge ${
                        w.status === 'Completed' ? 'badge-success' :
                        w.status === 'Submitted' || w.status === 'Under Review' || w.status === 'Processing' ? 'badge-pending' : 'badge-danger'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.date}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.note}</td>
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
            My Active <span className="gold-text">Demo Plans</span>
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
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{r.id}</td>
                  <td style={{ fontWeight: 600, color: '#FFF' }}>{r.name}</td>
                  <td>{r.country}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.joinedDate}</td>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>${r.depositTotal.toLocaleString()} USDT</td>
                  <td style={{ fontWeight: 700, color: '#10B981' }}>+${r.bonusEarned.toLocaleString()} USDT</td>
                  <td><span className="badge badge-success">{r.status}</span></td>
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
      let reply = 'Thank you for your inquiry. In demonstration mode, all balances and on-chain records are simulated. For live queries, our Dubai DIFC compliance team is on standby.';
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
