import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import Products from '../pages/Products';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AuthPage from '../pages/AuthPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import FavoritesPage from '../pages/FavoritesPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import StaffDashboardPage from '../pages/StaffDashboardPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';

function ProtectedRoute({ children, requiredRole = [] }) {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/staff-login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/verify-email/:token?" element={<VerifyEmailPage />} />

      {/* Protected Routes - Customer */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute requiredRole={['customer']}>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin/Staff */}
      <Route
        path="/admin-portal"
        element={
          <ProtectedRoute requiredRole={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-portal"
        element={
          <ProtectedRoute requiredRole={['admin', 'staff']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

