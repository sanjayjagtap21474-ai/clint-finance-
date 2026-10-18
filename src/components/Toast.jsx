import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from './Icons';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isDanger = toast.type === 'danger';
  const isSuccess = toast.type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: isDanger ? '#1E1214' : '#14151C',
      border: isDanger ? '1px solid #EF4444' : '1px solid var(--gold-border)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#FFFFFF',
      fontSize: '0.875rem',
      maxWidth: '420px',
      animation: 'fadeIn 0.3s ease'
    }}>
      {isDanger ? (
        <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
      ) : (
        <CheckCircle2 size={20} color="#D4AF37" style={{ flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</div>
    </div>
  );
}
