import React from 'react';
import { useApp } from '../context/AppContext';
import { BRAND } from '../data/platformData';
import { Shield, Mail, Globe, ExternalLink } from './Icons';

export default function Footer() {
  const { siteBranding, setActivePage, setPortalMode, switchRole } = useApp();

  const logoSrc = siteBranding?.logoUrl || '/logo.png';
  const brandName = siteBranding?.websiteName || BRAND.name || 'SIGHT FINANCE';
  const tagline = siteBranding?.tagline || BRAND.tagline || 'Institutional Digital Wealth & USDT Clearing Gateway';
  const contactEmail = siteBranding?.contactEmail || siteBranding?.supportEmail || BRAND.contactEmail || 'support@sightfinance.ae';
  const physicalAddress = siteBranding?.physicalAddress || BRAND.address || 'DIFC Gate Precinct, Building 4, Level 7, Dubai, UAE';
  const copyrightText = siteBranding?.copyrightText || `© 2026 ${brandName}. All Rights Reserved.`;

  const navigateTo = (page, mode = 'public') => {
    setActivePage(page);
    setPortalMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#040507',
      borderTop: '1px solid rgba(212, 175, 55, 0.18)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
      position: 'relative'
    }}>
      {/* Top Gold Accent Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold-bright, #D4AF37), transparent)'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand & Overview */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src={logoSrc}
                alt={brandName}
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#FFF'
              }}>
                {brandName}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #9CA3AF)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {tagline}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--gold-champagne, #FCD34D)' }}>
              <Shield size={14} color="#D4AF37" />
              <span>Institutional Digital Asset Architecture</span>
            </div>
          </div>

          {/* Column 2: Official Contact & Address */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Contact & Headquarters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Mail size={16} color="#D4AF37" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B7280)', textTransform: 'uppercase' }}>Official Contact Email</div>
                  <a
                    href={`mailto:${contactEmail}`}
                    style={{ color: 'var(--gold-bright, #D4AF37)', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Globe size={16} color="#D4AF37" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #6B7280)', textTransform: 'uppercase' }}>Operating Headquarters</div>
                  <span style={{ color: 'var(--text-secondary, #D1D5DB)', lineHeight: 1.4, display: 'block' }}>
                    {physicalAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => navigateTo('home', 'public')} className="footer-link">Platform Overview</button>
              </li>
              <li>
                <button onClick={() => navigateTo('about', 'public')} className="footer-link">About Corporate Base</button>
              </li>
              <li>
                <button onClick={() => navigateTo('services', 'public')} className="footer-link">Institutional Services</button>
              </li>
              <li>
                <button onClick={() => navigateTo('plans', 'public')} className="footer-link">Investment Growth Plans</button>
              </li>
              <li>
                <button onClick={() => navigateTo('referrals', 'public')} className="footer-link">10% Referral Programme</button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard', 'customer')} className="footer-link">Customer Wealth Portal</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Admin */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
              Legal & Governance
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => navigateTo('terms', 'public')} className="footer-link">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy', 'public')} className="footer-link">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => navigateTo('risk', 'public')} className="footer-link">Risk Disclosures</button>
              </li>
              <li>
                <button onClick={() => switchRole('admin')} className="footer-link" style={{ color: '#FCD34D', fontWeight: 600 }}>
                  Admin Sentinel Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal Link */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.8rem',
          color: 'var(--text-muted, #9CA3AF)'
        }}>
          <div>
            {copyrightText}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => {
                setPortalMode('admin');
                setActivePage('admin-overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-champagne, #FCD34D)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Control Panel Access
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          background: none;
          border: none;
          color: #9CA3AF;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #D4AF37;
        }
      `}</style>
    </footer>
  );
}
