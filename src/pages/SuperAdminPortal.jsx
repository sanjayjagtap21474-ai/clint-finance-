import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Settings,
  Globe,
  Sliders,
  FileText,
  Users,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  RotateCcw,
  Eye,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Coins,
  TrendingUp,
  Award,
  HelpCircle,
  Check,
  Search,
  Filter,
  RefreshCw
} from '../components/Icons';
import { subscribeToAllDepositRequests } from '../firebase/firestoreService';

export default function SuperAdminPortal() {
  const {
    user,
    isLoggedIn,
    showToast,
    siteBranding,
    saveAdminBranding,
    siteContent,
    saveAdminContent,
    homepageSections,
    saveAdminHomepageSections,
    dashboardLayout,
    saveAdminDashboardLayout,
    featureSettings,
    saveAdminFeatures,
    siteInvestmentPlans,
    saveAdminInvestmentPlans,
    siteReferralRewards,
    saveAdminReferralRewards,
    siteFaqs,
    saveAdminFaqs,
    siteLegal,
    saveAdminLegal,
    allRegisteredUsers,
    setAllRegisteredUsers,
    adminLogs,
    tickets,
    setTickets,
    logSystemEvent,
    isFirebaseConfigured
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview | branding | content | sections | dashboard | features | plans | faqs | legal | customers | deposits | tickets | logs

  // Real-time Firestore Deposit Requests state
  const [firestoreDeposits, setFirestoreDeposits] = useState([]);
  const [depositsLoading, setDepositsLoading] = useState(true);
  const [depositsError, setDepositsError] = useState(null);

  // Search and filter states
  const [customerSearch, setCustomerSearch] = useState('');
  const [depositSearch, setDepositSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState('All');

  // Form States
  const [brandingForm, setBrandingForm] = useState(siteBranding);
  const [contentForm, setContentForm] = useState(siteContent);
  const [sectionsForm, setSectionsForm] = useState(homepageSections);
  const [dashboardForm, setDashboardForm] = useState(dashboardLayout);
  const [featureForm, setFeatureForm] = useState(featureSettings);
  const [plansForm, setPlansForm] = useState(siteInvestmentPlans);
  const [rewardsForm, setRewardsForm] = useState(siteReferralRewards);
  const [faqsForm, setFaqsForm] = useState(siteFaqs);
  const [legalForm, setLegalForm] = useState(siteLegal);

  // Sync states on load or update
  useEffect(() => { if (siteBranding) setBrandingForm(siteBranding); }, [siteBranding]);
  useEffect(() => { if (siteContent) setContentForm(siteContent); }, [siteContent]);
  useEffect(() => { if (homepageSections) setSectionsForm(homepageSections); }, [homepageSections]);
  useEffect(() => { if (dashboardLayout) setDashboardForm(dashboardLayout); }, [dashboardLayout]);
  useEffect(() => { if (featureSettings) setFeatureForm(featureSettings); }, [featureSettings]);
  useEffect(() => { if (siteInvestmentPlans) setPlansForm(siteInvestmentPlans); }, [siteInvestmentPlans]);
  useEffect(() => { if (siteReferralRewards) setRewardsForm(siteReferralRewards); }, [siteReferralRewards]);
  useEffect(() => { if (siteFaqs) setFaqsForm(siteFaqs); }, [siteFaqs]);
  useEffect(() => { if (siteLegal) setLegalForm(siteLegal); }, [siteLegal]);

  // Subscribe to real-time depositRequests from Firestore
  useEffect(() => {
    let unsubscribe = subscribeToAllDepositRequests(
      (records) => {
        setFirestoreDeposits(records || []);
        setDepositsLoading(false);
      },
      (err) => {
        console.warn('[SuperAdminPortal] Firestore deposits subscription error:', err.message);
        setDepositsError(err.message);
        setDepositsLoading(false);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Authorization Check
  const isAuthorized = isLoggedIn && ['admin', 'superadmin', 'super-admin'].includes(user?.role);

  if (!isAuthorized) {
    return (
      <div className="container fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '640px' }}>
        <div className="glass-card gold-rim" style={{ padding: '3rem 2rem' }}>
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
          <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '0.5rem' }}>Restricted Super Admin Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The Super Admin Control Panel requires elevated administrator authorization. You are signed in as <strong style={{ color: '#FFF' }}>{user.email || user.fullName || 'Client'}</strong> with role <span className="badge badge-neutral">{user.role || 'customer'}</span>.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <strong>How to Grant Admin Authorization:</strong><br />
            In Firebase Console &gt; Firestore Database, set <code style={{ color: 'var(--gold-bright)' }}>users/{user.uid}</code> document property <code style={{ color: 'var(--gold-bright)' }}>role: "superadmin"</code> or <code style={{ color: 'var(--gold-bright)' }}>"admin"</code>.
          </div>
          <div className="badge badge-danger">
            SOVEREIGN GOVERNANCE ACCESS REQUIRED
          </div>
        </div>
      </div>
    );
  }

  // Handle Form Submissions
  const handleSaveBranding = async (e) => {
    e.preventDefault();
    await saveAdminBranding(brandingForm);
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    await saveAdminContent(contentForm);
  };

  const handleSaveSections = async (e) => {
    e.preventDefault();
    await saveAdminHomepageSections(sectionsForm);
  };

  const handleSaveDashboard = async (e) => {
    e.preventDefault();
    await saveAdminDashboardLayout(dashboardForm);
  };

  const handleSaveFeatures = async (e) => {
    e.preventDefault();
    await saveAdminFeatures(featureForm);
  };

  const handleSaveLegal = async (e) => {
    e.preventDefault();
    await saveAdminLegal(legalForm);
  };

  const handleSaveFaqs = async (e) => {
    e.preventDefault();
    await saveAdminFaqs(faqsForm);
  };

  // Filtered lists
  const filteredCustomers = (allRegisteredUsers || []).filter(u => {
    const name = (u.name || u.fullName || 'Customer').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const id = (u.id || u.uid || '').toLowerCase();
    const query = customerSearch.toLowerCase();
    return name.includes(query) || email.includes(query) || id.includes(query);
  });

  const filteredDeposits = (firestoreDeposits || []).filter(d =>
    (d.docId && d.docId.toLowerCase().includes(depositSearch.toLowerCase())) ||
    (d.txHash && d.txHash.toLowerCase().includes(depositSearch.toLowerCase())) ||
    (d.userDisplayId && d.userDisplayId.toLowerCase().includes(depositSearch.toLowerCase())) ||
    (d.network && d.network.toLowerCase().includes(depositSearch.toLowerCase()))
  );

  const filteredTickets = (tickets || []).filter(t =>
    ticketFilter === 'All' || t.status === ticketFilter
  );

  return (
    <div className="container fade-in" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(10, 11, 14, 0.95) 100%)',
        border: '1px solid var(--gold-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gold-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#050507',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Super Admin Control Panel</span>
              <span className="badge badge-gold">Sovereign Governance</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Real-time Firestore Site Settings & Operational Telemetry • Sight Finance Architecture
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', textAlign: 'right' }}>
            <div style={{ color: 'var(--text-muted)' }}>Signed In Administrator</div>
            <div style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>{user.email || user.fullName}</div>
          </div>
        </div>
      </div>

      {/* Prototype Disclosure Notice */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.06)',
        border: '1px solid var(--gold-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.75rem',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <AlertTriangle size={18} color="#D4AF37" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#FFF' }}>DEMONSTRATION PROTOTYPE MODE:</strong> All financial features, yield plans, and USDT balance adjustments operate strictly in demonstrative simulation mode.
        </div>
      </div>

      {/* Main Admin Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }} className="superadmin-grid">
        {/* Sidebar Nav */}
        <div className="glass-card" style={{ padding: '1.25rem 0.85rem', height: 'fit-content' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.75rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            System Navigation
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
            <SidebarBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp size={16} />} label="Overview & Stats" />
            <SidebarBtn active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={16} />} label="Customer Management" />
            <SidebarBtn active={activeTab === 'deposits'} onClick={() => setActiveTab('deposits')} icon={<Coins size={16} />} label="Deposit Request Review" />
            <SidebarBtn active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} icon={<Globe size={16} />} label="Site Branding Settings" />
            <SidebarBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<FileText size={16} />} label="Homepage Copy" />
            <SidebarBtn active={activeTab === 'sections'} onClick={() => setActiveTab('sections')} icon={<Layers size={16} />} label="Section Layout" />
            <SidebarBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Sliders size={16} />} label="Customer Portal Layout" />
            <SidebarBtn active={activeTab === 'features'} onClick={() => setActiveTab('features')} icon={<Settings size={16} />} label="Feature Switches" />
            <SidebarBtn active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={<HelpCircle size={16} />} label="Support Tickets" />
            <SidebarBtn active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} icon={<HelpCircle size={16} />} label="FAQs Engine" />
            <SidebarBtn active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} icon={<Shield size={16} />} label="Legal Documents" />
            <SidebarBtn active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Cpu size={16} />} label="System Activity Logs" />
          </div>
        </div>

        {/* Content Views */}
        <div style={{ minWidth: 0 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid-4">
                <MetricCard title="Total Registered Users" value={allRegisteredUsers.length} subtitle="Firestore Synced" color="#10B981" />
                <MetricCard title="Pending Deposit Requests" value={firestoreDeposits.filter(d => d.verificationStatus === 'pending_backend_review').length} subtitle="Firestore Collection" color="#F59E0B" />
                <MetricCard title="Site Name" value={siteBranding.websiteName} subtitle="Live Customization" color="var(--gold-bright)" />
                <MetricCard title="Firebase Active" value={isFirebaseConfigured ? "CONNECTED" : "OFFLINE"} subtitle="Database Status" color={isFirebaseConfigured ? "#10B981" : "#EF4444"} />
              </div>

              <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
                  Sight Finance Dynamic Site Customization
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Edit website name, logo URL, hero headlines, section layout, features, and FAQs. Changes are synchronized to Cloud Firestore in real-time.
                </p>

                <div className="grid-3">
                  <QuickLinkCard title="Site Branding" desc="Edit website name, logo URL, and copyright." onClick={() => setActiveTab('branding')} />
                  <QuickLinkCard title="Deposit Review" desc="Inspect deposit requests from /depositRequests." onClick={() => setActiveTab('deposits')} />
                  <QuickLinkCard title="Customer Accounts" desc="Manage customer accounts and KYC statuses." onClick={() => setActiveTab('customers')} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Customer Accounts Management</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View registered user accounts and compliance KYC levels.</p>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search user name or email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '240px' }}
                />
              </div>

              {filteredCustomers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customer accounts match your search.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Country</th>
                        <th>Simulated Balance</th>
                        <th>KYC Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(u => (
                        <tr key={u.id || u.uid}>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{u.id || u.uid}</td>
                          <td style={{ fontWeight: 600, color: '#FFF' }}>{u.name || u.fullName || 'Customer'}</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email || 'N/A'}</td>
                          <td>{u.country || 'N/A'}</td>
                          <td style={{ fontWeight: 700, color: 'var(--gold-bright)' }}>${(u.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
                          <td><span className="badge badge-success">{u.kycStatus || 'Unverified'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEPOSITS */}
          {activeTab === 'deposits' && (
            <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Firestore Deposit Requests Review</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Real-time stream from <code style={{ color: 'var(--gold-bright)' }}>/depositRequests</code> collection in Firestore.</p>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search TxHash, UID, Network..."
                  value={depositSearch}
                  onChange={(e) => setDepositSearch(e.target.value)}
                  style={{ width: '240px' }}
                />
              </div>

              {depositsLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Loading deposit requests from Firestore...
                </div>
              ) : depositsError ? (
                <div style={{ padding: '2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', borderRadius: '8px' }}>
                  Subscription Error: {depositsError}
                </div>
              ) : filteredDeposits.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No deposit requests found in Firestore collection.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>Doc ID</th>
                        <th>User UID</th>
                        <th>Network</th>
                        <th>Tx Hash</th>
                        <th>Claimed Amount</th>
                        <th>Verification Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeposits.map(d => (
                        <tr key={d.docId}>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)', fontSize: '0.8rem' }}>{d.docId}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d.userDisplayId || d.uid}</td>
                          <td><span className="badge badge-neutral">{d.network}</span></td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {d.txHash ? `${d.txHash.substring(0, 16)}...` : 'N/A'}
                          </td>
                          <td style={{ fontWeight: 700, color: '#FFF' }}>${d.tokenAmountClaimed} USDT</td>
                          <td>
                            <span className={`badge ${d.verificationStatus === 'pending_backend_review' ? 'badge-pending' : 'badge-success'}`}>
                              {d.verificationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BRANDING */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Site Branding Settings" subtitle="Configure site name, logo URL, contact email, and copyright text." />

              <div className="grid-2" style={{ gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Website Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandingForm.websiteName || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, websiteName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline / Slogan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandingForm.tagline || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={brandingForm.logoUrl || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={brandingForm.contactEmail || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, contactEmail: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Physical Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandingForm.physicalAddress || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, physicalAddress: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Copyright Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandingForm.copyrightText || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, copyrightText: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Branding Settings</span>
              </button>
            </form>
          )}

          {/* TAB 5: HOMEPAGE COPY */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveContent} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Homepage Hero Copy Engine" subtitle="Customize main banner text, subheadings, and risk disclosure notes." />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Hero Badge Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contentForm.heroBadge || ''}
                    onChange={(e) => setContentForm({ ...contentForm, heroBadge: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contentForm.heroHeading || ''}
                    onChange={(e) => setContentForm({ ...contentForm, heroHeading: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Subheading</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={contentForm.heroSubheading || ''}
                    onChange={(e) => setContentForm({ ...contentForm, heroSubheading: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Risk Disclosure Notice</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={contentForm.riskNoticeText || ''}
                    onChange={(e) => setContentForm({ ...contentForm, riskNoticeText: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Homepage Copy</span>
              </button>
            </form>
          )}

          {/* TAB 6: SECTION LAYOUT */}
          {activeTab === 'sections' && (
            <form onSubmit={handleSaveSections} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Homepage Section Layout" subtitle="Show, hide, or re-order landing page sections." />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {sectionsForm.map((sec, idx) => (
                  <div key={sec.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '0.85rem 1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-neutral">#{idx + 1}</span>
                      <span style={{ fontWeight: 600, color: '#FFF' }}>{sec.title}</span>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: sec.visible ? '#10B981' : 'var(--text-muted)' }}>
                      <input
                        type="checkbox"
                        checked={sec.visible}
                        onChange={(e) => {
                          const updated = [...sectionsForm];
                          updated[idx].visible = e.target.checked;
                          setSectionsForm(updated);
                        }}
                        style={{ accentColor: '#D4AF37' }}
                      />
                      <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                    </label>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Section Layout</span>
              </button>
            </form>
          )}

          {/* TAB 7: DASHBOARD LAYOUT */}
          {activeTab === 'dashboard' && (
            <form onSubmit={handleSaveDashboard} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Customer Portal Layout" subtitle="Configure currency symbol and announcement banners." />

              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '120px' }}
                  value={dashboardForm.currencySymbol || '$'}
                  onChange={(e) => setDashboardForm({ ...dashboardForm, currencySymbol: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Announcement Banner Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={dashboardForm.announcementBanner?.text || ''}
                  onChange={(e) => setDashboardForm({
                    ...dashboardForm,
                    announcementBanner: { ...dashboardForm.announcementBanner, text: e.target.value }
                  })}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Customer Portal Layout</span>
              </button>
            </form>
          )}

          {/* TAB 8: FEATURES */}
          {activeTab === 'features' && (
            <form onSubmit={handleSaveFeatures} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Global Feature Switches" subtitle="Toggle platform features and maintenance mode." />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FeatureToggle
                  label="Maintenance Mode"
                  desc="When enabled, non-admin visitors see a maintenance banner."
                  checked={Boolean(featureForm.maintenanceMode)}
                  onChange={(checked) => setFeatureForm({ ...featureForm, maintenanceMode: checked })}
                />
                <FeatureToggle
                  label="Enable Investment Plans"
                  desc="Allows customers to subscribe to yield models."
                  checked={Boolean(featureForm.enableInvestments)}
                  onChange={(checked) => setFeatureForm({ ...featureForm, enableInvestments: checked })}
                />
                <FeatureToggle
                  label="Enable Referrals Program"
                  desc="Activates 10% direct referral tracking and bonus rewards."
                  checked={Boolean(featureForm.enableReferrals)}
                  onChange={(checked) => setFeatureForm({ ...featureForm, enableReferrals: checked })}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Feature Switches</span>
              </button>
            </form>
          )}

          {/* TAB 9: TICKETS */}
          {activeTab === 'tickets' && (
            <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Support Tickets Desk</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Customer support tickets and inquiries.</p>
                </div>
                <select
                  className="form-select"
                  value={ticketFilter}
                  onChange={(e) => setTicketFilter(e.target.value)}
                  style={{ width: '160px' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {filteredTickets.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No support tickets found.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-champagne)' }}>{t.id}</td>
                          <td style={{ fontWeight: 600, color: '#FFF' }}>{t.subject}</td>
                          <td>{t.category}</td>
                          <td><span className="badge badge-neutral">{t.priority}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.date}</td>
                          <td><span className="badge badge-success">{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: FAQS */}
          {activeTab === 'faqs' && (
            <form onSubmit={handleSaveFaqs} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="FAQs Engine" subtitle="Add or edit platform FAQ items." />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqsForm.map((faq, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-gold">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setFaqsForm(faqsForm.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Question</label>
                      <input
                        type="text"
                        className="form-input"
                        value={faq.q || ''}
                        onChange={(e) => {
                          const updated = [...faqsForm];
                          updated[idx].q = e.target.value;
                          setFaqsForm(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Answer</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        value={faq.a || ''}
                        onChange={(e) => {
                          const updated = [...faqsForm];
                          updated[idx].a = e.target.value;
                          setFaqsForm(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setFaqsForm([...faqsForm, { q: 'New Question', a: 'Answer text...' }])}
                  className="btn btn-secondary btn-sm"
                  style={{ width: 'fit-content', gap: '0.35rem' }}
                >
                  <Plus size={14} />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save FAQs</span>
              </button>
            </form>
          )}

          {/* TAB 11: LEGAL */}
          {activeTab === 'legal' && (
            <form onSubmit={handleSaveLegal} className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="Legal Documents" subtitle="Terms of Service, Privacy Policy, and Risk Notices." />

              <div className="form-group">
                <label className="form-label">Terms of Service</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={legalForm.termsContent || ''}
                  onChange={(e) => setLegalForm({ ...legalForm, termsContent: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Privacy Policy</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={legalForm.privacyContent || ''}
                  onChange={(e) => setLegalForm({ ...legalForm, privacyContent: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Risk Disclosure Notice</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={legalForm.riskDisclosureContent || ''}
                  onChange={(e) => setLegalForm({ ...legalForm, riskDisclosureContent: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <Save size={16} />
                <span>Save Legal Documents</span>
              </button>
            </form>
          )}

          {/* TAB 12: LOGS */}
          {activeTab === 'logs' && (
            <div className="glass-card gold-rim" style={{ padding: '2rem' }}>
              <HeaderTitle title="System Activity & Audit Logs" subtitle="Firestore-streamed audit log history." />

              <div className="table-wrapper">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>ID / Time</th>
                      <th>Event Action</th>
                      <th>Actor</th>
                      <th>Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(adminLogs || []).map((l, i) => (
                      <tr key={l.id || i}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--gold-champagne)' }}>
                          {l.id || 'FIRESTORE'}
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.timestamp || l.clientTimestamp}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#FFF' }}>{l.event || l.action}</td>
                        <td style={{ fontSize: '0.85rem' }}>{l.actor || l.adminEmail || 'admin'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.details || l.module}</td>
                        <td>
                          <span className={`badge ${l.status === 'Success' || l.status === 'Audit Passed' ? 'badge-success' : 'badge-demo'}`}>
                            {l.status || 'Logged'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .superadmin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// Helpers
function SidebarBtn({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        width: '100%',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--gold-gradient)' : 'transparent',
        color: active ? '#050507' : 'var(--text-secondary)',
        fontWeight: active ? 700 : 500,
        fontSize: '0.85rem',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease'
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function HeaderTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
      <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '0.35rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{subtitle}</p>
    </div>
  );
}

function MetricCard({ title, value, subtitle, color }) {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: color || '#FFF', marginTop: '0.35rem' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{subtitle}</div>
    </div>
  );
}

function QuickLinkCard({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.2s'
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--gold-bright)', marginBottom: '0.35rem' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function FeatureToggle({ label, desc, checked, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      padding: '1rem 1.25rem'
    }}>
      <div>
        <div style={{ fontWeight: 600, color: '#FFF' }}>{label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: '20px', height: '20px', accentColor: '#D4AF37', cursor: 'pointer' }}
      />
    </div>
  );
}
