import { useEffect, useState } from 'react';
import Button from './Button/Button.jsx';
import Input from './Input/Input.jsx';

export default function AuthForm({ mode, onSubmit, loading, error }) {
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    setIdentifierType('email');
    if (mode !== 'register') {
      setFullName('');
    }
  }, [mode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    setFormError('');
    onSubmit({
      fullName,
      identifier,
      identifierType,
      password,
    });
  };

  const isRegister = mode === 'register';
  const isEmailMode = identifierType === 'email';
  const inputLabel = isRegister
    ? isEmailMode
      ? 'Enter email'
      : 'Enter phone number'
    : 'Email or phone number';
  const inputPlaceholder = isRegister
    ? isEmailMode
      ? 'you@example.com'
      : 'Enter phone number'
    : 'you@example.com or +855...';

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
      {error || formError ? <div className="error-box">{error || formError}</div> : null}
      {isRegister ? (
        <Input
          label="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          required
        />
      ) : null}
      {isRegister ? (
        <div className="auth-form-grid">
          <Input
            label={inputLabel}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={inputPlaceholder}
            type={isEmailMode ? 'email' : 'tel'}
            required
          />
          <a
            href={isEmailMode ? '#phone-registration' : '#email-registration'}
            className="auth-identifier-toggle"
            onClick={(event) => {
              event.preventDefault();
              setIdentifierType(isEmailMode ? 'phone' : 'email');
            }}
          >
            {isEmailMode ? 'Or Enter Phone Number' : 'Use Email Address'}
          </a>
        </div>
      ) : (
        <Input
          label="Email or phone number"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Email or phone number"
          type="text"
          required
        />
      )}
      <Input label="Password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" required />
      {isRegister ? (
        <Input
          label="Re-enter password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          type="password"
          required
        />
      ) : null}
      <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}</Button>
    </form>
  );
}
