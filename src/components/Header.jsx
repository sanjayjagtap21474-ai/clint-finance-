import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Key,
  Wallet,
  LogOut,
  Shield,
  SpeedometerIcon,
  BriefcaseIcon,
  PackageIcon,
  HierarchyIcon,
  BanknoteIcon,
  TransferCycleIcon,
  ReportFileIcon,
  HeadsetIcon,
  LogoutBoxIcon,
  ThemeToggleIcon
} from './Icons';

export default function Header() {
  const {
    activePage,
    setActivePage,
    portalMode,
    setPortalMode,
    user,
    isLoggedIn,
    logout,
    goToAuthPage,
    updateProfileData,
    siteBranding
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Profile Action Modals
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [walletAddressModalOpen, setWalletAddressModalOpen] = useState(false);

  // Form states
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [walletInput, setWalletInput] = useState('0x71C...49b2');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalFeedback, setModalFeedback] = useState(null);

  const dropdownRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync open submenu with active page
  useEffect(() => {
    if (['basic-package', 'fd-package'].includes(activePage)) {
      setOpenSubmenu('package');
    } else if (['direct-team', 'team-list'].includes(activePage)) {
      setOpenSubmenu('downline');
    } else if ([
      'basic-roi-income', 'basic-referral-income', 'basic-level-income',
      'fd-roi-income', 'fd-referral-income', 'fd-level-income', 'salary-income'
    ].includes(activePage)) {
      setOpenSubmenu('income');
    } else if (['p2p-transfer', 'swap'].includes(activePage)) {
      setOpenSubmenu('transactional');
    } else if ([
      'daily-income-report', 'monthly-income-report', 'fund-wallet-summary', 'income-wallet-summary'
    ].includes(activePage)) {
      setOpenSubmenu('reports');
    } else if (['deposit', 'deposits'].includes(activePage)) {
      // No submenu for deposit
    }
  }, [activePage]);

  const toggleSubmenu = (name) => {
    setOpenSubmenu(prev => (prev === name ? null : name));
  };

  const navigateTo = (page, mode = 'customer') => {
    setActivePage(page);
    setPortalMode(mode);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProfileOpen = () => {
    setNameInput(user.fullName || '');
    setPhoneInput(user.phoneNumber || '');
    setModalFeedback(null);
    setProfileDropdownOpen(false);
    setEditProfileModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfileData({
      fullName: nameInput,
      phoneNumber: phoneInput
    });
    setModalFeedback('Profile updated successfully.');
    setTimeout(() => {
      setEditProfileModalOpen(false);
      setModalFeedback(null);
    }, 1200);
  };

  const handleChangePasswordOpen = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setModalFeedback(null);
    setProfileDropdownOpen(false);
    setChangePasswordModalOpen(true);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setModalFeedback('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalFeedback('Passwords do not match.');
      return;
    }
    setModalFeedback('Password changed successfully.');
    setTimeout(() => {
      setChangePasswordModalOpen(false);
      setModalFeedback(null);
    }, 1200);
  };

  const handleWalletAddressOpen = () => {
    setModalFeedback(null);
    setProfileDropdownOpen(false);
    setWalletAddressModalOpen(true);
  };

  const handleSaveWallet = (e) => {
    e.preventDefault();
    setModalFeedback('Wallet address saved successfully.');
    setTimeout(() => {
      setWalletAddressModalOpen(false);
      setModalFeedback(null);
    }, 1200);
  };

  const displayUid = user.id || (user.uid ? `IF${user.uid.substring(0, 6).toUpperCase()}` : 'IF124471');
  const isElevatedAdmin = ['admin', 'superadmin', 'super-admin'].includes(user?.role);
  const logoSrc = siteBranding?.logoUrl || '/logo.png';
  const brandName = siteBranding?.websiteName || 'SIGHT FINANCE';

  return (
    <>
      <header className="site-header">
        <div className="container" style={{ position: 'relative' }}>
          <div className="header-inner">
            {/* Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="header-action-btn"
              title="Open Navigation Menu"
              aria-label="Open Navigation"
            >
              <Menu size={24} color="#ffffff" />
            </button>

            {/* Logo / Center */}
            <div
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigateTo('dashboard', 'customer')}
            >
              <img
                src={logoSrc}
                alt={brandName}
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                style={{
                  height: '40px',
                  width: 'auto',
                  maxWidth: '180px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>

            {/* Right Group: Theme & Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="header-action-btn"
                title="Switch Theme"
                style={{ cursor: 'pointer' }}
                onClick={() => {}}
              >
                <ThemeToggleIcon size={20} />
              </button>

              {/* User Profile Avatar with Dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="header-profile-btn"
                  title="Account Menu"
                >
                  <div className="profile-avatar-circle" style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1.5px solid #d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px'
                  }}>
                    <img
                      src={logoSrc}
                      alt="Profile"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <ChevronDown size={18} color="#ffffff" />
                </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu fade-in">
                  <div className="profile-dropdown-uid">
                    UID : {displayUid}
                  </div>
                  <div>
                    <span className="member-pill-badge" style={{ textTransform: 'uppercase' }}>{user.role || 'Member'}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {isElevatedAdmin && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigateTo('super-admin', 'super-admin');
                        }}
                        className="profile-menu-item"
                        style={{ color: 'var(--gold-bright)', fontWeight: 600 }}
                      >
                        <Shield size={16} color="#d4af37" />
                        <span>Super Admin Panel</span>
                      </button>
                    )}
                    <button onClick={handleEditProfileOpen} className="profile-menu-item">
                      <User size={16} color="#007bff" />
                      <span>Edit Profile</span>
                    </button>
                    <button onClick={handleChangePasswordOpen} className="profile-menu-item">
                      <Key size={16} color="#ffb703" />
                      <span>Change Password</span>
                    </button>
                    <button onClick={handleWalletAddressOpen} className="profile-menu-item">
                      <Wallet size={16} color="#10b981" />
                      <span>Wallet Address</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="profile-menu-item"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut size={16} color="#ef4444" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <aside
            className="sidebar-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brand Logo & Close Row */}
            <div className="sidebar-brand-row">
              <img
                src={logoSrc}
                alt={brandName}
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                style={{
                  height: '46px',
                  width: 'auto',
                  maxWidth: '200px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="header-action-btn"
                aria-label="Close Navigation"
              >
                <X size={22} color="#ffffff" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-menu-list">
              {/* Super Admin Control Panel Link (Authorized Admins only) */}
              {isElevatedAdmin && (
                <button
                  onClick={() => navigateTo('super-admin', 'super-admin')}
                  className={`sidebar-nav-btn ${activePage === 'super-admin' ? 'active' : ''}`}
                  style={{ border: '1px solid var(--gold-border-subtle)', background: 'rgba(212, 175, 55, 0.08)' }}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-amber">
                      <Shield size={18} />
                    </div>
                    <span style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>Super Admin Panel</span>
                  </div>
                </button>
              )}

              {/* 1. Dashboard */}
              <button
                onClick={() => navigateTo('dashboard', 'customer')}
                className={`sidebar-nav-btn ${activePage === 'dashboard' ? 'active' : ''}`}
              >
                <div className="sidebar-nav-left">
                  <div className="sidebar-icon-badge badge-blue">
                    <SpeedometerIcon size={18} />
                  </div>
                  <span>Dashboard</span>
                </div>
              </button>

              {/* 2. Deposit */}
              <button
                onClick={() => navigateTo('deposit', 'customer')}
                className={`sidebar-nav-btn ${activePage === 'deposit' ? 'active' : ''}`}
              >
                <div className="sidebar-nav-left">
                  <div className="sidebar-icon-badge badge-teal">
                    <BriefcaseIcon size={18} />
                  </div>
                  <span>Deposit</span>
                </div>
              </button>

              {/* 3. Package Activation */}
              <div>
                <button
                  onClick={() => toggleSubmenu('package')}
                  className={`sidebar-nav-btn ${openSubmenu === 'package' ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-amber">
                      <PackageIcon size={18} />
                    </div>
                    <span>Package Activation</span>
                  </div>
                  {openSubmenu === 'package' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSubmenu === 'package' && (
                  <div className="sidebar-submenu">
                    <button
                      onClick={() => navigateTo('basic-package', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'basic-package' ? 'active' : ''}`}
                    >
                      5%
                    </button>
                    <button
                      onClick={() => navigateTo('fd-package', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'fd-package' ? 'active' : ''}`}
                    >
                      6%
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Downline */}
              <div>
                <button
                  onClick={() => toggleSubmenu('downline')}
                  className={`sidebar-nav-btn ${openSubmenu === 'downline' ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-cyan">
                      <HierarchyIcon size={18} />
                    </div>
                    <span>Downline</span>
                  </div>
                  {openSubmenu === 'downline' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSubmenu === 'downline' && (
                  <div className="sidebar-submenu">
                    <button
                      onClick={() => navigateTo('direct-team', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'direct-team' ? 'active' : ''}`}
                    >
                      Direct Team
                    </button>
                    <button
                      onClick={() => navigateTo('team-list', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'team-list' ? 'active' : ''}`}
                    >
                      Team List
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Income */}
              <div>
                <button
                  onClick={() => toggleSubmenu('income')}
                  className={`sidebar-nav-btn ${openSubmenu === 'income' ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-green">
                      <BanknoteIcon size={18} />
                    </div>
                    <span>Income</span>
                  </div>
                  {openSubmenu === 'income' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSubmenu === 'income' && (
                  <div className="sidebar-submenu">
                    <button
                      onClick={() => navigateTo('basic-roi-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'basic-roi-income' ? 'active' : ''}`}
                    >
                      Basic ROI Income
                    </button>
                    <button
                      onClick={() => navigateTo('basic-referral-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'basic-referral-income' ? 'active' : ''}`}
                    >
                      Basic Referral Income
                    </button>
                    <button
                      onClick={() => navigateTo('basic-level-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'basic-level-income' ? 'active' : ''}`}
                    >
                      Basic Level Income
                    </button>
                    <button
                      onClick={() => navigateTo('fd-roi-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'fd-roi-income' ? 'active' : ''}`}
                    >
                      FD ROI Income
                    </button>
                    <button
                      onClick={() => navigateTo('fd-referral-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'fd-referral-income' ? 'active' : ''}`}
                    >
                      FD Referral Income
                    </button>
                    <button
                      onClick={() => navigateTo('fd-level-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'fd-level-income' ? 'active' : ''}`}
                    >
                      FD Level Income
                    </button>
                    <button
                      onClick={() => navigateTo('salary-income', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'salary-income' ? 'active' : ''}`}
                    >
                      Salary Income
                    </button>
                  </div>
                )}
              </div>

              {/* 6. Transactional */}
              <div>
                <button
                  onClick={() => toggleSubmenu('transactional')}
                  className={`sidebar-nav-btn ${openSubmenu === 'transactional' ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-indigo">
                      <TransferCycleIcon size={18} />
                    </div>
                    <span>Transactional</span>
                  </div>
                  {openSubmenu === 'transactional' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSubmenu === 'transactional' && (
                  <div className="sidebar-submenu">
                    <button
                      onClick={() => navigateTo('p2p-transfer', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'p2p-transfer' ? 'active' : ''}`}
                    >
                      P2P Transfer
                    </button>
                    <button
                      onClick={() => navigateTo('swap', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'swap' ? 'active' : ''}`}
                    >
                      Transfer Income To Fund
                    </button>
                  </div>
                )}
              </div>

              {/* 7. Reports */}
              <div>
                <button
                  onClick={() => toggleSubmenu('reports')}
                  className={`sidebar-nav-btn ${openSubmenu === 'reports' ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-left">
                    <div className="sidebar-icon-badge badge-yellow">
                      <ReportFileIcon size={18} />
                    </div>
                    <span>Reports</span>
                  </div>
                  {openSubmenu === 'reports' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSubmenu === 'reports' && (
                  <div className="sidebar-submenu">
                    <button
                      onClick={() => navigateTo('daily-income-report', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'daily-income-report' ? 'active' : ''}`}
                    >
                      Daily Income Report
                    </button>
                    <button
                      onClick={() => navigateTo('monthly-income-report', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'monthly-income-report' ? 'active' : ''}`}
                    >
                      Monthly Income Report
                    </button>
                    <button
                      onClick={() => navigateTo('fund-wallet-summary', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'fund-wallet-summary' ? 'active' : ''}`}
                    >
                      Fund Wallet Summary
                    </button>
                    <button
                      onClick={() => navigateTo('income-wallet-summary', 'customer')}
                      className={`sidebar-subitem-btn ${activePage === 'income-wallet-summary' ? 'active' : ''}`}
                    >
                      Income Wallet Summary
                    </button>
                  </div>
                )}
              </div>

              {/* 8. Support Ticket */}
              <button
                onClick={() => navigateTo('support-ticket', 'customer')}
                className={`sidebar-nav-btn ${activePage === 'support-ticket' ? 'active' : ''}`}
              >
                <div className="sidebar-nav-left">
                  <div className="sidebar-icon-badge badge-sky">
                    <HeadsetIcon size={18} />
                  </div>
                  <span>Support Ticket</span>
                </div>
              </button>

              {/* 9. Logout */}
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="sidebar-nav-btn"
                style={{ marginTop: '0.5rem' }}
              >
                <div className="sidebar-nav-left">
                  <div className="sidebar-icon-badge badge-red">
                    <LogoutBoxIcon size={18} />
                  </div>
                  <span>Logout</span>
                </div>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Edit Profile</h3>
              <button onClick={() => setEditProfileModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {modalFeedback && (
              <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {modalFeedback}
              </div>
            )}
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control-input"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-blue" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditProfileModalOpen(false)} className="btn-reset" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setChangePasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Change Password</h3>
              <button onClick={() => setChangePasswordModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {modalFeedback && (
              <div style={{ padding: '0.6rem 0.85rem', background: modalFeedback.includes('successfully') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${modalFeedback.includes('successfully') ? '#10b981' : '#ef4444'}`, color: '#fff', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {modalFeedback}
              </div>
            )}
            <form onSubmit={handleSavePassword}>
              <div className="form-group">
                <label className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-blue" style={{ flex: 1 }}>Update Password</button>
                <button type="button" onClick={() => setChangePasswordModalOpen(false)} className="btn-reset" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Address Modal */}
      {walletAddressModalOpen && (
        <div className="modal-overlay" onClick={() => setWalletAddressModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Wallet Address</h3>
              <button onClick={() => setWalletAddressModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {modalFeedback && (
              <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {modalFeedback}
              </div>
            )}
            <form onSubmit={handleSaveWallet}>
              <div className="form-group">
                <label className="form-label">USDT (TRC20 / BEP20) Payout Address</label>
                <input
                  type="text"
                  className="form-control-input"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  placeholder="Enter wallet address"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-blue" style={{ flex: 1 }}>Save Address</button>
                <button type="button" onClick={() => setWalletAddressModalOpen(false)} className="btn-reset" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
