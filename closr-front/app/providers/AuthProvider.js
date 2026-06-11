"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchMe, loginRequest, logoutRequest, registerRequest } from "../lib/auth";
import { getAccessToken } from "../lib/tokens";

const AuthContext = createContext({
  user: null,
  status: "loading",
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    try {
      const me = await fetchMe();
      setUser(me);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (credentials) => {
      await loginRequest(credentials);
      await loadUser();
    },
    [loadUser],
  );

  const register = useCallback(
    async (payload) => {
      await registerRequest(payload);
      await loginRequest({ email: payload.email, password: payload.password });
      await loadUser();
    },
    [loadUser],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, login, register, logout, refresh: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
