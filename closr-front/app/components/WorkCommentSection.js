"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { apiRequest } from "../lib/api";
import { apiServerFetch } from "../lib/api";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { formatDate } from "../lib/format";
import { cn } from "../lib/cn";

export function WorkCommentSection({ workId }) {
  const { user, status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [comments, setComments] = useState(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/works/${workId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [workId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const comment = await apiRequest(`/works/${workId}/comments`, {
        method: "POST",
        body: { content: content.trim() },
      });
      setComments((prev) => [comment, ...(prev ?? [])]);
      setContent("");
    } catch (err) {
      setError(err?.message || "No se pudo publicar el comentario");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try {
      await apiRequest(`/works/${workId}/comments/${commentId}`, {
        method: "DELETE",
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // silent
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight">
        Comentarios{comments != null && comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      {/* Compose */}
      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <Avatar username={user?.username} size="sm" className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe un comentario…"
              rows={2}
              className="w-full resize-none rounded-xl border border-[color:var(--border)] bg-muted px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <div className="mt-2 flex justify-end">
              <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
                {submitting ? "Enviando…" : "Comentar"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          <button
            type="button"
            className="font-medium text-foreground underline"
            onClick={() => openAuthModal("login")}
          >
            Entra
          </button>{" "}
          para dejar un comentario.
        </p>
      )}

      {/* List */}
      <div className="mt-6 space-y-5">
        {comments === null ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay comentarios. ¡Sé el primero!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar username={comment.user?.username} size="sm" className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{comment.user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed">{comment.content}</p>
              </div>
              {user?.id === comment.user?.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  className="shrink-0 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Eliminar comentario"
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
