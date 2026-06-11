import Link from "next/link";
import { Container } from "./components/Container";
import { WorkCard } from "./components/WorkCard";
import { HomeHeroActions } from "./components/HomeHeroActions";
import { apiServerFetch } from "./lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const works = (await apiServerFetch("/works")) || [];
  const featured = works.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--foreground) 6%, transparent), transparent)",
          }}
        />
        <Container size="lg" className="py-24 sm:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Conecta con creadores reales
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Sigue, descubre y reúnete con tus creadores favoritos.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Closr es el espacio donde los creadores comparten su trabajo y abren
              reuniones, públicas o privadas, para conectar con su comunidad.
            </p>
            <HomeHeroActions />
          </div>
        </Container>
      </section>

      <Container size="xl" className="py-16 sm:py-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Trabajos recientes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Una selección de lo último publicado por la comunidad.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            Ver todo →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--border)] py-20 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay trabajos publicados. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
