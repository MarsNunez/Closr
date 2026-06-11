"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/Container";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/Button";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { cn } from "../lib/cn";

const TABS = [
  { id: "for-you", label: "Para ti" },
  { id: "following", label: "Siguiendo" },
];

export default function FeedPage() {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [tab, setTab] = useState("for-you");
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (tab === "following" && status !== "authenticated") {
      setPosts([]);
      setError("");
      return;
    }

    let cancelled = false;
    setPosts(null);
    setError("");

    const path = tab === "for-you" ? "/posts" : "/feed";
    apiRequest(path, { auth: "auto" })
      .then((response) => {
        if (cancelled) return;
        setPosts(Array.isArray(response) ? response : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Error cargando el feed");
        setPosts([]);
      });

    return () => { cancelled = true; };
  }, [tab, status]);

  const handlePosted = (newPost) => {
    setPosts((current) =>
      current ? [newPost, ...current] : [newPost],
    );
  };

  const showLoginCta = tab === "following" && status === "unauthenticated";

  return (
    <Container size="md" className="py-8 sm:py-12">
      {/* Post composer */}
      <PostComposer onPosted={handlePosted} />

      {/* Tabs */}
      <div className="mt-6 flex border-b border-[color:var(--border)]">
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "relative flex-1 px-4 py-3 text-sm font-medium transition-colors sm:flex-none",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {isActive && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-5">
        {showLoginCta ? (
          <EmptyState
            title="Inicia sesión para ver lo de tus seguidos"
            description="Sigue a tus creadores favoritos y revisa aquí lo que publican."
            action={<Button onClick={() => openAuthModal("login")}>Entrar</Button>}
          />
        ) : error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        ) : posts === null ? (
          <FeedSkeleton />
        ) : posts.length === 0 ? (
          <EmptyState
            title={tab === "following" ? "Tu feed de seguidos está vacío" : "Aún no hay posts"}
            description={
              tab === "following"
                ? "Empieza a seguir creadores para ver su actividad aquí."
                : "Sé el primero en publicar algo."
            }
            action={
              tab === "for-you" ? null : (
                <Link href="/explore" className="text-sm font-medium text-foreground underline">
                  Explorar creadores
                </Link>
              )
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-2xl border border-[color:var(--border)] bg-muted/50"
        />
      ))}
    </div>
  );
}
