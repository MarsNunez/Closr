"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { apiRequest } from "../lib/api";
import { WorksMasonry } from "./WorksMasonry";
import { EmptyState } from "./EmptyState";

export function ProfileSavedWorks({ profileUserId }) {
  const { user, status } = useAuth();
  const [works, setWorks] = useState(null);
  const [error, setError] = useState(false);

  const isOwner = status === "authenticated" && user?.id === profileUserId;

  useEffect(() => {
    if (!isOwner) return;
    apiRequest(`/users/${profileUserId}/saved`)
      .then((data) => setWorks(Array.isArray(data) ? data : []))
      .catch(() => setError(true));
  }, [isOwner, profileUserId]);

  if (!isOwner) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-2 text-lg font-semibold tracking-tight">Guardados</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Solo tú puedes ver esta sección.
      </p>

      {works === null && !error ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">
          No se pudieron cargar los trabajos guardados.
        </p>
      ) : works.length === 0 ? (
        <EmptyState
          title="Aún no has guardado nada"
          description="Cuando guardes un trabajo, aparecerá aquí."
        />
      ) : (
        <WorksMasonry works={works} />
      )}
    </section>
  );
}
