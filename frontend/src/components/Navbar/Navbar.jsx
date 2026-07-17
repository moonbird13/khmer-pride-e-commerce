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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Product' },
    { to: '/about', label: 'About us' },
    { to: '/contact', label: 'Contact us' },
  ];

  if (user && (user.role === 'staff' || user.role === 'admin')) {
    navLinks.push({ to: '/staff-portal', label: 'Staff Portal' });
  }

  if (user && user.role === 'admin') {
    navLinks.push({ to: '/admin-dashboard', label: 'Admin' });
  }

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
            <span className="brand-mark">KP</span>
            <span className="brand-copy">
              <strong>Khmer Pride</strong>
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
            {/* change /whishlist to /favorites */}
            <Link className="navbar-action-button" to="/favorites" aria-label="Wishlist">
              <span aria-hidden="true">♡</span>
            </Link>
            <Link className="navbar-action-button" to="/cart" aria-label="Cart">
              <span aria-hidden="true">🛒</span>
              {cartCount > 0 ? <span className="navbar-cart-count">({cartCount})</span> : null}
            </Link>
            {user ? (
              <button type="button" className="navbar-pill navbar-pill--primary" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link className="navbar-pill navbar-pill--primary" to="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className={`navbar-links${mobileOpen ? ' open' : ''}`} aria-label="Primary navigation">
        <div className="navbar-menu-inner">
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
          </div>
        </div>
      </nav>
    </header>
  );
}
