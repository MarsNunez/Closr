import { Container } from "../components/Container";
import { EmptyState } from "../components/EmptyState";
import { ExploreWorks } from "../components/ExploreWorks";
import { apiServerFetch } from "../lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Closr` : "Buscar — Closr",
  };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const works = query
    ? (await apiServerFetch(`/works?search=${encodeURIComponent(query)}`)) ?? []
    : [];

  return (
    <>
      <div className="border-b border-[color:var(--border)] px-5 py-5">
        <Container size="xl" className="px-0">
          <h1 className="text-xl font-semibold tracking-tight">
            {query ? (
              <>
                Resultados para{" "}
                <span className="text-brand-600 dark:text-brand-400">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            ) : (
              "Buscar trabajos"
            )}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {works.length > 0
              ? `${works.length} trabajo${works.length !== 1 ? "s" : ""} encontrado${works.length !== 1 ? "s" : ""}`
              : query
              ? "No encontramos nada con ese término"
              : "Escribe algo en el buscador para comenzar"}
          </p>
        </Container>
      </div>

      <div className="px-3 py-5 sm:px-5">
        {works.length === 0 ? (
          <Container size="xl" className="px-0">
            <EmptyState
              title={query ? "Sin resultados" : "Empieza a buscar"}
              description={
                query
                  ? `No hay trabajos que coincidan con "${query}". Prueba con otro término o tag.`
                  : "Usa el buscador del navbar para encontrar trabajos."
              }
            />
          </Container>
        ) : (
          <ExploreWorks serverWorks={works} />
        )}
      </div>
    </>
  );
}
