import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');

  const primaryLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/', label: 'About' },
    { to: '/', label: 'Contact' },
  ];

  return (
    <header className="site-navbar">
      <div className="navbar-main">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark">KP</span>
          <span className="brand-copy">
            <strong>Khmer Pride</strong>
            <small>Modern Khmer commerce</small>
          </span>
        </Link>

        <div className="navbar-search">
          <SearchBar value={query} onChange={setQuery} placeholder="Search products..." />
        </div>
      </div>

      <nav className="navbar-links" aria-label="Primary navigation">
        {primaryLinks.map((link) => (
          <NavLink
            key={link.label}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <Link className="navbar-icon-link" to="/wishlist">
          <span aria-hidden="true">♡</span>
          <span>Wishlist</span>
        </Link>
        <Link className="navbar-icon-link" to="/cart">
          <span aria-hidden="true">🛒</span>
          <span>Cart</span>
        </Link>
        {user ? (
          <>
            <Button to="/profile" variant="secondary" className="navbar-pill">Profile</Button>
            <Button variant="secondary" className="navbar-pill" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Button to="/login" variant="primary" className="navbar-pill">Login</Button>
        )}
      </div>
    </header>
  );
}
