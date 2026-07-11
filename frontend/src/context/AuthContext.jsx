import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}`,
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('khmer-pride-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('khmer-pride-token');
    const savedUser = localStorage.getItem('khmer-pride-user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user: loggedUser } = response.data;
    localStorage.setItem('khmer-pride-token', accessToken);
    localStorage.setItem('khmer-pride-user', JSON.stringify(loggedUser));
    setToken(accessToken);
    setUser(loggedUser);
    return response.data;
  };

  const register = async (fullName, email, password) => api.post('/auth/register', { fullName, email, password });

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('khmer-pride-token');
      localStorage.removeItem('khmer-pride-user');
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, api }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
