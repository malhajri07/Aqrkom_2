import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  first_name_ar?: string;
  last_name_ar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info (payload is base64)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserState({
          id: payload.userId,
          email: payload.email,
          role: payload.role,
        });
      } catch {
        setAuthToken(null);
        setTokenState(null);
      }
    } else {
      setUserState(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { auth } = await import('../lib/api');
    const res = await auth.login(email, password);
    setAuthToken(res.token);
    setTokenState(res.token);
    setUserState(res.user as User);
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUserState(null);
  };

  const setUser = (u: User | null) => setUserState(u);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
