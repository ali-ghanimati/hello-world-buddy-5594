import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  logoutUser,
  registerUser,
  type AuthUser,
} from "@/services/auth";

const STORAGE_KEY = "shiko.user.v1";

export type ShikoUser = AuthUser;

interface AuthContextValue {
  user: ShikoUser | null;
  ready: boolean;
  login: (identifier: string) => Promise<void>;
  register: (name: string, identifier: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ShikoUser | null>(null);
  const [ready, setReady] = useState(false);

  /**
   * Restore the last known user from localStorage.
   *
   * This is temporary mock persistence.
   * With real WordPress authentication, this should be replaced
   * by session/token restoration.
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setUser(JSON.parse(raw) as ShikoUser);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((next: ShikoUser | null) => {
    setUser(next);

    try {
      if (next) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next),
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore localStorage failures.
    }
  }, []);

  const login = useCallback(
    async (identifier: string) => {
      const result = await loginUser({
        identifier,
      });

      persist(result.user);
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, identifier: string) => {
      const result = await registerUser({
        name,
        identifier,
      });

      persist(result.user);
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await logoutUser();

    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
    }),
    [user, ready, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
