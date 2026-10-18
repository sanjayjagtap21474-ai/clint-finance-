import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X } from './Icons';

export default function DemoBanner() {
  const { showDemoBanner, setShowDemoBanner } = useApp();

  if (!showDemoBanner) return null;

  return (
    <div className="demo-banner-strip">
      <div className="demo-banner-content">
        <AlertTriangle size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
        <span>
          <strong>PROTOTYPE CONCEPT ONLY:</strong> Operating base: Dubai, UAE. This is a non-transacting demonstration.
          No live financial activity or guaranteed daily returns are offered. Balances and on-chain records are simulated.
        </span>
        <span className="badge badge-demo" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
          DEMO MODE
        </span>
      </div>
      <button
        onClick={() => setShowDemoBanner(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#9CA3AF',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Dismiss notice"
      >
        <X size={14} />
      </button>
    </div>
  );
}
