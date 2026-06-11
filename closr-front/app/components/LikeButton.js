"use client";

import { useState } from "react";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { cn } from "../lib/cn";

export function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const handleToggle = async () => {
    if (status !== "authenticated") {
      openAuthModal("login");
      return;
    }
    if (pending) return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((current) => current + (nextLiked ? 1 : -1));
    setPending(true);

    try {
      await apiRequest(`/posts/${postId}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      });
    } catch {
      setLiked(!nextLiked);
      setCount((current) => current + (nextLiked ? -1 : 1));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm transition-colors",
        liked
          ? "text-red-600"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      aria-pressed={liked}
      aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
    >
      <HeartIcon filled={liked} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
