import Image from "next/image";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { WorkActionButtons } from "./WorkActionButtons";
import { cn } from "../lib/cn";

export function WorkCard({ work, className }) {
  const author = work.author;
  const aspectRatio =
    work.imageWidth && work.imageHeight
      ? work.imageWidth / work.imageHeight
      : 3 / 4;

  const paddingBottom = `${(1 / aspectRatio) * 100}%`;

  return (
    <div className={cn("group relative w-full", className)}>
      {/* Action buttons — top-right overlay */}
      <div className="absolute right-2 top-2 z-10 flex flex-row gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <WorkActionButtons
          workId={work.id}
          initialLiked={work.likedByMe ?? false}
          initialLikeCount={work.likeCount ?? 0}
          initialSaved={work.savedByMe ?? false}
        />
      </div>

      <Link
        href={`/works/${work.id}`}
        className="block w-full overflow-hidden rounded-2xl"
        tabIndex={0}
      >
        {/* Image container with native aspect ratio */}
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-muted"
          style={{ paddingBottom }}
        >
          {work.imageUrl ? (
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : null}

          {/* Bottom overlay — title + author */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white drop-shadow">
              {work.title}
            </p>
            {author ? (
              <div className="mt-2 flex items-center gap-1.5">
                <Avatar username={author.username} size="xs" />
                <span className="text-xs text-white/90 drop-shadow">
                  {author.username}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}
