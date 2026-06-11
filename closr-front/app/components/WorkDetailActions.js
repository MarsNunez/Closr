"use client";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { apiRequest } from "../lib/api";
import { cn } from "../lib/cn";

export function WorkDetailActions({
  workId,
  initialLiked = false,
  initialLikeCount = 0,
  initialSaved = false,
  initialSaveCount = 0,
}) {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [saved, setSaved] = useState(initialSaved);
  const [saveCount, setSaveCount] = useState(initialSaveCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const requireAuth = () => openAuthModal("login");

  const handleLike = async () => {
    if (status !== "authenticated") { requireAuth(); return; }
    if (likeLoading) return;
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    setLikeLoading(true);
    try {
      await apiRequest(`/works/${workId}/like`, { method: next ? "POST" : "DELETE" });
    } catch {
      setLiked(!next);
      setLikeCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (status !== "authenticated") { requireAuth(); return; }
    if (saveLoading) return;
    const next = !saved;
    setSaved(next);
    setSaveCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    setSaveLoading(true);
    try {
      await apiRequest(`/works/${workId}/save`, { method: next ? "POST" : "DELETE" });
    } catch {
      setSaved(!next);
      setSaveCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        onClick={handleLike}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
          liked
            ? "border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
            : "border-[color:var(--border)] bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <HeartIcon filled={liked} className="h-4 w-4" />
        <span>{likeCount > 0 ? likeCount : "Me gusta"}</span>
      </button>

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
          saved
            ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-400"
            : "border-[color:var(--border)] bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <BookmarkIcon filled={saved} className="h-4 w-4" />
        <span>{saved ? "Guardado" : "Guardar"}</span>
      </button>
    </div>
  );
}

function HeartIcon({ filled, className }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled, className }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
