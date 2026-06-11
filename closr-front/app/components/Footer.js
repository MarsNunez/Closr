import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[color:var(--border)] py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        <Logo showText={false} />
        <p className="text-xs">© {new Date().getFullYear()} Closr. Todos los derechos reservados.</p>
        <div className="flex items-center gap-5">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explorar
          </Link>
          <Link href="/feed" className="hover:text-foreground transition-colors">
            Feed
          </Link>
        </div>
      </div>
    </footer>
  );
}
