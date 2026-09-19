"use client";

<<<<<<< HEAD
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
=======
import React, { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes?: string[];
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themes: ["light", "dark", "system"],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const value: ThemeProviderState = {
    theme: defaultTheme,
    themes: ["light", "dark", "system"],
    setTheme: (newTheme: Theme) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, newTheme);
          const root = document.documentElement;
          if (newTheme === "system") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.remove("light", "dark");
            root.classList.add(isDark ? "dark" : "light");
          } else {
            root.classList.remove("light", "dark");
            root.classList.add(newTheme);
          }
        } catch {
          // safe fallback
        }
      }
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    return initialState;
  }
  return context;
};

>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
