"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NewPostModal } from "./NewPostModal";
import { cn } from "../lib/cn";

const navItems = [
  { href: "/explore", label: "Explorar" },
  { href: "/feed", label: "Feed" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  const handleNewPost = () => {
    if (status !== "authenticated") {
      openAuthModal("login");
      return;
    }
    setMenuOpen(false);
    setNewPostOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-background/80 backdrop-blur">
        <Container size="xl" className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegación">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
            ) : status === "authenticated" && user ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNewPost}
                  className="hidden sm:inline-flex"
                >
                  Nuevo post
                </Button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
                    className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-muted"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <Avatar username={user.username} size="sm" />
                    <span className="hidden text-sm font-medium sm:inline">
                      {user.username}
                    </span>
                  </button>
                  {menuOpen ? (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                      />
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-card shadow-lg"
                      >
                        <div className="border-b border-[color:var(--border)] px-4 py-3">
                          <p className="text-sm font-semibold">{user.username}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex flex-col py-1 text-sm">
                          <Link
                            href={`/u/${user.id}`}
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2 hover:bg-muted"
                          >
                            Mi perfil
                          </Link>
                          <button
                            type="button"
                            onClick={handleNewPost}
                            className="px-4 py-2 text-left hover:bg-muted sm:hidden"
                          >
                            Nuevo post
                          </button>
                          <Link
                            href="/new/work"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2 hover:bg-muted"
                          >
                            Subir trabajo
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 text-left text-red-600 hover:bg-muted"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : status === "unauthenticated" ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => openAuthModal("login")}>
                  Entrar
                </Button>
                <Button variant="primary" size="sm" onClick={() => openAuthModal("register")}>
                  Crear cuenta
                </Button>
              </>
            ) : null}
          </div>
        </Container>
      </header>

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />
    </>
  );
}
