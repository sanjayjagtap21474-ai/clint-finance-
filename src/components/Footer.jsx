import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
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
          src="/logo.png"
          alt="SIGHT FINANCE"
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
          © 2026 <strong style={{ color: '#ffffff', fontWeight: 600 }}>SIGHT FINANCE</strong>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
