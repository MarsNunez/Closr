"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "closr.theme";

const ThemeContext = createContext({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
});

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
  return resolved;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolved, setResolved] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || "system";
    setThemeState(stored);
    setResolved(applyTheme(stored));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = localStorage.getItem(STORAGE_KEY) || "system";
      if (current === "system") setResolved(applyTheme("system"));
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    setResolved(applyTheme(next));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Inline script for <head> — prevents flash of wrong theme */
export const themeScript = `(function(){try{var t=localStorage.getItem('closr.theme')||'system';var d=document.documentElement;var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;if(r==='dark'){d.classList.add('dark')}else{d.classList.add('light')}}catch(e){}})();`;
