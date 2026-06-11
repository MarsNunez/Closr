import { Container } from "../components/Container";
import { WorksMasonry } from "../components/WorksMasonry";
import { EmptyState } from "../components/EmptyState";
import { LinkButton } from "../components/Button";
import { apiServerFetch } from "../lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explorar — Closr" };

export default async function ExplorePage() {
  const works = (await apiServerFetch("/works")) || [];

  return (
    <>
      <div className="border-b border-[color:var(--border)] px-5 py-5">
        <Container size="xl" className="px-0">
          <h1 className="text-xl font-semibold tracking-tight">Explorar trabajos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Descubre el trabajo de los creadores de la comunidad.
          </p>
        </Container>
      </div>

      <div className="px-3 py-5 sm:px-5">
        {works.length === 0 ? (
          <Container size="xl" className="px-0">
            <EmptyState
              title="Aún no hay nada que mostrar"
              description="Sé el primero en publicar un trabajo."
              action={<LinkButton href="/new/work">Subir trabajo</LinkButton>}
            />
          </Container>
        ) : (
          <WorksMasonry works={works} />
        )}
      </div>
    </>
  );
}
