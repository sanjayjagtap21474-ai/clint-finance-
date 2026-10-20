import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DemoBanner from './components/DemoBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import PublicPages from './pages/PublicPages';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';
import LegalPages from './pages/LegalPages';

function MainRouter() {
  const { activePage, portalMode } = useApp();

  // Admin routing
  if (portalMode === 'admin' || activePage.startsWith('admin-')) {
    return <AdminPortal />;
  }

  // Customer portal routing
  if (
    portalMode === 'customer' ||
    ['dashboard', 'deposits', 'withdrawals', 'investments', 'customer-referrals', 'customer-salary', 'support', 'faqs'].includes(activePage)
  ) {
    return <CustomerPortal />;
  }

  // Legal & policy routing
  if (['terms', 'privacy', 'risk'].includes(activePage)) {
    return <LegalPages />;
  }

  // Default: Public website pages (home, about, services, how-it-works, plans, referrals, salary)
  return <PublicPages />;
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DemoBanner />
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
