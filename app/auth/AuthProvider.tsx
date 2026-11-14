"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  telegram: string | null;
  avatar: string | null;
};

export type AuthCredentials = { email: string; password: string; name?: string; surname?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  // Each action returns an error message, or null on success.
  login: (body: AuthCredentials) => Promise<string | null>;
  register: (body: AuthCredentials) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readError(res: Response): Promise<string> {
  const data: { detail?: unknown } = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    // FastAPI validation errors: show the first message.
    const first = data.detail[0] as { msg?: string };
    if (first.msg) return first.msg;
  }
  return `Request failed (${res.status})`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/auth/me", { cache: "no-store" })
      .then(async (res) => (res.ok ? ((await res.json()) as AuthUser) : null))
      .catch(() => null)
      .then((current) => {
        if (!cancelled) {
          setUser(current);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(async (path: "login" | "register", body: AuthCredentials) => {
    try {
      const res = await fetch(`/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return readError(res);
      const data: { user: AuthUser } = await res.json();
      setUser(data.user);
      return null;
    } catch {
      return "Could not reach the server. Please try again.";
    }
  }, []);

  const login = useCallback((body: AuthCredentials) => submit("login", body), [submit]);
  const register = useCallback((body: AuthCredentials) => submit("register", body), [submit]);

  const logout = useCallback(async () => {
    await fetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
