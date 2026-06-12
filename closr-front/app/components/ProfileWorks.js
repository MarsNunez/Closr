"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { apiRequest } from "../lib/api";
import { WorksMasonry } from "./WorksMasonry";
import { EmptyState } from "./EmptyState";

export function ProfileWorks({ userId, serverWorks }) {
  const { status } = useAuth();
  const [works, setWorks] = useState(serverWorks);

  useEffect(() => {
    if (status !== "authenticated") return;
    apiRequest(`/works/user/${userId}`)
      .then((data) => setWorks(Array.isArray(data) ? data : serverWorks))
      .catch(() => {});
  }, [status, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!works || works.length === 0) {
    return (
      <EmptyState
        title="Sin trabajos por ahora"
        description="Cuando este creador publique algo, aparecerá aquí."
      />
    );
  }

  return <WorksMasonry works={works} />;
}
