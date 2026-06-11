import Image from "next/image";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { cn } from "../lib/cn";

export function WorkCard({ work, className }) {
  const author = work.author;

  return (
    <Link
      href={`/works/${work.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/30",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {work.imageUrl ? (
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
          {work.title}
        </h3>
        {work.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {work.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <Avatar username={author?.username} size="xs" />
          <span>{author?.username ?? "—"}</span>
        </div>
      </div>
    </Link>
  );
}
