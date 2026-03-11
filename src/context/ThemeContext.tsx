import { createContext, useState, ReactNode, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

export const THEMES = [
  { value: 'light', label: '☀️ Light', emoji: '☀️' },
  { value: 'dark', label: '🌙 Dark', emoji: '🌙' },
  { value: 'corporate', label: '💼 Corporate', emoji: '💼' },
  { value: 'dim', label: '🌆 Dim', emoji: '🌆' },
];

export type ThemeName = typeof THEMES[number]['value'];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export { ThemeContext };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem(STORAGE_KEYS.theme) as ThemeName) || 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (t: ThemeName) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
