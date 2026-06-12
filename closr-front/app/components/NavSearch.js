"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "../lib/cn";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function NavSearch({ className }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search — 500ms feels faster in a navbar context
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/works?search=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 6) : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToSearch = (q) => {
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    goToSearch(query);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Buscar trabajos por nombre o tag…"
          className={cn(
            "h-8 w-full rounded-full border border-[color:var(--border)] bg-muted pl-8 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-all focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30",
          )}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="block h-3 w-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </span>
        )}
      </form>

      {/* Dropdown — preview of matches, all lead to the search results page */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-card shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Sin resultados para &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {results.map((work) => (
                <li key={work.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); goToSearch(query); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {work.imageUrl && (
                        <Image
                          src={work.imageUrl}
                          alt={work.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{work.title}</p>
                      {work.author && (
                        <p className="truncate text-xs text-muted-foreground">
                          {work.author.username}
                        </p>
                      )}
                    </div>

                    {/* First tag */}
                    {work.tags?.length > 0 && (
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {work.tags[0].name}
                      </span>
                    )}
                  </button>
                </li>
              ))}

              {/* Ver todos */}
              <li className="border-t border-[color:var(--border)]">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); goToSearch(query); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-muted transition-colors dark:text-brand-400"
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                  Ver todos los resultados de &ldquo;{query}&rdquo;
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
