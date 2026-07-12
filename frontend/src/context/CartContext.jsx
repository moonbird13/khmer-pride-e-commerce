import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { orders as initialOrders } from '../data/orders';

const CartContext = createContext(null);

const readStoredState = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStoredState('khmer-pride-cart', []));
  const [orders, setOrders] = useState(() => readStoredState('khmer-pride-orders', initialOrders));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('khmer-pride-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem('khmer-pride-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);
      if (existing) {
        return currentItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          quantity,
          description: product.description || '',
          image: product.image || '🛍️',
        },
      ];
    });

    setToast({ type: 'success', message: `${product.name} added to cart.` });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = ({ fullName, email, address, city, paymentMethod }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 6 : 0;
    const total = subtotal + shipping;
    const newOrder = {
      id: `order-${Date.now()}`,
      status: 'Processing',
      total,
      customerName: fullName,
      email,
      address,
      city,
      paymentMethod,
      createdAt: new Date().toLocaleDateString(),
      items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    clearCart();
    setToast({ type: 'success', message: 'Order placed successfully.' });
    return newOrder;
  };

  const value = useMemo(() => ({
    cartItems,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    orders,
    toast,
    setToast,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  }), [cartItems, orders, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
