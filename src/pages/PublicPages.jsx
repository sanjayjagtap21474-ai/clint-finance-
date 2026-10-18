import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  INVESTMENT_PLANS,
  REFERRAL_PROGRAM,
  SALARY_LEVELS,
  USDT_NETWORKS,
  BRAND,
  FAQS
} from '../data/platformData';
import {
  Shield,
  Layers,
  Coins,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Lock,
  Cpu,
  Calculator,
  Compass,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Sparkles
} from '../components/Icons';

export default function PublicPages() {
  const { activePage, setActivePage, setPortalMode, activatePlan, showToast } = useApp();

  const navigateTo = (page, mode = 'public') => {
    setActivePage(page);
    setPortalMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePage === 'about') return <AboutPage navigateTo={navigateTo} />;
  if (activePage === 'services') return <ServicesPage navigateTo={navigateTo} />;
  if (activePage === 'how-it-works') return <HowItWorksPage navigateTo={navigateTo} />;
  if (activePage === 'plans') return <PlansPage navigateTo={navigateTo} activatePlan={activatePlan} />;
  if (activePage === 'referrals') return <ReferralsPage navigateTo={navigateTo} />;
  if (activePage === 'salary') return <SalaryPage navigateTo={navigateTo} />;

  // Default: HomePage
  return <HomePage navigateTo={navigateTo} />;
}

/* ==========================================================================
   1. HOME PAGE
   ========================================================================== */
