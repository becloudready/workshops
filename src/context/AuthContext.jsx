import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import * as api from "../api/api";

const TOKEN_KEY = "banking_access_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // Starts true so route guards wait for the session check instead of
  // bouncing an authenticated user to /login on every refresh.
  const [restoring, setRestoring] = useState(
    () => Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);

    if (!stored) {
      return;
    }

    let cancelled = false;

    api
      .getCurrentUser(stored)
      .then((restoredUser) => {
        if (cancelled) return;
        setUser(restoredUser);
        setToken(stored);
      })
      .catch(() => {
        if (cancelled) return;
        // Token expired, revoked, or signed with an old secret.
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback((payload) => {
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    setToken(payload.access_token);
    setUser(payload.user);
    return payload.user;
  }, []);

  const login = useCallback(
    async (email, password) => applySession(await api.login(email, password)),
    [applySession],
  );

  const register = useCallback(
    async (details) => applySession(await api.register(details)),
    [applySession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, restoring, isAuthenticated: Boolean(user), login, register, logout }),
    [user, token, restoring, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return context;
}
