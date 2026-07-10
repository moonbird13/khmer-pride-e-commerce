import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import StaffDashboardPage from './pages/StaffDashboardPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-shell">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell><HomePage /></AppShell>} />
          <Route path="/products" element={<AppShell><ProductsPage /></AppShell>} />
          <Route path="/products/:id" element={<AppShell><ProductDetailPage /></AppShell>} />
          <Route path="/cart" element={<ProtectedRoute><AppShell><CartPage /></AppShell></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><AppShell><CheckoutPage /></AppShell></ProtectedRoute>} />
          <Route path="/login" element={<AppShell><AuthPage /></AppShell>} />
          <Route path="/register" element={<AppShell><AuthPage /></AppShell>} />
          <Route path="/profile" element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><AppShell><OrdersPage /></AppShell></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AppShell><AdminDashboardPage /></AppShell></ProtectedRoute>} />
          <Route path="/staff-dashboard" element={<ProtectedRoute><AppShell><StaffDashboardPage /></AppShell></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AppShell><div className="page-shell"><h1>Dashboard</h1><p>Protected area for Khmer Pride users.</p></div></AppShell></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