function HomePage({ navigateTo }) {
  const [calcPlan, setCalcPlan] = useState('planA');
  const [calcTier, setCalcTier] = useState('basic');
  const [calcAmount, setCalcAmount] = useState(100);

  const selectedPlanFamily = INVESTMENT_PLANS[calcPlan];
  const rate = selectedPlanFamily.rate;
  const estimatedDaily = (calcAmount * rate).toFixed(2);
  const estimatedMonthly = (calcAmount * rate * 30).toFixed(2);
  const estimatedAnnual = (calcAmount * rate * 365).toFixed(2);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        paddingTop: '4.5rem',
        paddingBottom: '5.5rem',
        overflow: 'hidden'
      }}>
        {/* Ambient background glows */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.03) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            {/* Dubai Jurisdiction Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(212, 175, 55, 0.09)',
              border: '1px solid var(--gold-border)',
              borderRadius: '9999px',
              padding: '0.45rem 1.15rem',
              marginBottom: '1.75rem'
            }}>
              <span className="pulse-dot-gold" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-champagne)', letterSpacing: '0.04em' }}>
                INSTITUTIONAL CONCEPT • DUBAI, UAE ARCHITECTURE
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em'
            }}>
              Next-Generation <br />
              <span className="gold-text">USDT Digital Wealth</span> Architecture
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto'
            }}>
              Designed around mathematical clarity, automated TRC20/BEP20 clearing, structured multi-tier yield models, and autonomous AI risk administration.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              <button
                onClick={() => navigateTo('dashboard', 'customer')}
                className="btn btn-gold btn-lg"
                style={{ minWidth: '200px' }}
              >
                <span>Launch Demo Portal</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigateTo('plans', 'public')}
                className="btn btn-secondary btn-lg"
              >
                <span>Explore 5% & 6% Plans</span>
              </button>
            </div>

            {/* Ticker / Live Stats Banner */}
            <div className="glass-card" style={{
              padding: '1.25rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Simulated Volume
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  $18,450,200 <small style={{ color: 'var(--gold-bright)', fontSize: '0.8rem' }}>USDT</small>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  USDT Clearing
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-heading)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <span>TRC20 & BEP20</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Affiliate Direct Bonus
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--gold-bright)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  10.0% <small style={{ color: '#FFF', fontSize: '0.75rem' }}>Instant</small>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Operational Base
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  Dubai, UAE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Yield Calculator Section */}
      <section style={{ padding: '4.5rem 0', background: 'rgba(10, 11, 16, 0.6)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Interactive Simulator</div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Simulate Plan <span className="gold-text">Yield & Duration</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
                Test the proposed nominal 5% and 6% growth label equations against custom sample amounts. For illustrative demonstration purposes only.
              </p>
            </div>

            <div className="glass-card gold-rim" style={{ padding: '2.5rem' }}>
              <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
                {/* Inputs */}
                <div>
                  {/* Select Plan Family */}
                  <div className="form-group">
                    <label className="form-label">Select Proposed Plan Family</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        onClick={() => setCalcPlan('planA')}
                        style={{
                          background: calcPlan === 'planA' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                          color: calcPlan === 'planA' ? '#050507' : '#FFF',
                          border: '1px solid',
                          borderColor: calcPlan === 'planA' ? 'var(--gold-primary)' : 'var(--border-medium)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Plan A (5% Daily Label)
                      </button>

                      <button
                        onClick={() => setCalcPlan('planB')}
                        style={{
                          background: calcPlan === 'planB' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                          color: calcPlan === 'planB' ? '#050507' : '#FFF',
                          border: '1px solid',
                          borderColor: calcPlan === 'planB' ? 'var(--gold-primary)' : 'var(--border-medium)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Plan B (6% Daily Label)
                      </button>
                    </div>
                  </div>

                  {/* Entry Capital Slider */}
                  <div className="form-group" style={{ marginTop: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Simulated Entry Capital</label>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold-bright)', fontSize: '1.1rem' }}>
                        ${calcAmount.toLocaleString()} USDT
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="10000"
                      step="10"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: '#D4AF37',
                        cursor: 'pointer',
                        height: '6px'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      <span>Min: $10</span>
                      <span>Mid: $5,000</span>
                      <span>Max: $10,000</span>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    marginTop: '1.25rem'
                  }}>
                    <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    A 5% or 6% daily return represents an extraordinary theoretical model. In live deployment, payouts require independent liquidity hedging and UAE regulatory licensing.
                  </div>
                </div>

                {/* Calculation Outputs Card */}
                <div style={{
                  background: 'rgba(7, 8, 12, 0.95)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.7)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold-champagne)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Theoretical Model Output
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    +${estimatedDaily} <small style={{ color: 'var(--gold-bright)', fontSize: '1rem' }}>USDT / day</small>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Nominal rate: <strong>{(rate * 100).toFixed(0)}% per 24-hour cycle</strong>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.5rem 0' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>30-Day Simulated Run:</span>
                      <span style={{ fontWeight: 700, color: '#FFF' }}>+${estimatedMonthly} USDT</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>1-Year Compounded Potential:</span>
                      <span style={{ fontWeight: 700, color: 'var(--gold-bright)' }}>+${estimatedAnnual} USDT</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Direct Referral (10% Bonus):</span>
                      <span style={{ fontWeight: 700, color: '#10B981' }}>+${(calcAmount * 0.10).toFixed(2)} USDT</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('plans', 'public')}
                    className="btn btn-gold btn-sm"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                  >
                    View Official Matrix Tables
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Engineering Controls</div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
              Built for <span className="gold-text">Security by Design</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Rigorous transaction safeguards and auditable workflows built to comply with international digital asset expectations.
            </p>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Zap size={24} color="#F5C542" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Dual-Network USDT Gateway</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Full support for TRON (TRC20) ultra-fast low-fee transfers and BNB Smart Chain (BEP20) EVM settlement with automated block confirmation checks.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Shield size={24} color="#F5C542" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Duplicate TxID Shield</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every transaction hash is cryptographically fingerprinted to prevent duplicate credit attempts and reject unconfirmed or cross-chain transfers.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Cpu size={24} color="#F5C542" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>SightAI Risk Sentinel</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Autonomous analytical supervision flags irregular withdrawal velocities, tracks platform liquidity reserves, and generates compliance telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral & Salary Teaser */}
      <section style={{ padding: '4.5rem 0', background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.05) 50%, transparent 100%)' }}>
        <div className="container">
          <div className="glass-card gold-rim" style={{ padding: '3.5rem 2.5rem' }}>
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Affiliate & Executive Ladder</div>
                <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                  Earn <span className="gold-text">10% Direct Bonus</span> + Monthly Salaries & VIP Tours
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Our structured referral model rewards associates with instant 10% credit on direct qualifying investments, plus progressive monthly salaries ($25 to $100/mo) and luxury domestic and international travel retreats.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => navigateTo('referrals', 'public')} className="btn btn-gold">
                    View 10% Programme
                  </button>
                  <button onClick={() => navigateTo('salary', 'public')} className="btn btn-secondary">
                    Inspect Salary & Tour Tiers
                  </button>
                </div>
              </div>

              <div style={{
                background: 'rgba(10, 11, 16, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-bright)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Salary Milestones Preview
                </div>
                {SALARY_LEVELS.map(lvl => (
                  <div key={lvl.level} style={{
                    padding: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFF' }}>{lvl.level} Executive</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lvl.requiredDirectReferrals} Direct Referrals</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gold-bright)' }}>{lvl.monthlySalaryRange}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981' }}>{lvl.travelBenefits}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   2. ABOUT US PAGE
   ========================================================================== */
function AboutPage({ navigateTo }) {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Corporate Vision</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          About <span className="gold-text">SIGHT FINANCE</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Conceived as Dubai’s premier institutional digital asset management and USDT clearing demonstration platform.
        </p>
      </div>

      <div className="glass-card gold-rim" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Dubai, UAE Operating Base & Regulatory Alignment</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
          Sight Finance is designed from the ground up for eventual interface with the United Arab Emirates financial framework. Dubai has positioned itself as the preeminent international capital for progressive, regulated digital asset finance through bodies such as the Virtual Assets Regulatory Authority (VARA) and the Dubai International Financial Centre (DIFC) / DFSA.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <strong>Pre-Launch Operational Mandate:</strong> In accordance with regulatory standards, live financial activity is strictly prohibited until formal authorisations, anti-money laundering (AML) protocols, independent smart contract audits, and institutional custody segregation (BitGo / Fireblocks) have been formally executed.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--gold-bright)' }}>Mathematical Clarity</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Every rate label, referral tier, and daily distribution is formulated transparently. We clearly state that nominal daily figures require qualified financial hedging prior to live commitments.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--gold-bright)' }}>Custody & Cold Storage</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Architected for institutional segregation: 95% of asset backing held in multi-signature cold vaults with automated warm clearing buffers for verified client withdrawals.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--gold-bright)' }}>SightAI Governance</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            AI-driven anomaly detection continuously audits transaction hash velocity, detects duplicate deposit submissions, and produces automated risk health reports.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. SERVICES PAGE
   ========================================================================== */
function ServicesPage({ navigateTo }) {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Service Spectrum</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          Institutional <span className="gold-text">Wealth Services</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          High-performance digital tools developed for sophisticated capital allocators, affiliates, and digital asset managers.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Coins size={28} color="#D4AF37" />
            <h3 style={{ fontSize: '1.4rem' }}>1. USDT Dual-Chain Clearing Gateway</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Enterprise ingestion gateway connecting TRON (TRC20) and BNB Smart Chain (BEP20) liquidity rails. Automated blockchain verification confirms block headers before balances are credited.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li>✓ 12-block verification on TRON Mainnet</li>
            <li>✓ 15-block verification on BSC EVM</li>
            <li>✓ Strict duplicate TxID rejection</li>
          </ul>
        </div>

        <div className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <TrendingUp size={28} color="#D4AF37" />
            <h3 style={{ fontSize: '1.4rem' }}>2. Multi-Horizon Yield Allocation</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Curated plan families (Plan A & Plan B) offering segmented durations across Basic, Prime, and Bolt tiers. Real-time yield accrual with live simulated progression bars.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li>✓ 1-Year & 2-Year fixed allocation horizons</li>
            <li>✓ Automated daily simulated earnings crediting</li>
            <li>✓ Capital safety and return analytics</li>
          </ul>
        </div>

        <div className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Users size={28} color="#D4AF37" />
            <h3 style={{ fontSize: '1.4rem' }}>3. Affiliate & Salary Engine</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            A high-yield incentive framework featuring instant 10% direct referral bonuses, career ladder promotions (Basic, Silver, Gold), and luxury tour retreats.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li>✓ Instant 10% bonus on direct downline investments</li>
            <li>✓ Up to $100/mo guaranteed simulated base salary</li>
            <li>✓ Domestic & International tour reward vouchers</li>
          </ul>
        </div>

        <div className="glass-card gold-rim" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Cpu size={28} color="#D4AF37" />
            <h3 style={{ fontSize: '1.4rem' }}>4. SightAI Telemetry & Compliance</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Automated monitoring agent tracks platform solvency ratios, flags suspicious transaction volume, and generates executive risk briefs.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li>✓ Real-time anomaly and duplicate tx detection</li>
            <li>✓ Plan payout sustainability stress tests</li>
            <li>✓ Auditable immutable system action logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. HOW IT WORKS PAGE
   ========================================================================== */
function HowItWorksPage({ navigateTo }) {
  const steps = [
    {
      num: "01",
      title: "Establish Your Account",
      desc: "Complete registration with full name, email, and country of residence. Access your personalized, encrypted dashboard."
    },
    {
      num: "02",
      title: "Select USDT Clearing Network",
      desc: "Choose between TRON (TRC-20) or BNB Smart Chain (BEP-20). The system generates the network-specific verified deposit address and QR code."
    },
    {
      num: "03",
      title: "Transfer & Submit Transaction Hash",
      desc: "Dispatch your USDT from your private wallet and paste the transaction hash (TxID). Screenshots are strictly rejected."
    },
    {
      num: "04",
      title: "On-Chain Consensus Verification",
      desc: "The blockchain verification gateway monitors required block confirmations, verifies the token contract and recipient address, and detects duplicate hashes."
    },
    {
      num: "05",
      title: "Allocate to Growth Plans & Earn",
      desc: "Allocate your verified balance to Plan A (5% label) or Plan B (6% label), share your 10% referral link, and track monthly salary eligibility."
    }
  ];

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Step-by-Step Architecture</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          How <span className="gold-text">SIGHT FINANCE</span> Operates
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          A disciplined 5-step operational framework engineered for cryptographic certainty and client protection.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '880px', margin: '0 auto 4rem auto' }}>
        {steps.map((st, i) => (
          <div key={st.num} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--gold-gradient)',
              color: '#050507',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {st.num}
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#FFF' }}>{st.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Network Comparison Table */}
      <div className="glass-card gold-rim" style={{ padding: '2.5rem', maxWidth: '880px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--gold-bright)' }}>Supported USDT Networks Comparison</h3>
        <div className="table-wrapper">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Network</th>
                <th>Token Standard</th>
                <th>Avg. Block Time</th>
                <th>Required Confirmations</th>
                <th>Typical Gas Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TRON (TRC20)</strong></td>
                <td>TRC-20 USDT</td>
                <td>3 seconds</td>
                <td>12 blocks</td>
                <td>~1.5 - 2.5 USDT</td>
              </tr>
              <tr>
                <td><strong>BNB Chain (BEP20)</strong></td>
                <td>BEP-20 USDT</td>
                <td>3 seconds</td>
                <td>15 blocks</td>
                <td>~0.15 - 0.30 USDT (in BNB)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. INVESTMENT PLANS PAGE (Tables 7A - 7F)
   ========================================================================== */
function PlansPage({ navigateTo, activatePlan }) {
  const [activePlanTab, setActivePlanTab] = useState('planA'); // 'planA' | 'planB'
  const [activeTierTab, setActiveTierTab] = useState('all'); // 'all' | 'basic' | 'prime' | 'bolt'

  const currentPlan = INVESTMENT_PLANS[activePlanTab];

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Proposed Catalog</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          Investment <span className="gold-text">Plan Structure</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Owner-provided specification tables (7A–7F) preserved accurately with transparent daily-growth labels. These represent demonstration models, not verified returns.
        </p>
      </div>

      {/* Plan Family Selector Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <button
          onClick={() => setActivePlanTab('planA')}
          style={{
            background: activePlanTab === 'planA' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
            color: activePlanTab === 'planA' ? '#050507' : '#FFF',
            border: '1px solid',
            borderColor: activePlanTab === 'planA' ? 'var(--gold-primary)' : 'var(--border-medium)',
            padding: '0.85rem 1.75rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Plan A — 5% Daily-Growth Label
        </button>

        <button
          onClick={() => setActivePlanTab('planB')}
          style={{
            background: activePlanTab === 'planB' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
            color: activePlanTab === 'planB' ? '#050507' : '#FFF',
            border: '1px solid',
            borderColor: activePlanTab === 'planB' ? 'var(--gold-primary)' : 'var(--border-medium)',
            padding: '0.85rem 1.75rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Plan B — 6% Daily-Growth Label
        </button>
      </div>

      {/* Plan Details & Disclaimers */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#FFF' }}>{currentPlan.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {currentPlan.description}
            </p>
          </div>
          <div className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
            {currentPlan.label}
          </div>
        </div>

        {/* Tier sub-filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button
            onClick={() => setActiveTierTab('all')}
            className={`btn btn-sm ${activeTierTab === 'all' ? 'btn-gold' : 'btn-secondary'}`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setActiveTierTab('basic')}
            className={`btn btn-sm ${activeTierTab === 'basic' ? 'btn-gold' : 'btn-secondary'}`}
          >
            Basic Tier
          </button>
          <button
            onClick={() => setActiveTierTab('prime')}
            className={`btn btn-sm ${activeTierTab === 'prime' ? 'btn-gold' : 'btn-secondary'}`}
          >
            Prime Tier
          </button>
          <button
            onClick={() => setActiveTierTab('bolt')}
            className={`btn btn-sm ${activeTierTab === 'bolt' ? 'btn-gold' : 'btn-secondary'}`}
          >
            Bolt Tier
          </button>
        </div>
      </div>

      {/* Render Tiers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {Object.entries(currentPlan.tiers).map(([tierKey, tier]) => {
          if (activeTierTab !== 'all' && activeTierTab !== tierKey) return null;

          return (
            <div key={tierKey} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#FFF' }}>
                    {tier.name} — <span className="gold-text">{tier.tierLabel}</span>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Contract Horizon: <strong>{tier.duration}</strong> • Yield: <strong>{currentPlan.label}</strong>
                  </div>
                </div>
                <span className="badge badge-neutral">
                  {tier.items.length} Structured Packages
                </span>
              </div>

              {/* Inconsistency Warning (Requested by prompt for Plan B Bolt) */}
              {tier.hasAdminInconsistencyWarning && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: '#FCA5A5',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}>
                  <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>ADMINISTRATOR COMPLIANCE NOTE:</strong>
                    <div style={{ marginTop: '2px' }}>{tier.inconsistencyNote}</div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="table-wrapper">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>No.</th>
                      <th>Entry Amount</th>
                      <th>Daily-Growth Label</th>
                      <th>Listed Amount</th>
                      <th>Duration</th>
                      <th style={{ textAlign: 'right' }}>Simulate Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tier.items.map(item => (
                      <tr key={item.no}>
                        <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{item.no}</td>
                        <td style={{ fontWeight: 700, color: '#FFF', fontSize: '1rem' }}>
                          ${item.entry.toLocaleString()} <small style={{ color: 'var(--gold-bright)' }}>USDT</small>
                        </td>
                        <td>
                          <span className="badge badge-gold">{currentPlan.ratePercent} daily</span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--gold-champagne)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                          ${item.listed.toLocaleString()} USDT
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.duration}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => activatePlan(currentPlan.name, tier.name, item)}
                            className="btn btn-outline-gold btn-sm"
                          >
                            Simulate Allocate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   6. REFERRAL PROGRAMME PAGE (10% Bonus)
   ========================================================================== */
function ReferralsPage({ navigateTo }) {
  const { user, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(user.referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard!', 'gold');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Affiliate Architecture</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          Referral Programme — <span className="gold-text">10% Direct Bonus</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Earn a 10% direct bonus on qualifying investments made by associates registered under your cryptographic referral link.
        </p>
      </div>

      {/* Illustrative Sandbox Box */}
      <div className="glass-card gold-rim" style={{ padding: '2.5rem', maxWidth: '880px', margin: '0 auto 3rem auto' }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
          <div>
            <div className="badge badge-neutral" style={{ marginBottom: '0.5rem' }}>Rule Specification</div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>How 10% Accrues</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Whenever an active associate enters a demo investment plan using your referral link, 10% of the entry amount is instantly calculated and credited as simulated bonus USDT.
            </p>
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--gold-champagne)', fontWeight: 600 }}>Illustrative Example:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Qualifying Investment:</span>
                <span style={{ fontWeight: 700, color: '#FFF' }}>$1,000 USDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Illustrative 10% Bonus:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>+$100 USDT</span>
              </div>
            </div>
          </div>

          {/* User Referral Link Generator */}
          <div style={{
            background: 'rgba(10, 11, 16, 0.9)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#FFF' }}>Your Personal Referral Link</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Share this unique cryptographic link to build your downline.
            </p>

            <div className="hash-pill" style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{user.referralLink}</span>
            </div>

            <button
              onClick={copyReferralLink}
              className="btn btn-gold"
              style={{ width: '100%' }}
            >
              {copied ? <Check size={16} /> : null}
              <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Referral Code: <strong>{user.referralCode}</strong></span>
              <span>Total Direct: <strong>{user.directReferralsCount} Active</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Abuse Controls */}
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '880px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--gold-bright)' }}>Affiliate Anti-Abuse Safety Controls</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span><strong>Anti-Self-Referral:</strong> Accounts detected with shared device fingerprints or IP clusters are blocked from bonus generation.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span><strong>Status Segmentation:</strong> Bonuses are tracked through strictly audited statuses: Pending, Eligible, Paid, or Cancelled.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span><strong>Immutable Audit Log:</strong> Every downline qualification event is registered in the administrator telemetry ledger.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. SALARY & REWARDS PAGE
   ========================================================================== */
function SalaryPage({ navigateTo }) {
  const { user } = useApp();

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Executive Hierarchy</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          Salary & <span className="gold-text">Rewards Programme</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Proposed monthly salary ladders and luxury domestic and international travel retreats for distinguished platform ambassadors.
        </p>
      </div>

      {/* Salary Levels Cards */}
      <div className="grid-3" style={{ gap: '2rem', marginBottom: '3.5rem' }}>
        {SALARY_LEVELS.map(lvl => {
          const isUserLevel = user.salaryLevel === lvl.level;

          return (
            <div
              key={lvl.level}
              className={`glass-card ${isUserLevel ? 'gold-rim' : ''}`}
              style={{
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {isUserLevel && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  <span className="badge badge-gold">Current Rank</span>
                </div>
              )}

              <div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: lvl.color,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  Tier {lvl.rank} • {lvl.badge}
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '0.5rem' }}>
                  {lvl.level}
                </h3>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--gold-bright)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1rem'
                }}>
                  {lvl.monthlySalaryRange}
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Required Direct Referrals:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                    {lvl.requiredDirectReferrals} Verified Members
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold-champagne)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Travel Benefits:
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 600 }}>
                    {lvl.travelBenefits}
                  </div>
                  {lvl.tourDetails && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {lvl.tourDetails}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Perks:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {lvl.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Check size={14} color="#D4AF37" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => navigateTo('dashboard', 'customer')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  View My Progress
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legal Review Disclaimer */}
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '0.4rem' }}>Programme Rules to Finalise</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              These are proposed demo terms. Do not promise or automatically pay salaries or travel benefits in demonstration mode. Formal launch requires qualification investment criteria, monthly maintenance thresholds, continuation/termination bylaws, and qualified UAE legal review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
