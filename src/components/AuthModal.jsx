import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAuthError } from '../firebase/authService';
import { isFirebaseConfigured } from '../firebase/config';
import {
  Lock,
  Mail,
  User,
  Globe,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  Shield,
  Eye,
  EyeOff
} from './Icons';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    loginWithGoogleAuth,
    sendPasswordReset,
    showToast
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!authModalOpen) return null;

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setErrorMessage('');
    setSuccessNotice('');
    setLoading(false);
  };

  const closeModal = () => {
    resetFormState();
    setAuthModalOpen(false);
  };

  const handleTabSwitch = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessNotice('');
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.success) {
        showToast('Successfully authenticated. Welcome to Sight Finance.', 'gold');
        closeModal();
      } else {
        setErrorMessage(res?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(email, password, fullName, country);
      if (res && res.success) {
        showToast('Account created successfully! Welcome to Sight Finance.', 'gold');
        closeModal();
      } else {
        setErrorMessage(res?.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const res = await loginWithGoogleAuth();
      if (res && res.success) {
        showToast('Successfully authenticated with Google.', 'gold');
        closeModal();
      } else {
        setErrorMessage(res?.error || 'Google sign-in was not completed.');
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!email) {
      setErrorMessage('Please provide your account email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await sendPasswordReset(email);
      if (res && res.success) {
        setSuccessNotice(`A secure password recovery email has been sent to ${email}. Check your inbox.`);
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
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-content" style={{ maxWidth: '480px', padding: '2rem 2.25rem' }}>
        {/* Header with Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
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
              marginBottom: '0.5rem'
            }}>
              <Shield size={12} color="#D4AF37" />
              <span>Firebase Identity & Access</span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
              {authMode === 'login' && 'Sign In to Sight'}
              {authMode === 'register' && 'Create Your Account'}
              {authMode === 'reset' && 'Reset Account Password'}
            </h3>
          </div>
          <button
            onClick={closeModal}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Firebase Config Notice if keys missing */}
        {!isFirebaseConfigured && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.78rem',
            color: '#FCD34D',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>
              Live Firebase credentials pending. Add configuration in <code>.env.local</code>. Running in interactive simulated prototype mode.
            </span>
          </div>
        )}

        {/* Tab Buttons for Sign In / Register */}
        {authMode !== 'reset' && (
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: authMode === 'login' ? 'var(--gold-gradient)' : 'transparent',
                color: authMode === 'login' ? '#050507' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: authMode === 'register' ? 'var(--gold-gradient)' : 'transparent',
                color: authMode === 'register' ? '#050507' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.825rem',
            color: '#FCA5A5',
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{errorMessage}</div>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.825rem',
            color: '#6EE7B7',
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{successNotice}</div>
          </div>
        )}

        {/* Google Sign In Button (Available for login & register) */}
        {authMode !== 'reset' && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
                transition: 'all 0.2s',
                marginBottom: '1.25rem'
              }}
              className="google-auth-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.25rem 0',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span>or continue with email</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>
          </>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('reset')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-bright)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Full Legal Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="Alexander Kramer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Jurisdiction / Country
              </label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.25rem' }}>
              By registering, you agree to SIGHT FINANCE Terms of Service and Privacy Policy.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? 'Creating Account...' : 'Register Secure Account'}
            </button>
          </form>
        )}

        {/* 3. PASSWORD RESET FORM */}
        {authMode === 'reset' && (
          <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter your registered email address and we will dispatch a secure Firebase password reset link to your inbox.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? 'Dispatching Link...' : 'Send Recovery Link'}
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-champagne)',
                fontSize: '0.825rem',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '0.25rem'
              }}
            >
              Return to Sign In
            </button>
          </form>
        )}

        {/* Footer switch prompt */}
        {authMode !== 'reset' && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {authMode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .google-auth-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: var(--gold-border) !important;
        }
      `}</style>
    </div>
  );
}
