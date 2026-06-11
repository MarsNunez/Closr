import { LinkButton } from "./components/Button";
import { Container } from "./components/Container";

export default function NotFound() {
  return (
    <Container size="sm" className="py-24 sm:py-32">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          No encontramos lo que buscas
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Puede que el recurso ya no exista o que el enlace esté roto.
        </p>
        <div className="mt-8 flex gap-3">
          <LinkButton href="/" variant="primary">
            Volver al inicio
          </LinkButton>
          <LinkButton href="/explore" variant="outline">
            Explorar
          </LinkButton>
        </div>
      </div>
    </Container>
  );
}
