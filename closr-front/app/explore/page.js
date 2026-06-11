import { Container } from "../components/Container";
import { WorkCard } from "../components/WorkCard";
import { EmptyState } from "../components/EmptyState";
import { LinkButton } from "../components/Button";
import { apiServerFetch } from "../lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explorar — Closr" };

export default async function ExplorePage() {
  const works = (await apiServerFetch("/works")) || [];

  return (
    <Container size="xl" className="py-12 sm:py-16">
      <header className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Explorar trabajos
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Descubre el trabajo de los creadores y encuentra a quién seguir.
        </p>
      </header>

      {works.length === 0 ? (
        <EmptyState
          title="Aún no hay nada que mostrar"
          description="Sé el primero en publicar un trabajo y aparecer aquí."
          action={<LinkButton href="/new/work">Subir trabajo</LinkButton>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </Container>
  );
}
