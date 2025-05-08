"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme } from 'next-themes';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Après le montage du composant, nous pouvons accéder à window
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mettre à jour l'état local quand le thème change
  useEffect(() => {
    if (mounted) {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext; 