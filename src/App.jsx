import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import PublicPages from './pages/PublicPages';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';
import SuperAdminPortal from './pages/SuperAdminPortal';
import LegalPages from './pages/LegalPages';
import AuthPages, { isAuthPage } from './pages/AuthPages';
import { Shield, Lock, AlertTriangle, ArrowRight, User } from './components/Icons';

const CUSTOMER_PAGES = [
  'dashboard',
  'recharge',
  'basic-package',
  'fd-package',
  'direct-team',
  'team-list',
  'basic-roi-income',
  'basic-referral-income',
  'basic-level-income',
  'fd-roi-income',
  'fd-referral-income',
  'fd-level-income',
  'salary-income',
  'p2p-transfer',
  'swap',
  'daily-income-report',
  'monthly-income-report',
  'fund-wallet-summary',
  'income-wallet-summary',
  'support-ticket',
  'deposits',
  'withdrawals',
  'investments',
  'customer-referrals',
  'customer-salary',
  'support',
  'faqs'
];

function getPathInfo() {
  if (typeof window === 'undefined') return { isSuperAdminPath: false, isAdminPath: false };
  const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
  return {
    isSuperAdminPath: path === '/super-admin' || path.startsWith('/super-admin/'),
    isAdminPath: path === '/admin' || path.startsWith('/admin/')
  };
}

function UnauthorizedSuperAdmin({ user, onSwitchToLogin, onGoToDashboard }) {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '680px' }}>
      <div className="glass-card gold-rim" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: '#EF4444'
        }}>
          <Lock size={30} />
        </div>

        <div className="badge badge-danger" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          RESTRICTED GOVERNANCE ROUTE
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', marginBottom: '0.75rem' }}>
          Super Admin Access Restricted
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You have navigated to <code style={{ color: 'var(--gold-bright)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>/super-admin</code>. However, your currently signed-in account is not authorized to access the Super Admin Panel.
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Session Details</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Signed In As:</span>
            <strong style={{ color: '#FFF' }}>{user?.email || user?.fullName || 'Client User'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Current Role:</span>
            <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>{user?.role || 'customer'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Required Role:</span>
            <span className="badge badge-gold">admin OR superadmin</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid var(--gold-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          textAlign: 'left',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--gold-bright)', display: 'block', marginBottom: '0.25rem' }}>Secure Administrative Setup Required:</strong>
          Administrative access requires setting server-verified Firebase Custom Claims (<code style={{ color: '#FFF' }}>token.admin == true</code>) or setting the server-protected role in Firebase Console. Ordinary accounts cannot grant themselves admin access.
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-gold"
            style={{ gap: '0.5rem' }}
          >
            <User size={16} />
            <span>Sign In with Admin Account</span>
          </button>
          <button
            type="button"
            onClick={onGoToDashboard}
            className="btn btn-secondary"
            style={{ gap: '0.5rem' }}
          >
            <span>Return to Customer Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MainRouter() {
  const {
    activePage,
    portalMode,
    isLoggedIn,
    authLoading,
    user,
    setActivePage,
    setPortalMode,
    goToAuthPage
  } = useApp();

  const [pathChecked, setPathChecked] = useState(false);

  useEffect(() => {
    const { isSuperAdminPath, isAdminPath } = getPathInfo();
    if (isSuperAdminPath) {
      setActivePage('super-admin');
      setPortalMode('super-admin');
    } else if (isAdminPath) {
      setActivePage('admin-overview');
      setPortalMode('admin');
    }
    setPathChecked(true);
  }, []);

  const isSuperAdminRoute = portalMode === 'super-admin' || activePage === 'super-admin' || activePage.startsWith('super-admin');
  const isAdminRoute = portalMode === 'admin' || activePage.startsWith('admin-');
  const isCustomerRoute = (portalMode === 'customer' && !isAuthPage(activePage) && !isSuperAdminRoute) || CUSTOMER_PAGES.includes(activePage);

  useEffect(() => {
    if (authLoading) return;

    // Standard auth redirects for non-superadmin routes
    if (isAdminRoute && (!isLoggedIn || user?.role !== 'admin')) {
      setPortalMode('public');
      setActivePage(isLoggedIn ? 'dashboard' : 'login');
      if (isLoggedIn) setPortalMode('customer');
      return;
    }

    if (isCustomerRoute && !isLoggedIn && !isAuthPage(activePage)) {
      setPortalMode('public');
      setActivePage('login');
    }
  }, [authLoading, isAdminRoute, isCustomerRoute, isLoggedIn, user?.role, activePage, setActivePage, setPortalMode]);

  if (authLoading || !pathChecked) {
    return (
      <div style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        Checking authentication...
      </div>
    );
  }

  // 1. SUPER ADMIN ROUTE HANDLER (Strict Path Enforcement)
  if (isSuperAdminRoute) {
    if (!isLoggedIn) {
      return <AuthPages />;
    }

    // Check if the authenticated user has admin or superadmin privileges
    const isAuthorized = ['admin', 'superadmin', 'super-admin'].includes(user?.role);
    if (!isAuthorized) {
      return (
        <UnauthorizedSuperAdmin
          user={user}
          onSwitchToLogin={() => goToAuthPage('login')}
          onGoToDashboard={() => {
            setPortalMode('customer');
            setActivePage('dashboard');
          }}
        />
      );
    }

    return <SuperAdminPortal />;
  }

  // 2. AUTH PAGES HANDLER
  if (isAuthPage(activePage)) {
    return <AuthPages />;
  }

  // 3. ADMIN PORTAL ROUTE HANDLER
  if (isAdminRoute) {
    if (!isLoggedIn || user?.role !== 'admin') {
      return isLoggedIn ? <CustomerPortal /> : <AuthPages />;
    }
    return <AdminPortal />;
  }

  // 4. CUSTOMER PORTAL ROUTE HANDLER
  if (isCustomerRoute) {
    if (!isLoggedIn) {
      return <AuthPages />;
    }
    return <CustomerPortal />;
  }

  // 5. LEGAL PAGES
  if (['terms', 'privacy', 'risk'].includes(activePage)) {
    return <LegalPages />;
  }

  // 6. DEFAULT PUBLIC PAGES
  return <PublicPages />;
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <MainRouter />
        </main>
        <Footer />
        <Toast />
        <AuthModal />
      </div>
    </AppProvider>
  );
}
