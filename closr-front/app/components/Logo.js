import Link from "next/link";
import { cn } from "../lib/cn";

export function Logo({ className }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background text-sm font-bold">
        C
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        closr
      </span>
    </Link>
  );
}
