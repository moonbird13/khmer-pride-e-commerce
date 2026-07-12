import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Toast from './components/Toast/Toast.jsx';
import './App.css';

function AppContent() {
  const { toast, setToast } = useCart();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
