"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

const MAX_TAGS = 10;
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function TagPicker({ value = [], onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search — fires 1 second after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/tags?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        const filtered = (Array.isArray(data) ? data : []).filter(
          (tag) => !value.some((v) => v.id === tag.id),
        );
        setResults(filtered);
        setOpen(filtered.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTag = (tag) => {
    if (value.length >= MAX_TAGS) return;
    if (value.some((v) => v.id === tag.id)) return;
    onChange([...value, tag]);
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagId) => {
    onChange(value.filter((v) => v.id !== tagId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !query && value.length > 0) {
      removeTag(value[value.length - 1].id);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Clicking the container border/padding focuses the input
  // Use onMouseDown + preventDefault to avoid interfering with chip × buttons
  const handleContainerMouseDown = (e) => {
    // If the click target is the × button or the chip itself, do nothing
    if (e.target.closest("[data-tag-remove]")) return;
    // Prevent the default to avoid blurring the input, then focus it
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Tags + input box */}
      <div
        onMouseDown={handleContainerMouseDown}
        className={cn(
          "flex min-h-[42px] flex-wrap gap-1.5 rounded-xl border border-[color:var(--border)] bg-muted px-3 py-2 cursor-text",
          "transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/30",
        )}
      >
        {value.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 select-none"
          >
            {tag.name}
            <button
              data-tag-remove="true"
              type="button"
              // onPointerDown fires before the input loses focus, so the tag
              // gets removed without flickering or clearing other state
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeTag(tag.id);
              }}
              className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-brand-600 hover:bg-brand-200 hover:text-brand-900 dark:text-brand-400 dark:hover:bg-brand-800 dark:hover:text-brand-200 transition-colors"
              aria-label={`Quitar tag ${tag.name}`}
            >
              ×
            </button>
          </span>
        ))}

        {value.length < MAX_TAGS && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={value.length === 0 ? "Busca un tag…" : ""}
            className="min-w-[120px] flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        )}
      </div>

      {/* Helper text */}
      <p className="mt-1 text-xs text-muted-foreground">
        {value.length}/{MAX_TAGS} tags
        {value.length < MAX_TAGS && query.trim() && loading && (
          <span className="ml-2 animate-pulse">Buscando…</span>
        )}
      </p>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[color:var(--border)] bg-card py-1 shadow-lg">
          {results.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(tag); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
