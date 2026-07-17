import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart?.() || { cartCount: 0 };
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <div className="navbar-brand-wrap">
          <Link className="navbar-brand" to="/">
            <span className="brand-mark">KP</span>
            <span className="brand-copy">
              <strong>Khmer Pride</strong>
              <small>Proud. Local. Authentic.</small>
            </span>
          </Link>
        </div>

        <button
          type="button"
          className={`navbar-toggle${mobileOpen ? ' open' : ''}`}
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

        <div className="navbar-search">
          <input
            type="search"
            className="navbar-search-input"
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>

        <div className="navbar-actions">
          <Link className="navbar-icon-button" to="/cart" aria-label="Shopping cart" title="Shopping cart">
            <span>🛒</span>
            {cartCount > 0 && <span className="navbar-icon-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link className="navbar-button navbar-button-secondary" to="/profile">
                Profile
              </Link>
              <button type="button" className="navbar-button navbar-button-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="navbar-button navbar-button-primary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
