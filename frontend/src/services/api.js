import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('khmer-pride-token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getCategories = async () => {
  const { data } = await api.get('/categories');
  return Array.isArray(data) ? data : data.categories || [];
};

const getProducts = async () => {
  const { data } = await api.get('/products');
  return Array.isArray(data) ? data : data.products || [];
};

const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

const login = async (identifier, password) => {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data;
};

const register = async ({ fullName, email, phone, password }) => {
  const { data } = await api.post('/auth/register', { fullName, email, phone, password });
  return data;
};

const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

const resetPassword = async (token, newPassword) => {
  const { data } = await api.post('/auth/reset-password', { token, newPassword });
  return data;
};

const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
};

const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

const addToCartItem = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart', { productId, quantity });
  return data;
};

const updateCartItem = async (productId, quantity) => {
  const { data } = await api.patch(`/cart/items/${productId}`, { quantity });
  return data;
};

const updateProfile = async (formData) => {
  const { data } = await api.patch('/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/items/${productId}`);
  return data;
};

const clearCart = async () => {
  const { data } = await api.delete('/cart');
  return data;
};

const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

const getOrders = async () => {
  const { data } = await api.get('/orders');
  return Array.isArray(data) ? data : data.orders || [];
};

// --------------------------------------
// Favorite
//---------------------------------------
// Get all favorite products
const getFavorites = async () => {
  const { data } = await api.get(`/favorites`);
  return data.data || [];
};

// Add product to favorite
const addFavorite = async (productId) => {
  const { data } = await api.post(`/favorites/`, {
    productId,
  });

  return data;
};

// Remove product from favorite
const removeFavorite = async (productId) => {
  const { data } = await api.delete(`/favorites/${productId}`);
  return data;
};

export {
  api,
  setAuthToken,
  getCategories,
  getProducts,
  getProductById,
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getCart,
  addToCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  getOrders,
  getFavorites,
  addFavorite,
  removeFavorite,
  updateProfile,
};

export default api;
