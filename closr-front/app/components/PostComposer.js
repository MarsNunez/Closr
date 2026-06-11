"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { apiRequest } from "../lib/api";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { cn } from "../lib/cn";

const MAX = 280;

export function PostComposer({ onPosted }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const handleFocus = () => {
    if (status === "unauthenticated") {
      openAuthModal("login");
      return;
    }
    setFocused(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const post = await apiRequest("/posts", {
        method: "POST",
        body: { content: content.trim() },
      });
      setContent("");
      setFocused(false);
      onPosted?.(post);
      router.refresh();
    } catch (err) {
      setError(err?.message || "No pudimos publicar el post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setFocused(false);
    setError("");
    textareaRef.current?.blur();
  };

  const remaining = MAX - content.length;
  const nearLimit = remaining <= 40;
  const overLimit = remaining < 0;

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-card px-4 py-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* Avatar */}
          {status === "authenticated" && user ? (
            <Avatar username={user.username} size="md" className="mt-0.5 shrink-0" />
          ) : (
            <div className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-muted" />
          )}

          {/* Input area */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX))}
              onFocus={handleFocus}
              placeholder={
                status === "authenticated"
                  ? "¿Qué quieres compartir?"
                  : "Entra para publicar…"
              }
              rows={focused ? 4 : 2}
              className={cn(
                "w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60",
                "focus:outline-none transition-all duration-200",
              )}
              readOnly={status !== "authenticated"}
            />

            {/* Divider */}
            {focused && (
              <div className="mt-2 border-t border-[color:var(--border)]" />
            )}

            {/* Actions */}
            {focused && (
              <div className="mt-3 flex items-center justify-between gap-3">
                {/* Counter */}
                <div className="flex items-center gap-2">
                  {nearLimit && (
                    <span
                      className={cn(
                        "text-xs tabular-nums font-medium",
                        overLimit ? "text-red-500" : "text-muted-foreground",
                      )}
                    >
                      {remaining}
                    </span>
                  )}
                  {nearLimit && (
                    <svg viewBox="0 0 36 36" className="h-6 w-6 -rotate-90">
                      <circle
                        cx="18" cy="18" r="15"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18" cy="18" r="15"
                        fill="none"
                        stroke={overLimit ? "#ef4444" : "#3d9a66"}
                        strokeWidth="3"
                        strokeDasharray={`${Math.max(0, (content.length / MAX) * 94.2)} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {error && (
                    <span className="text-xs text-red-500">{error}</span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || !content.trim() || overLimit}
                  >
                    {submitting ? "Publicando…" : "Publicar"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
