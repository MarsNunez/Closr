"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Textarea } from "./Input";
import { formatRelativeDate } from "../lib/format";

export function CommentSection({ postId }) {
  const { user, status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (status !== "authenticated") {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await apiRequest(`/posts/${postId}/comments`);
        if (!cancelled) setComments(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [postId, status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || posting) return;
    setPosting(true);
    setError("");
    try {
      const created = await apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        body: { content: content.trim() },
      });
      setComments((current) => [created, ...current]);
      setContent("");
    } catch (err) {
      setError(err?.message || "No pudimos publicar el comentario");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const snapshot = comments;
    setComments((current) => current.filter((c) => c.id !== commentId));
    try {
      await apiRequest(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
    } catch {
      setComments(snapshot);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--border)] p-6 text-center text-sm text-muted-foreground">
        <p>
          <button
            type="button"
            className="font-medium text-foreground underline"
            onClick={() => openAuthModal("login")}
          >
            Entra
          </button>{" "}
          para leer y dejar comentarios.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe un comentario…"
          rows={3}
          maxLength={500}
          required
        />
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={posting || !content.trim()}>
            {posting ? "Publicando…" : "Comentar"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando comentarios…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay comentarios.</p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="flex gap-3 rounded-2xl border border-[color:var(--border)] p-4"
            >
              <Avatar username={comment.user?.username} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{comment.user?.username}</span>
                  <span className="text-muted-foreground">
                    · {formatRelativeDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
              {user?.id === comment.user?.id ? (
                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted-foreground hover:text-red-600"
                >
                  Eliminar
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
