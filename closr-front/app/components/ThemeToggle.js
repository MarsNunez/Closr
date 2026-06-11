"use client";

import { useTheme } from "../providers/ThemeProvider";
import { cn } from "../lib/cn";
import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  {
    id: "light",
    label: "Claro",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    id: "dark",
    label: "Oscuro",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "Sistema",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

export function ThemeToggle({ compact = false }) {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const current = OPTIONS.find((o) => o.id === theme) ?? OPTIONS[2];
  const resolvedIcon = resolved === "dark" ? OPTIONS[1].icon : OPTIONS[0].icon;

  if (compact) {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {resolvedIcon}
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-[color:var(--border)] bg-card py-1 shadow-lg">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setTheme(opt.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted",
                  theme === opt.id ? "text-brand-500 font-medium" : "text-foreground",
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setTheme(opt.id)}
          title={opt.label}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
            theme === opt.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
