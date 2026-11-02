// Complete the ThemeProvider component

"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "booknook-theme";

// Pure helper function: applies 'dark' class to <html> based on choice or OS preference
function applyTheme(targetTheme: Theme) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const isDark =
    targetTheme === "dark" || (targetTheme === "system" && systemPrefersDark);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  // Change theme, save to localStorage, and apply immediately
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  // Load saved theme on initial mount
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system";
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    // Listen to OS system color-scheme changes when in 'system' mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current =
        (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Simple custom hook to read and update theme anywhere in the app
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
