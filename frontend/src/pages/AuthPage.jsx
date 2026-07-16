import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const mode = pathname === '/register' ? 'register' : pathname === '/forgot-password' ? 'forgot' : pathname.startsWith('/reset-password') ? 'reset' : pathname.startsWith('/verify-email') ? 'verify' : 'login';
  const { login, register } = useAuth();

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async ({ fullName, identifier, identifierType, password: authPassword }) => {
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'register') {
        await register({
          fullName,
          email: identifierType === 'email' ? identifier : '',
          phone: identifierType === 'phone' ? identifier : '',
          password: authPassword,
        });
        setMessage('Registration successful. Please log in with your new account.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const result = await login(identifier, authPassword);
        const role = result?.user?.role;
        setMessage('Login successful.');
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin-dashboard');
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
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      setMessage('Recovery instructions are ready for the next step.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      setMessage('Password reset successful. Please log in again.');
      navigate('/login');
    } catch (error) {
      setMessage(error.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page page-shell">
      <div className="auth-shell">
        <section className="auth-intro">
          <p className="eyebrow">Khmer Pride</p>
          <h1>{mode === 'register' ? 'Create an account' : mode === 'forgot' ? 'Recover your access' : mode === 'reset' ? 'Set a new password' : mode === 'verify' ? 'Confirm your email' : 'Welcome back'}</h1>
          <p>
            {mode === 'register'
              ? 'Join the Khmer Pride community and keep track of favourite pieces.'
              : mode === 'forgot'
                ? 'We will send your reset request to the backend and continue to the next step.'
                : mode === 'reset'
                  ? 'Choose a new password for your Khmer Pride account.'
                  : mode === 'verify'
                    ? 'Your email verification screen is ready for the next integration step.'
                    : 'Sign in to continue browsing and check out seamlessly.'}
          </p>
        </section>

        <section className="auth-panel">
          {message ? <div className="auth-panel__status">{message}</div> : null}

          {mode === 'register' || mode === 'login' ? (
            <>
              <AuthForm mode={mode} onSubmit={handleAuthSubmit} loading={loading} />
              <div className="auth-link-row">
                <Link to="/forgot-password">Forgot password?</Link>
                <Link to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create account' : 'Back to login'}</Link>
              </div>
            </>
          ) : null}

          {mode === 'forgot' ? (
            <form className="auth-form-grid" onSubmit={handleForgotSubmit}>
              <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Send link'}</Button>
              <div className="auth-link-row">
                <Link to="/login">Back to login</Link>
                <Link to="/register">Create account</Link>
              </div>
            </form>
          ) : null}

          {mode === 'reset' ? (
            <form className="auth-form-grid" onSubmit={handleResetSubmit}>
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
