import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--border)] py-10 text-sm text-muted-foreground">
      <Container size="xl" className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Closr</p>
        <div className="flex items-center gap-6">
          <Link href="/explore" className="hover:text-foreground">
            Explorar creadores
          </Link>
          <Link href="/feed" className="hover:text-foreground">
            Feed
          </Link>
        </div>
      </Container>
    </footer>
  );
}
