import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthState, SignupFormData, LoginFormData } from '../types';
import { STORAGE_KEYS } from '../constants';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  signup: (formData: SignupFormData) => Promise<User>;
  login: (formData: LoginFormData) => Promise<User>;
  googleLogin: (token: string) => Promise<User>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { AuthContextType };
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const normalizeUser = (payload: any): User | null => {
    if (!payload) return null;
    const normalizedId = String(payload.id ?? payload._id ?? '');
    if (!normalizedId) return null;

    return {
      ...payload,
      id: normalizedId,
      _id: payload._id ? String(payload._id) : normalizedId,
      status: payload.status || 'active',
    } as User;
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const storedUser = localStorage.getItem(STORAGE_KEYS.authUser);

    if (token && storedUser) {
      try {
        setIsLoading(true);
        const parsedUser = normalizeUser(JSON.parse(storedUser));
        if (parsedUser) {
          setUser(parsedUser);
        }

        const res = await api.auth.getMe(token);
        if (res.success) {
          const currentUser = normalizeUser(res.data);
          if (currentUser) {
            setUser(currentUser);
          } else {
            logout();
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(STORAGE_KEYS.authUser);
      localStorage.removeItem(STORAGE_KEYS.authToken);
      setIsAuthenticated(false);
    }
  }, [user]);

  const signup = async (formData: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.auth.register(formData);
      const normalizedUser = normalizeUser(res.user);
      if (!normalizedUser) {
        throw new Error('Unable to initialize user session');
      }
      setUser(normalizedUser);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
      return normalizedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.auth.login(formData);
      const normalizedUser = normalizeUser(res.user);
      if (!normalizedUser) {
        throw new Error('Unable to initialize user session');
      }
      setUser(normalizedUser);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
      return normalizedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authUser);
  };

  const googleLogin = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.auth.googleLogin(token);
      const normalizedUser = normalizeUser(res.user);
      if (!normalizedUser) {
        throw new Error('Unable to initialize user session');
      }
      setUser(normalizedUser);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
      return normalizedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    signup,
    login,
    googleLogin,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
