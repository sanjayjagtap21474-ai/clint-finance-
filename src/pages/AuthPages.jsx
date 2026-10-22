import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAuthError, validatePassword } from '../firebase/authService';
import { isFirebaseConfigured } from '../firebase/config';
import {
  Lock,
  Mail,
  User,
  Globe,
  AlertCircle,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowRight
} from '../components/Icons';

const AUTH_PAGES = ['login', 'register', 'reset-password', 'register-success'];

export function isAuthPage(page) {
  return AUTH_PAGES.includes(page);
}

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  marginBottom: '0.35rem',
  fontWeight: 600
};

const iconStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)'
};

const eyeBtnStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer'
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--gold-bright)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  padding: 0
};

export default function AuthPages() {
  const { activePage } = useApp();
  if (activePage === 'register') return <RegisterPage />;
  if (activePage === 'reset-password') return <ResetPasswordPage />;
  if (activePage === 'register-success') return <RegisterSuccessPage />;
  return <LoginPage />;
}

function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="container fade-in auth-shell" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '560px' }}>
      <div className="glass-card gold-rim" style={{ padding: '2rem 2rem 2.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--gold-champagne)',
          background: 'rgba(212, 175, 55, 0.1)',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          border: '1px solid var(--gold-border-subtle)',
          marginBottom: '0.75rem'
        }}>
          <Shield size={12} color="#D4AF37" />
          <span>{eyebrow}</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>{title}</h1>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
        {!isFirebaseConfigured && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            color: '#FCA5A5',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>Firebase is not configured on this environment, so sign-in and registration cannot complete.</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <div style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.3rem' }}>{message}</div>;
}

