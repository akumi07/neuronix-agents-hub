import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { authService, type Credentials } from "@/services/authService";
import type { User } from "@/types/domain";

interface AuthContextValue {
  user: User | null;
  /** False until the stored session has been checked (SSR-safe). */
  ready: boolean;
  login: (credentials: Credentials, remember: boolean) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    authService
      .restore()
      .then((restored) => {
        if (active) setUser(restored);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: Credentials, remember: boolean) => {
    setUser(await authService.login(credentials, remember));
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    setUser(await authService.register(credentials));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
