import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('weavind_user');
    return saved ? JSON.parse(saved) : null;
  });

  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    setUser(response.data);
    localStorage.setItem('weavind_user', JSON.stringify(response.data));
    return response.data;
  };

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    setUser(response.data);
    localStorage.setItem('weavind_user', JSON.stringify(response.data));
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('weavind_user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}