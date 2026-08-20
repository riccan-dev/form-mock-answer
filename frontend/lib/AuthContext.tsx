'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getDepartmentName } from './departments';

export type AuthUser = {
  esqId: string;
  userName: string;
  deptId: number;
  department: string;
};

type LoginResult = { ok: true } | { ok: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (esqId: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAuthUser(data: { esqId: string; userName: string; deptId: number }): AuthUser {
  return { ...data, department: getDepartmentName(data.deptId) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data ? toAuthUser(data) : null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (esqId: string, password: string): Promise<LoginResult> => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ esqId, password }),
    });
    if (!res.ok) {
      return { ok: false, message: 'IDまたはパスワードが正しくありません。' };
    }
    const data = await res.json();
    setUser(toAuthUser(data));
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
