import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/', label: 'About' },
    { to: '/', label: 'Contact' },
  ];

  return (
    <header className="site-navbar">
      <div className="navbar-brand-wrap">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark">KP</span>
          <span className="brand-copy">
            <strong>Khmer Pride</strong>
            <small>Modern Khmer commerce</small>
          </span>
        </Link>
      </div>

      <button
        type="button"
        className="navbar-toggle"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMobileOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-links${mobileOpen ? ' open' : ''}`} aria-label="Primary navigation">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <button type="button" className="navbar-action-button" aria-label="Search">
          <span aria-hidden="true">🔍</span>
        </button>
        <Link className="navbar-action-button" to="/wishlist" aria-label="Wishlist">
          <span aria-hidden="true">♡</span>
        </Link>
        <Link className="navbar-action-button" to="/cart" aria-label="Cart">
          <span aria-hidden="true">🛒</span>
        </Link>
        {user ? (
          <>
            <Link className="navbar-pill" to="/profile">Profile</Link>
            <button type="button" className="navbar-pill navbar-pill--secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="navbar-pill navbar-pill--primary" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
