import { useState } from 'react';

export default function AuthForm({ mode, onSubmit, loading, error }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ fullName, email, password });
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
      <p>Discover authentic Cambodian products with Khmer Pride.</p>
      {error ? <div className="error-box">{error}</div> : null}
      {mode === 'register' ? (
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          required
        />
      ) : null}
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
      <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" required />
      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}</button>
    </form>
  );
}
