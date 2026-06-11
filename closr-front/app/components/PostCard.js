import Link from "next/link";
import { Avatar } from "./Avatar";
import { formatRelativeDate } from "../lib/format";
import { LikeButton } from "./LikeButton";
import { cn } from "../lib/cn";

export function PostCard({ post, asLink = true, className }) {
  const author = post.user || post.author;
  const likeCount = post.likesCount ?? post.likeCount ?? 0;
  const commentCount = post.commentsCount ?? post.commentCount ?? 0;

  return (
    <article
      className={cn(
        "group rounded-2xl border border-[color:var(--border)] bg-card p-5 transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <header className="mb-3 flex items-center gap-3">
        <Link
          href={author ? `/u/${author.id}` : "#"}
          className="flex items-center gap-3"
        >
          <Avatar username={author?.username} size="sm" />
          <div>
            <p className="text-sm font-semibold text-foreground hover:underline">
              {author?.username ?? "Anónimo"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeDate(post.createdAt)}
            </p>
          </div>
        </Link>
      </header>

      {asLink ? (
        <Link href={`/posts/${post.id}`} className="block">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
            {post.content}
          </p>
        </Link>
      ) : (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {post.content}
        </p>
      )}

      <footer className="mt-4 flex items-center gap-1 border-t border-[color:var(--border)] pt-3">
        <LikeButton
          postId={post.id}
          initialCount={likeCount}
          initialLiked={Boolean(post.likedByMe)}
        />
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <CommentIcon />
          <span className="tabular-nums">{commentCount}</span>
        </Link>
      </footer>
    </article>
  );
}

function CommentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
