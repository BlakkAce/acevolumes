"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The inline script in layout.tsx has already resolved the theme and written
  // it to documentElement before hydration, so we can read it once here instead
  // of syncing it from an effect (which would cost a second render).
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    const current = document.documentElement.dataset.theme;
    return current === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("av-theme", next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
