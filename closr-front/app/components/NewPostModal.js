"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./Modal";
import { Button } from "./Button";
import { Field, Textarea } from "./Input";
import { Avatar } from "./Avatar";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

const MAX = 280;

export function NewPostModal({ open, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setContent("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/posts", {
        method: "POST",
        body: { content: content.trim() },
      });
      onClose?.();
      if (user?.id) {
        router.push(`/u/${user.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err?.message || "No pudimos publicar el post");
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Nuevo post" onClose={onClose} />
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar username={user.username} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-muted-foreground">Publicando como tú</p>
              </div>
            </div>
          ) : null}

          <Field
            hint={`${content.length}/${MAX}`}
            error={error || undefined}
          >
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value.slice(0, MAX))}
              rows={5}
              placeholder="¿Qué quieres compartir?"
              required
              autoFocus
            />
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting || !content.trim()}>
            {submitting ? "Publicando…" : "Publicar"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
