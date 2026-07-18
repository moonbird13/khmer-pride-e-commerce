import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  addToCartItem,
  clearCart as clearCartApi,
  createOrder,
  getCart as getCartApi,
  getOrders as getOrdersApi,
  removeCartItem as removeCartItemApi,
  updateCartItem as updateCartItemApi,
  cancelOrder as cancelOrderApi,
} from '../services/api';

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

const normalizeCartItem = (item) => ({
  id: item.productId ?? item.product?.id ?? item.id,
  productId: item.productId ?? item.product?.id ?? item.id,
  name: item.product?.name ?? item.name ?? 'Product',
  price: Number(item.product?.price ?? item.price ?? 0),
  quantity: Number(item.quantity ?? 1),
  description: item.product?.description ?? item.description ?? '',
  image: item.product?.image ?? '🛍️',
});

const normalizeCart = (apiCart) => {
  const items = Array.isArray(apiCart?.items) ? apiCart.items : [];
  return items.map(normalizeCartItem);
};

const normalizeOrder = (order) => ({
  id: order.id ?? order.orderId,
  userId: order.userId,
  status: order.status ?? order.orderStatus ?? 'Pending',
  total: Number(order.total ?? order.totalAmount ?? 0),
  paymentMethod: order.paymentMethod ?? 'Cash on Delivery',
  paymentStatus: order.paymentStatus ?? 'Unpaid',
  createdAt: order.createdAt ?? order.orderDate ?? new Date().toISOString(),
  items: Array.isArray(order.items) ? order.items : [],
  customerName: order.customerName,
  address: order.address,
  city: order.city,
});

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState(() => readStoredState('khmer-pride-cart', []));
  const [orders, setOrders] = useState(() => readStoredState('khmer-pride-orders', []));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('khmer-pride-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('khmer-pride-orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const loadData = async () => {
      try {
        const [cartData, ordersData] = await Promise.all([getCartApi(), getOrdersApi()]);
        setCartItems(normalizeCart(cartData));
        setOrders((ordersData || []).map(normalizeOrder));
      } catch (error) {
        console.error('Unable to load cart and orders', error);
      }
    };

    loadData();
  }, [token, user?.userId]);

  const addToCart = async (product, quantity = 1) => {
    const nextMessage = `${product.name} added to cart.`;

    if (!token || !user) {
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
      setToast({ type: 'success', message: nextMessage });
      return;
    }

    try {
      const response = await addToCartItem(product.id, quantity);
      setCartItems(normalizeCart(response));
      setToast({ type: 'success', message: nextMessage });
    } catch (error) {
      console.error('Unable to add item to cart', error);
      setToast({ type: 'error', message: 'Unable to add item to cart.' });
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!token || !user) {
      setCartItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
      return;
    }

    try {
      const response = await updateCartItemApi(id, quantity);
      setCartItems(normalizeCart(response));
    } catch (error) {
      console.error('Unable to update cart item', error);
    }
  };

  const removeFromCart = async (id) => {
    if (!token || !user) {
      setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
      return;
    }

    try {
      const response = await removeCartItemApi(id);
      setCartItems(normalizeCart(response));
    } catch (error) {
      console.error('Unable to remove cart item', error);
    }
  };

  const clearCart = async () => {
    if (!token || !user) {
      setCartItems([]);
      return;
    }

    try {
      await clearCartApi();
      setCartItems([]);
    } catch (error) {
      console.error('Unable to clear cart', error);
    }
  };

  const placeOrder = async ({ fullName, email, address, city, paymentMethod }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 6 : 0;
    const total = subtotal + shipping;

    try {
      const createdOrder = await createOrder({
        items: cartItems.map((item) => ({ productId: item.productId || item.id, price: item.price, quantity: item.quantity })),
        total,
        shippingAddress: address,
        shippingCity: city,
        paymentMethod: paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod,
      });

      const normalizedOrder = normalizeOrder(createdOrder);
      setOrders((currentOrders) => [normalizedOrder, ...currentOrders]);
      setCartItems([]);
      setToast({ type: 'success', message: 'Order placed successfully.' });
      return normalizedOrder;
    } catch (error) {
      console.error('Unable to place order', error);
      setToast({ type: 'error', message: 'Unable to place order.' });
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const updated = await cancelOrderApi(orderId);
      const normalized = normalizeOrder(updated);
      setOrders((currentOrders) => currentOrders.map((order) => (order.id === orderId ? normalized : order)));
      return normalized;
    } catch (error) {
      console.error('Unable to cancel order', error);
      throw error;
    }
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
    cancelOrder,
  }), [cartItems, orders, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
