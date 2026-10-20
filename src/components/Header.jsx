import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Layers,
  Coins,
  Users,
  Award,
  BookOpen,
  LayoutDashboard,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  ArrowRightLeft,
  ExternalLink,
  Lock,
  LogIn,
  LogOut
} from './Icons';

export default function Header() {
  const {
    activePage,
    setActivePage,
    portalMode,
    setPortalMode,
    currentRole,
    switchRole,
    user,
    isLoggedIn,
    logout,
    notifications,
    setNotifications,
    setAuthModalOpen,
    setAuthMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigateTo = (page, mode = 'public') => {
    setActivePage(page);
    setPortalMode(mode);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      background: 'rgba(7, 8, 12, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '1rem'
      }}>
        {/* Logo */}
        <div
          onClick={() => navigateTo('home', 'public')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #181924 0%, #0A0B0E 100%)',
            border: '1.5px solid #D4AF37',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <path d="M30 32C30 26 35 22 45 22H65C70 22 74 26 74 30C74 36 68 40 58 42L42 46C32 48 26 54 26 62C26 70 32 76 42 76H68C74 76 78 72 78 68" stroke="url(#goldGrad)" strokeWidth="9" strokeLinecap="round" />
              <circle cx="70" cy="30" r="5" fill="#FAD961" />
              <defs>
                <linearGradient id="goldGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FAD961" />
                  <stop offset="0.5" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#947116" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ color: '#FFFFFF' }}>SIGHT</span>
              <span className="gold-text">FINANCE</span>
            </div>
            <div style={{
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span>DUBAI, UAE</span>
              <span style={{ color: 'var(--gold-primary)' }}>•</span>
              <span style={{ color: '#10B981' }}>ORACLE ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.25rem',
        }} className="desktop-nav">
          <button
            onClick={() => navigateTo('home', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'home' && portalMode === 'public' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            Home
          </button>

          <button
            onClick={() => navigateTo('about', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'about' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            About Us
          </button>

          <button
            onClick={() => navigateTo('services', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'services' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            Services
          </button>

          <button
            onClick={() => navigateTo('how-it-works', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'how-it-works' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            How It Works
          </button>

          <button
            onClick={() => navigateTo('plans', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'plans' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            Investment Plans
          </button>

          <button
            onClick={() => navigateTo('referrals', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'referrals' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            Referral 10%
          </button>

          <button
            onClick={() => navigateTo('salary', 'public')}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'salary' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '0.5rem 0.25rem'
            }}
          >
            Salary & Rewards
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Role Toggle (Demo Feature) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px'
          }}>
            <button
              onClick={() => switchRole('customer')}
              style={{
                background: currentRole === 'customer' ? 'var(--gold-gradient)' : 'transparent',
                color: currentRole === 'customer' ? '#050507' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="View Customer Dashboard"
            >
              <User size={12} />
              <span>Customer</span>
            </button>
            <button
              onClick={() => switchRole('admin')}
              style={{
                background: currentRole === 'admin' ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'transparent',
                color: currentRole === 'admin' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="View Administrator Dashboard & AI Telemetry"
            >
              <Settings size={12} />
              <span>Admin AI</span>
            </button>
          </div>

          {/* User Balance Capsule (Simulated) */}
          {currentRole === 'customer' && (
            <div
              onClick={() => navigateTo('deposits', 'customer')}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--gold-border-subtle)',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.825rem'
              }}
              className="desktop-balance"
              title="Click to Deposit USDT"
            >
              <Coins size={14} color="#F5C542" />
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', display: 'block', lineHeight: 1 }}>Simulated</span>
                <span style={{ fontWeight: 700, color: '#FFF' }}>
                  ${user.balances.availableUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} <small style={{ color: '#F5C542' }}>USDT</small>
                </span>
              </div>
            </div>
          )}

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444'
                }} />
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {notificationsOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                padding: '1rem',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Platform Alerts</span>
                  <button
                    onClick={markAllNotificationsRead}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Mark read
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '0.6rem',
                      background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)',
                      borderLeft: n.read ? '2px solid transparent' : '2px solid var(--gold-primary)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFF' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.text}</div>
                      <div style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '4px' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authentication Actions */}
          {!isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="btn btn-gold btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Primary Portal Action */}
              {portalMode === 'public' ? (
                <button
                  onClick={() => navigateTo('dashboard', 'customer')}
                  className="btn btn-gold btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <LayoutDashboard size={15} />
                  <span>Launch Platform</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('home', 'public')}
                  className="btn btn-secondary btn-sm"
                >
                  Public Site
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem 0.65rem' }}
                title={`Sign out (${user.email || user.fullName})`}
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-card-solid)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <button onClick={() => navigateTo('home', 'public')} className="mobile-nav-item">Home</button>
          <button onClick={() => navigateTo('about', 'public')} className="mobile-nav-item">About Us (Dubai Base)</button>
          <button onClick={() => navigateTo('services', 'public')} className="mobile-nav-item">Institutional Services</button>
          <button onClick={() => navigateTo('how-it-works', 'public')} className="mobile-nav-item">How It Works (USDT)</button>
          <button onClick={() => navigateTo('plans', 'public')} className="mobile-nav-item">Investment Plans (5% & 6%)</button>
          <button onClick={() => navigateTo('referrals', 'public')} className="mobile-nav-item">Referral 10% Programme</button>
          <button onClick={() => navigateTo('salary', 'public')} className="mobile-nav-item">Salary & Tour Rewards</button>
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />
          {!isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="btn btn-secondary btn-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="btn btn-gold btn-sm"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.25rem 0' }}>
                Signed in as <strong style={{ color: '#FFF' }}>{user.fullName || user.email}</strong>
              </div>
              <button onClick={() => navigateTo('dashboard', 'customer')} className="btn btn-gold btn-sm">Enter Customer Portal</button>
              <button onClick={() => switchRole('admin')} className="btn btn-secondary btn-sm">Administrator Console</button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="btn btn-secondary btn-sm"
                style={{ color: '#EF4444' }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .desktop-balance { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .mobile-nav-item {
          background: none;
          border: none;
          color: var(--text-primary);
          text-align: left;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 0;
          cursor: pointer;
        }
        .mobile-nav-item:hover {
          color: var(--gold-bright);
        }
      `}</style>
    </header>
  );
}
