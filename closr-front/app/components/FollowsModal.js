"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal, ModalBody, ModalHeader } from "./Modal";
import { Avatar } from "./Avatar";
import { FollowButton } from "./FollowButton";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export function FollowsModal({ open, onClose, userId, type = "followers" }) {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !userId) return;
    let cancelled = false;
    setItems(null);
    setError("");

    const path =
      type === "followers"
        ? `/follows/${userId}/followers`
        : `/follows/${userId}/following`;

    apiRequest(path, { auth: "none" })
      .then((data) => {
        if (cancelled) return;
        const normalized = Array.isArray(data)
          ? data.map((row) =>
              type === "followers" ? row.follower : row.following,
            )
          : [];
        setItems(normalized);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "No pudimos cargar la lista");
          setItems([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, userId, type]);

  const title = type === "followers" ? "Seguidores" : "Siguiendo";
  const empty =
    type === "followers"
      ? "Aún no tiene seguidores."
      : "Aún no sigue a nadie.";

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody className="px-0 py-0">
        {items === null ? (
          <div className="flex flex-col gap-2 p-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-muted/50"
              />
            ))}
          </div>
        ) : error ? (
          <p className="px-5 py-6 text-sm text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            {empty}
          </p>
        ) : (
          <ul className="divide-y divide-[color:var(--border)]">
            {items.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <Link
                  href={`/u/${person.id}`}
                  onClick={onClose}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <Avatar username={person.username} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold hover:underline">
                      {person.username}
                    </p>
                  </div>
                </Link>
                {user?.id !== person.id ? (
                  <FollowButton userId={person.id} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </ModalBody>
    </Modal>
  );
}
