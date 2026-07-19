import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from '../SearchBar/SearchBar.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart?.() || { cartCount: 0 };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isPortalUser = user?.role === 'staff' || user?.role === 'admin';
  const navLinks = isPortalUser
    ? [
        { to: user.role === 'admin' ? '/admin-portal' : '/staff-portal', label: user.role === 'admin' ? 'Admin Portal' : 'Staff Portal' },
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Product' },
        { to: '/about', label: 'About us' },
        { to: '/contact', label: 'Contact us' },
      ];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedValue = searchValue.trim();
    navigate(trimmedValue ? `/products?search=${encodeURIComponent(trimmedValue)}` : '/products');
    setMobileOpen(false);
  };

  useEffect(() => {
    if (location.pathname === '/products') {
      const searchParams = new URLSearchParams(location.search);
      setSearchValue(searchParams.get('search') || '');
    } else {
      setSearchValue('');
    }
  }, [location.pathname, location.search]);

  return (
    <header className="site-navbar">
      <div className="navbar-top">
        <div className="navbar-inner">
          <Link className="navbar-brand" to="/">
            <img className="brand-mark" src="/khmer-pride-logo.jpg" alt="Khmer Pride logo" />
            <span className="brand-copy">
              <strong><span className="brand-khmer">Khmer</span> <span className="brand-pride">Pride</span></strong>
            </span>
          </Link>

          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search for handmade goods, snacks, skincare..."
            />
          </form>

          <div className="navbar-actions">
            {!isPortalUser ? <><Link className="navbar-action-button" to="/favorites" aria-label="Wishlist">
              <span aria-hidden="true">♡</span>
            </Link>
            <Link className="navbar-action-button" to="/orders" aria-label="My Orders">
              <svg className="navbar-action-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" />
                <path d="M3 8h18" />
                <path d="M8 3h8v3H8z" />
                <path d="M9 13h6" />
              </svg>
            </Link>
            <Link className="navbar-action-button" to="/cart" aria-label="Cart">
              <svg className="navbar-action-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {cartCount > 0 ? <span className="navbar-cart-count">({cartCount})</span> : null}
            </Link></> : null}
            {user ? (
              <>
                {!isPortalUser ? <Link className="navbar-action-button navbar-profile-button navbar-user-action" to="/profile" aria-label="Profile">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="navbar-profile-image" />
                  ) : (
                    <span aria-hidden="true">👤</span>
                  )}
                </Link> : null}
                <button type="button" className="navbar-pill navbar-pill--primary navbar-user-action" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="navbar-pill navbar-pill--primary" to="/login">Sign in</Link>
            )}
          </div>

          <button
            type="button"
            className="navbar-toggle"
            aria-expanded={mobileOpen}
            aria-controls="navbar-mobile-menu"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav id="navbar-mobile-menu" className={`navbar-links${mobileOpen ? ' open' : ''}`} aria-label="Primary navigation">
        <div className="navbar-menu-inner">
          <div className="navbar-menu-links">
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
            {user ? (
              <div className="navbar-mobile-account">
                {!isPortalUser ? <Link to="/profile" className="navbar-link" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link> : null}
                <button
                  type="button"
                  className="navbar-link navbar-mobile-logout"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