function AlertBanner({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div style={{
      background: isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
      border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      marginBottom: '1.25rem',
      fontSize: '0.825rem',
      color: isError ? '#FCA5A5' : '#6EE7B7',
      display: 'flex',
      gap: '0.65rem',
      alignItems: 'center'
    }}>
      {isError ? <AlertCircle size={16} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '0 0 1.25rem',
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      <span>or continue with email</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
    </div>
  );
}

function GoogleButton({ loading, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        color: '#FFFFFF',
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        marginBottom: '1.25rem'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

function LoginPage() {
  const {
    login,
    loginWithGoogleAuth,
    goToAuthPage,
    enterCustomerPortal,
    setActivePage,
    showToast
  } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password to continue.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res?.success) {
        showToast('Signed in successfully.', 'gold');
        enterCustomerPortal();
      } else {
        setErrorMessage(res?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await loginWithGoogleAuth();
      if (res?.success && res.isNewUser) {
        showToast('Google account created.', 'gold');
        setActivePage('register-success');
      } else if (res?.success) {
        showToast('Signed in successfully.', 'gold');
        enterCustomerPortal();
      } else {
        setErrorMessage(res?.error || 'Google sign-in was not completed.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure Access"
      title="Sign in to Sight Finance"
      subtitle="Use your registered email and password. You will only reach the dashboard after authentication succeeds."
    >
      <AlertBanner type="error" message={errorMessage} />
      <GoogleButton loading={loading} onClick={handleGoogle} label="Continue with Google" />
      <Divider />
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={iconStyle} />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <button type="button" onClick={() => goToAuthPage('reset')} style={linkBtnStyle}>Forgot password?</button>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Signing in...' : 'Sign In to Portal'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Don't have an account yet?{' '}
        <button type="button" onClick={() => goToAuthPage('register')} style={{ ...linkBtnStyle, fontWeight: 600 }}>
          Create one now
        </button>
      </p>
    </AuthShell>
  );
}

function RegisterPage() {
  const { register, loginWithGoogleAuth, goToAuthPage, setActivePage, enterCustomerPortal, showToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!email.trim()) next.email = 'Please enter a valid email address.';
    const passwordError = validatePassword(password);
    if (passwordError) next.password = passwordError;
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register(email.trim(), password, fullName.trim(), country);
      if (res?.success) {
        showToast('Account created successfully.', 'gold');
        setActivePage('register-success');
      } else {
        setErrorMessage(res?.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await loginWithGoogleAuth();
      if (res?.success && res.isNewUser) {
        showToast('Google account created.', 'gold');
        setActivePage('register-success');
      } else if (res?.success) {
        showToast('Signed in successfully.', 'gold');
        enterCustomerPortal();
      } else {
        setErrorMessage(res?.error || 'Google sign-in was not completed.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Register with Sight Finance"
      subtitle="Your password is stored by Firebase Authentication only. It is never written to Firestore or this application."
    >
      <AlertBanner type="error" message={errorMessage} />
      <GoogleButton loading={loading} onClick={handleGoogle} label="Continue with Google" />
      <Divider />
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={iconStyle} />
            <input
              type="text"
              required
              autoComplete="name"
              placeholder="Alexander Kramer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <FieldError message={fieldErrors.fullName} />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={iconStyle} />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <FieldError message={fieldErrors.email} />
        </div>
        <div>
          <label style={labelStyle}>Jurisdiction / Country</label>
          <div style={{ position: 'relative' }}>
            <Globe size={16} style={iconStyle} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            >
              <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Singapore">Singapore</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Qatar">Qatar</option>
              <option value="Germany">Germany</option>
              <option value="United States">United States</option>
              <option value="International">Other International</option>
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError message={fieldErrors.password} />
        </div>
        <div>
          <label style={labelStyle}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={iconStyle} />
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtnStyle} aria-label="Toggle confirm password visibility">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError message={fieldErrors.confirmPassword} />
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          By registering, you agree to SIGHT FINANCE Terms of Service and Privacy Policy.
        </div>
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <button type="button" onClick={() => goToAuthPage('login')} style={{ ...linkBtnStyle, fontWeight: 600 }}>
          Sign in
        </button>
      </p>
    </AuthShell>
  );
}

function ResetPasswordPage() {
  const { sendPasswordReset, goToAuthPage } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');
    if (!email.trim()) {
      setErrorMessage('Please provide your account email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendPasswordReset(email.trim());
      if (res?.success) {
        setSuccessNotice(`A password recovery email has been sent to ${email.trim()}. Check your inbox.`);
      } else {
        setErrorMessage(res?.error || 'Could not send recovery link.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Reset account password"
      subtitle="Firebase will email a reset link only if this address is registered."
    >
      <AlertBanner type="error" message={errorMessage} />
      <AlertBanner type="success" message={successNotice} />
      <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={iconStyle} />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Sending link...' : 'Send Recovery Link'}
        </button>
        <button type="button" onClick={() => goToAuthPage('login')} style={{ ...linkBtnStyle, textAlign: 'center', fontSize: '0.825rem' }}>
          Return to Sign In
        </button>
      </form>
    </AuthShell>
  );
}

function RegisterSuccessPage() {
  const { registrationResult, user, firebaseUser, enterCustomerPortal, goToAuthPage, isLoggedIn } = useApp();
  const [copied, setCopied] = useState('');

  const uid = registrationResult?.uid || firebaseUser?.uid || user?.uid || '';
  const displayId = registrationResult?.displayId || user?.id || '';
  const email = registrationResult?.email || user?.email || firebaseUser?.email || '';
  const fullName = registrationResult?.fullName || user?.fullName || firebaseUser?.displayName || '';
  const emailVerificationSent = Boolean(registrationResult?.emailVerificationSent);

  const copyValue = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
    }
  };

  if (!uid) {
    return (
      <AuthShell eyebrow="Registration" title="No new account to display" subtitle="Complete registration first to receive your unique User ID.">
        <button type="button" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={() => goToAuthPage('register')}>
          Go to Registration
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account Created"
      title="Registration successful"
      subtitle="Your Firebase User ID is permanent. It stays the same after logout, login, and refresh."
    >
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '1rem 1.1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        gap: '0.65rem',
        alignItems: 'flex-start'
      }}>
        <CheckCircle2 size={18} color="#6EE7B7" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#D1FAE5', lineHeight: 1.55 }}>
          Welcome{fullName ? `, ${fullName}` : ''}. Your profile is stored at <span style={{ fontFamily: 'var(--font-mono)' }}>users/{uid}</span>.
          {emailVerificationSent && ' A verification email has been sent to your inbox.'}
        </div>
      </div>

      <IdRow label="Firebase User ID (canonical)" value={uid} copied={copied === 'uid'} onCopy={() => copyValue(uid, 'uid')} />
      {displayId && (
        <IdRow label="Display ID" value={displayId} copied={copied === 'display'} onCopy={() => copyValue(displayId, 'display')} />
      )}
      {email && (
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={labelStyle}>Email Address</div>
          <div style={{ color: '#FFF', fontSize: '0.9rem' }}>{email}</div>
        </div>
      )}

      <button
        type="button"
        className="btn btn-gold"
        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
        onClick={isLoggedIn ? enterCustomerPortal : () => goToAuthPage('login')}
      >
        <span>{isLoggedIn ? 'Continue to Dashboard' : 'Sign in to continue'}</span>
        <ArrowRight size={16} />
      </button>
    </AuthShell>
  );
}

function IdRow({ label, value, copied, onCopy }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <div style={labelStyle}>{label}</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '0.7rem 0.85rem'
      }}>
        <code style={{
          flex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--gold-champagne)',
          wordBreak: 'break-all'
        }}>
          {value}
        </code>
        <button type="button" onClick={onCopy} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
