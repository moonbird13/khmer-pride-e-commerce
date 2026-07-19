import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword } from '../services/api';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const isStaffLogin = pathname === '/staff-login';
  const mode = pathname === '/register' ? 'register' : pathname === '/forgot-password' ? 'forgot' : pathname.startsWith('/reset-password') ? 'reset' : pathname.startsWith('/verify-email') ? 'verify' : 'login';
  const { login, loginStaff, register, logout } = useAuth();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async ({ fullName, identifier, identifierType, password: authPassword }) => {
    setLoading(true);
    setMessage('');
    setMessageType('success');
    try {
      if (mode === 'register') {
        await register({
          fullName,
          email: identifierType === 'email' ? identifier : '',
          phone: identifierType === 'phone' ? identifier : '',
          password: authPassword,
        });
        setMessage('Registration successful. Please log in with your new account.');
        setMessageType('success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const result = await (isStaffLogin ? loginStaff(identifier, authPassword) : login(identifier, authPassword));
        const role = result?.user?.role;
        if (!isStaffLogin && ['staff', 'admin'].includes(role)) {
          await logout();
          throw new Error('Staff and admin accounts must sign in at /staff-login.');
        }
        setMessage('Login successful.');
        setMessageType('success');
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin-portal');
            return;
          }
          if (role === 'staff') {
            navigate('/staff-portal');
            return;
          }
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Authentication failed.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('success');
    try {
      const result = await forgotPassword(email);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`, { state: { message: result.message } });
    } catch (error) {
      setMessage(error?.response?.data?.message || error?.message || 'Unable to start password recovery.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('success');
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      const resetEmail = new URLSearchParams(location.search).get('email');
      if (!resetEmail || !resetCode) {
        throw new Error('Email address and reset code are required.');
      }
      await resetPassword(resetEmail, resetCode, password);
      navigate('/login', { state: { message: 'Password reset successful. Please sign in again.' } });
    } catch (error) {
      setMessage(error?.response?.data?.message || error?.message || 'Unable to reset password.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-shell">
      <div className="auth-shell">
        <section className="auth-intro">
          <p className="eyebrow">Khmer Pride</p>
          <h1>{isStaffLogin ? 'Staff sign in' : mode === 'register' ? 'Create an account' : mode === 'forgot' ? 'Recover your access' : mode === 'reset' ? 'Set a new password' : mode === 'verify' ? 'Confirm your email' : 'Welcome back'}</h1>
          <p>
            {isStaffLogin
              ? 'Use your staff or admin credentials to access the staff portal.'
              : mode === 'register'
                ? 'Join the Khmer Pride community and keep track of favourite pieces.'
                : mode === 'forgot'
                  ? 'Enter your customer email and we will send a six-digit reset code.'
                  : mode === 'reset'
                    ? 'Enter the six-digit code from your email, then choose a new password.'
                    : mode === 'verify'
                      ? 'Your email verification screen is ready for the next integration step.'
                      : 'Sign in to continue browsing and check out seamlessly.'}
          </p>
        </section>

        <section className="auth-panel">
          {message ? <div className={`auth-panel__status auth-panel__status--${messageType}`}>{message}</div> : null}

          {mode === 'register' || mode === 'login' ? (
            <>
              <AuthForm mode={mode} onSubmit={handleAuthSubmit} loading={loading} />
              {mode === 'register' ? (
                <div className="auth-link-row auth-link-row--register">
                  <Link className="auth-back-icon" to="/login" aria-label="Back to login" title="Back to login">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /><path d="M9 12h11" /></svg>
                  </Link>
                </div>
              ) : (
                <div className="auth-link-row auth-link-row--split">
                  <Link to="/forgot-password">Forgot password?</Link>
                  {!isStaffLogin ? <Link to="/register">Create account</Link> : <Link to="/login">Customer login</Link>}
                </div>
              )}
            </>
          ) : null}

          {mode === 'forgot' ? (
            <form className="auth-form-grid" onSubmit={handleForgotSubmit}>
              <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Send code'}</Button>
              <div className="forgot-password-actions">
                <Link className="forgot-password-back" to="/login" aria-label="Back to login" title="Back to login">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                    <path d="M9 12h11" />
                  </svg>
                </Link>
                <Link className="forgot-password-register" to="/register">Create account</Link>
              </div>
            </form>
          ) : null}

          {mode === 'reset' ? (
            <form className="auth-form-grid" onSubmit={handleResetSubmit}>
              <Input label="Reset code" type="text" value={resetCode} onChange={(event) => setResetCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter the 6-digit code" inputMode="numeric" required />
              <Input label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter a new password" required />
              <Input label="Confirm password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter password" required />
              <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Save password'}</Button>
              <div className="auth-link-row">
                <Link to="/login">Back to login</Link>
              </div>
            </form>
          ) : null}

          {mode === 'verify' ? (
            <div className="auth-form-grid">
              <p>Verification is ready for the next backend step.</p>
              <Button to="/login">Back to login</Button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
