import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  profession?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const TOKEN_KEY = "growdoctor_token";
const USER_KEY = "growdoctor_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

function readUser(): AuthUser | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  const login = useCallback((nextUser: AuthUser, nextToken: string) => {
    if (isBrowser) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    }
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    if (isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Guest carts are local-only, so clear it too on logout for a clean slate.
      localStorage.removeItem("growdoctor_cart");
    }
    setUser(null);
    setToken(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
