import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import PublicPages from './pages/PublicPages';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';
import LegalPages from './pages/LegalPages';
import AuthPages, { isAuthPage } from './pages/AuthPages';

const CUSTOMER_PAGES = [
  'dashboard',
  'deposits',
  'withdrawals',
  'investments',
  'customer-referrals',
  'customer-salary',
  'support',
  'faqs'
];

function MainRouter() {
  const {
    activePage,
    portalMode,
    isLoggedIn,
    authLoading,
    user,
    setActivePage,
    setPortalMode
  } = useApp();

  const isAdminRoute = portalMode === 'admin' || activePage.startsWith('admin-');
  const isCustomerRoute = portalMode === 'customer' || CUSTOMER_PAGES.includes(activePage);

  useEffect(() => {
    if (authLoading) return;

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

  if (authLoading) {
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

  if (isAuthPage(activePage)) {
    return <AuthPages />;
  }

  if (isAdminRoute) {
    if (!isLoggedIn || user?.role !== 'admin') {
      return isLoggedIn ? <CustomerPortal /> : <AuthPages />;
    }
    return <AdminPortal />;
  }

  if (isCustomerRoute) {
    if (!isLoggedIn) {
      return <AuthPages />;
    }
    return <CustomerPortal />;
  }

  if (['terms', 'privacy', 'risk'].includes(activePage)) {
    return <LegalPages />;
  }

  return <PublicPages />;
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
