"use client";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { apiRequest } from "../lib/api";
import { cn } from "../lib/cn";

export function WorkActionButtons({
  workId,
  initialLiked = false,
  initialLikeCount = 0,
  initialSaved = false,
}) {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [saved, setSaved] = useState(initialSaved);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const requireAuth = () => {
    openAuthModal("login");
    return false;
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") { requireAuth(); return; }
    if (likeLoading) return;

    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    setLikeLoading(true);
    try {
      await apiRequest(`/works/${workId}/like`, {
        method: next ? "POST" : "DELETE",
      });
    } catch {
      setLiked(!next);
      setLikeCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") { requireAuth(); return; }
    if (saveLoading) return;

    const next = !saved;
    setSaved(next);
    setSaveLoading(true);
    try {
      await apiRequest(`/works/${workId}/save`, {
        method: next ? "POST" : "DELETE",
      });
    } catch {
      setSaved(!next);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      {/* Like button */}
      <button
        type="button"
        onClick={handleLike}
        aria-label={liked ? "Quitar like" : "Me gusta"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full shadow backdrop-blur-md transition-all duration-150",
          liked
            ? "bg-red-500/90 text-white hover:bg-red-600/90"
            : "bg-black/30 text-white hover:bg-black/50",
        )}
      >
        <HeartIcon filled={liked} className="h-3.5 w-3.5 shrink-0" />
      </button>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? "Quitar guardado" : "Guardar"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full shadow backdrop-blur-md transition-all duration-150",
          saved
            ? "bg-brand-600/90 text-white hover:bg-brand-700/90"
            : "bg-black/30 text-white hover:bg-black/50",
        )}
      >
        <BookmarkIcon filled={saved} className="h-3.5 w-3.5 shrink-0" />
      </button>
    </>
  );
}

function HeartIcon({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
