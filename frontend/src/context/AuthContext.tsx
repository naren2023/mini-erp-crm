import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types";
import * as authService from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("erp_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("erp_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const result = await authService.login(email, password);
        localStorage.setItem("erp_token", result.token);
        setUser({ id: result.id, name: result.name, email: result.email, role: result.role });
      },
      logout: () => {
        localStorage.removeItem("erp_token");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
