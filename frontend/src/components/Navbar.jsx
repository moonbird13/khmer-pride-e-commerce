import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="site-navbar">
      <Link className="navbar-brand" to="/">Khmer Pride</Link>
      <div className="navbar-links">
        <NavLink className="navbar-link" to="/">Home</NavLink>
        <NavLink className="navbar-link" to="/products">Products</NavLink>
        <NavLink className="navbar-link" to="/cart">Cart</NavLink>
        <NavLink className="navbar-link" to="/orders">Orders</NavLink>
        {user?.role === 'admin' ? <NavLink className="navbar-link" to="/admin-dashboard">Admin</NavLink> : null}
        {['staff', 'admin'].includes(String(user?.role || '').toLowerCase()) ? <NavLink className="navbar-link" to="/staff-dashboard">Staff</NavLink> : null}
      </div>
      <div className="navbar-actions">
        {user ? (
          <>
            <Button to="/profile" variant="secondary">Profile</Button>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button to="/login" variant="secondary">Login</Button>
            <Button to="/register">Register</Button>
          </>
        )}
      </div>
    </nav>
  );
}
