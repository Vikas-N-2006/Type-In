// --- /context/AuthContext.tsx ---
'use client';
import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ _id: payload._id, fullName: payload.fullName, profileImageURL: payload.profileImageURL });
      }
    } catch (e) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ _id: payload._id, fullName: payload.fullName, profileImageURL: payload.profileImageURL });
    } catch (e) {
      console.error("Failed to decode token on login", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};