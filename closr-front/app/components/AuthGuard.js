"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";

export function AuthGuard({ children, next }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      const target = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
      router.replace(target);
    }
  }, [status, router, next]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  return children;
}
