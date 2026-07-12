import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { users as mockUsers } from '../data/users';

const AuthContext = createContext(null);

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
    const matchedUser = mockUsers.find((entry) => entry.email === email && entry.password === password);
    if (!matchedUser) {
      throw new Error('Invalid credentials.');
    }

    const accessToken = `demo-token-${matchedUser.id}`;
    const loggedUser = { id: matchedUser.id, fullName: matchedUser.fullName, email: matchedUser.email, role: matchedUser.role };

    localStorage.setItem('khmer-pride-token', accessToken);
    localStorage.setItem('khmer-pride-user', JSON.stringify(loggedUser));
    setToken(accessToken);
    setUser(loggedUser);
    return { accessToken, user: loggedUser };
  };

  const register = async (fullName, email, password) => {
    const nextUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      password,
      role: 'customer',
    };
    mockUsers.push(nextUser);
    return { user: { id: nextUser.id, fullName, email, role: 'customer' } };
  };

  const logout = async () => {
    localStorage.removeItem('khmer-pride-token');
    localStorage.removeItem('khmer-pride-user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
