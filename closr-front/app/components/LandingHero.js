"use client";

import Link from "next/link";
import { Button, LinkButton } from "./Button";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";

export function LandingHero({ featuredWorks = [] }) {
  const { status } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        {/* Subtle radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklab, #3d9a66 12%, transparent), transparent)",
          }}
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center sm:py-32">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Conecta con creadores reales
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Sigue, descubre y reúnete con tus{" "}
            <span className="text-brand-500">creadores favoritos.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Closr es el espacio donde los creadores comparten su trabajo y abren
            reuniones, públicas o privadas, para conectar con su comunidad.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <LinkButton href="/explore" size="lg">
              Explorar creadores
            </LinkButton>
            {status === "unauthenticated" ? (
              <Button variant="outline" size="lg" onClick={() => openAuthModal("register")}>
                Crear cuenta gratis
              </Button>
            ) : status === "authenticated" ? (
              <LinkButton href="/feed" variant="outline" size="lg">
                Ir al feed →
              </LinkButton>
            ) : null}
          </div>
        </div>
      </section>

      {/* Featured works preview */}
      {featuredWorks.length > 0 && (
        <section className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Trabajos recientes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lo último publicado por la comunidad.
                </p>
              </div>
              <Link
                href="/explore"
                className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:inline"
              >
                Ver todo →
              </Link>
            </div>

            {/* Static grid preview for landing (non-masonic, server-rendered) */}
            <div className="columns-2 gap-2.5 sm:columns-3 lg:columns-4 xl:columns-5">
              {featuredWorks.map((work) => (
                <div key={work.id} className="mb-2.5 break-inside-avoid">
                  <Link
                    href={`/works/${work.id}`}
                    className="group block overflow-hidden rounded-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
