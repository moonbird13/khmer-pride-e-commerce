import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('khmer-pride-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('khmer-pride-token');
    const savedUser = localStorage.getItem('khmer-pride-user');
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const response = await api.post('/auth/login', {
      identifier,
      password,
    });

    const { accessToken, user: loggedUser } = response.data;

    localStorage.setItem('khmer-pride-token', accessToken);
    localStorage.setItem('khmer-pride-user', JSON.stringify(loggedUser));
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(loggedUser);

    return response.data;
  };

  const loginStaff = async (identifier, password) => {
    const response = await api.post('/auth/staff-login', {
      identifier,
      password,
    });

    const { accessToken, user: loggedUser } = response.data;

    localStorage.setItem('khmer-pride-token', accessToken);
    localStorage.setItem('khmer-pride-user', JSON.stringify(loggedUser));
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(loggedUser);

    return response.data;
  };

  const register = async ({ fullName, email, phone, password }) => {
    const response = await api.post('/auth/register', { fullName, email, phone, password });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors and clear local state.
    }

    localStorage.removeItem('khmer-pride-token');
    localStorage.removeItem('khmer-pride-user');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, loginStaff, register, logout, api }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
