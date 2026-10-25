import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { siteBranding, setActivePage, setPortalMode } = useApp();
  const logoSrc = siteBranding?.logoUrl || '/logo.png';
  const brandName = siteBranding?.websiteName || 'SIGHT FINANCE';
  const copyrightText = siteBranding?.copyrightText || `© 2026 ${brandName}. All Rights Reserved.`;

  return (
    <footer style={{
      background: 'transparent',
      padding: '2.5rem 1rem 3rem 1rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <img
          src={logoSrc}
          alt={brandName}
          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
          style={{
            height: '42px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
        <p style={{
          color: '#8896ab',
          fontSize: '0.85rem',
          margin: 0,
          fontWeight: 400
        }}>
          {copyrightText}
        </p>

        {/* Quick Admin Access Link */}
        <div style={{ marginTop: '0.25rem' }}>
          <button
            onClick={() => {
              setPortalMode('super-admin');
              setActivePage('super-admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--gold-bright)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            title="Sovereign Admin & Super Admin Control Panel"
          >
            Admin Control Panel
          </button>
        </div>
      </div>
    </footer>
  );
}
