"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { Avatar } from "./Avatar";
import { Button, LinkButton } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavSearch } from "./NavSearch";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/cn";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-background/90 backdrop-blur-md">
      <Container size="xl" className="flex h-[60px] items-center gap-3">

        {/* Left — logo + nav */}
        <div className="flex shrink-0 items-center gap-1">
          <Logo />

          {status === "authenticated" && (
            <nav className="hidden items-center gap-0.5 sm:flex ml-4" aria-label="Navegación">
              <NavLink href="/" active={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/feed" active={pathname === "/feed" || pathname.startsWith("/feed/")}>
                Feed
              </NavLink>
            </nav>
          )}

          {status === "unauthenticated" && (
            <nav className="hidden items-center gap-0.5 sm:flex ml-4" aria-label="Navegación">
              <NavLink href="/explore" active={pathname === "/explore" || pathname.startsWith("/explore/")}>
                Explorar
              </NavLink>
            </nav>
          )}
        </div>

        {/* Center — search bar, fills all space between nav and right buttons */}
        {status === "authenticated" && (
          <NavSearch className="hidden sm:block flex-1" />
        )}

        {/* Right */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {status === "loading" ? (
            <div className="h-8 w-28 animate-pulse rounded-full bg-muted" />
          ) : status === "authenticated" && user ? (
            <>
              {/* Crear button → /new/work */}
              <LinkButton
                href="/new/work"
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <PlusIcon />
                Crear
              </LinkButton>

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-colors hover:bg-muted",
                    menuOpen && "bg-muted",
                  )}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <Avatar username={user.username} size="sm" />
                  <span className="hidden text-sm font-medium sm:inline">{user.username}</span>
                  <ChevronIcon className={cn("hidden sm:block transition-transform", menuOpen && "rotate-180")} />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-card shadow-xl"
                    >
                      <div className="border-b border-[color:var(--border)] px-4 py-3">
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex flex-col py-1 text-sm">
                        <MenuLink href={`/u/${user.id}`} onClick={() => setMenuOpen(false)}>
                          Mi perfil
                        </MenuLink>
                        <MenuLink href="/new/work" onClick={() => setMenuOpen(false)} className="sm:hidden">
                          Crear trabajo
                        </MenuLink>
                        <div className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-muted-foreground">Tema</span>
                          <ThemeToggle />
                        </div>
                        <div className="my-1 border-t border-[color:var(--border)]" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="px-4 py-2.5 text-left text-red-500 hover:bg-muted"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : status === "unauthenticated" ? (
            <>
              <ThemeToggle compact />
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
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function MenuLink({ href, onClick, className, children }) {
  return (
    <Link href={href} onClick={onClick} className={cn("px-4 py-2.5 hover:bg-muted", className)}>
      {children}
    </Link>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
