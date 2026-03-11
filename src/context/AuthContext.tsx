import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SignupFormData, LoginFormData } from '../types';
import { STORAGE_KEYS } from '../constants';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  signup: (formData: SignupFormData) => Promise<void>;
  login: (formData: LoginFormData) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
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

  useEffect(() => {
    checkAuth();
  }, []);

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

  const checkAuth = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const storedUser = localStorage.getItem(STORAGE_KEYS.authUser);

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Optionally verify token with /auth/me
        const res = await api.auth.getMe(token);
        if (res.success) {
          setUser(res.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      }
    }
  };

  const signup = async (formData: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.auth.register(formData);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
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
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
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
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.authToken, res.token);
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
