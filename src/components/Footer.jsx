import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Globe, AlertTriangle, ArrowUpRight } from './Icons';

export default function Footer() {
  const { setActivePage, setPortalMode, switchRole, isLoggedIn, user, goToAuthPage } = useApp();

  const navigateTo = (page, mode = 'public') => {
    setActivePage(page);
    setPortalMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#040507',
      borderTop: '1px solid rgba(212, 175, 55, 0.18)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      marginTop: '5rem',
      position: 'relative'
    }}>
      {/* Subtle top gold glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Column */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #181924 0%, #0A0B0E 100%)',
                border: '1px solid #D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>S</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#FFF'
              }}>
                SIGHT <span className="gold-text">FINANCE</span>
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Institutional digital wealth architecture concept designed around precision USDT clearing, structured multi-tier plans, dynamic affiliate networks, and AI risk governance.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--gold-champagne)' }}>
              <Globe size={14} color="#D4AF37" />
              <span>Conceived for Dubai, UAE Financial Ecosystem</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Platform Concept
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('home', 'public')} className="footer-link">Platform Overview</button>
              </li>
              <li>
                <button onClick={() => navigateTo('about', 'public')} className="footer-link">About Dubai Base & Vision</button>
              </li>
              <li>
                <button onClick={() => navigateTo('services', 'public')} className="footer-link">Institutional Services</button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works', 'public')} className="footer-link">USDT Workflow (TRC20/BEP20)</button>
              </li>
              <li>
                <button onClick={() => navigateTo('plans', 'public')} className="footer-link">Investment Plans (Plan A & B)</button>
              </li>
            </ul>
          </div>

          {/* Affiliates & Tools */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Rewards & Accounts
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('referrals', 'public')} className="footer-link">10% Referral Programme</button>
              </li>
              <li>
                <button onClick={() => navigateTo('salary', 'public')} className="footer-link">Monthly Salary & Tour Rewards</button>
              </li>
              <li>
                <button
                  onClick={() => isLoggedIn ? navigateTo('dashboard', 'customer') : goToAuthPage('login')}
                  className="footer-link"
                >
                  Customer Wealth Portal
                </button>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <button onClick={() => switchRole('admin')} className="footer-link">AI Admin Sentinel Console</button>
                </li>
              )}
              <li>
                <button onClick={() => navigateTo('faqs', 'customer')} className="footer-link">Platform FAQ & Helpdesk</button>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Policies & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('terms', 'public')} className="footer-link">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy', 'public')} className="footer-link">Privacy & Data Governance</button>
              </li>
              <li>
                <button onClick={() => navigateTo('risk', 'public')} className="footer-link">Digital Asset Risk Disclosure</button>
              </li>
              <li>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#10B981',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '0.5rem'
                }}>
                  <Shield size={13} />
                  <span>DIFC Compliant Framework Model</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory UAE Institutional Disclaimer Box */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.04)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-bright)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Shield size={15} />
            <span>REGULATORY & INSTITUTIONAL COMPLIANCE STATEMENT</span>
          </div>
          <p>
            <strong>Operating Base & Jurisdiction:</strong> SIGHT FINANCE operates out of Dubai, United Arab Emirates. All digital asset transfers, USDT clearing pipelines, and structured growth plans comply with applicable regulatory standards under UAE frameworks (including DFSA / VARA guidelines).
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Risk Disclosure:</strong> Digital assets and cryptocurrency investments carry market risks. Past performance does not guarantee future results. Clients must review risk disclosures prior to allocating capital across active networks.
          </p>
        </div>

        {/* Bottom Credits */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 SIGHT FINANCE. Designed with Black, Gold & White luxury aesthetics. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>TRC-20 & BEP-20 Dual-Chain Clearing</span>
            <span>SightAI Anomaly Engine v4.2</span>
            <span>AES-256 Vault Simulation</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--gold-bright);
        }
      `}</style>
    </footer>
  );
}
