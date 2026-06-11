import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../components/Container";
import { Avatar } from "../../components/Avatar";
import { WorksMasonry } from "../../components/WorksMasonry";
import { FollowButton } from "../../components/FollowButton";
import { WorkDetailActions } from "../../components/WorkDetailActions";
import { WorkCommentSection } from "../../components/WorkCommentSection";
import { apiServerFetch } from "../../lib/api";
import { formatDate } from "../../lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { workId } = await params;
  const work = await apiServerFetch(`/works/${workId}`);
  if (!work) return { title: "Trabajo — Closr" };
  return {
    title: `${work.title} — Closr`,
    description: work.description || undefined,
  };
}

export default async function WorkDetailPage({ params }) {
  const { workId } = await params;
  const work = await apiServerFetch(`/works/${workId}`);

  if (!work) {
    notFound();
  }

  const authorWorks = work.author?.id
    ? (await apiServerFetch(`/works/user/${work.author.id}`)) || []
    : [];
  const related = authorWorks.filter((w) => w.id !== work.id).slice(0, 6);

  return (
    <Container size="lg" className="py-12 sm:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-card">
        {work.imageUrl ? (
          <div className="relative aspect-[16/10] w-full bg-muted">
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Left: title + description + actions + comments */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {work.title}
          </h1>
          {work.description ? (
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
              {work.description}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">
            Publicado el {formatDate(work.createdAt)}
          </p>

          {/* Like + Save action bar */}
          <WorkDetailActions
            workId={work.id}
            initialLiked={work.likedByMe ?? false}
            initialLikeCount={work.likeCount ?? 0}
            initialSaved={work.savedByMe ?? false}
            initialSaveCount={work.saveCount ?? 0}
          />

          {/* Comments */}
          <div className="mt-10">
            <WorkCommentSection workId={work.id} />
          </div>
        </div>

        {/* Right: author card */}
        <aside className="rounded-2xl border border-[color:var(--border)] bg-card p-5 self-start">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Creador
          </p>
          <Link
            href={`/u/${work.author?.id}`}
            className="mt-3 flex items-center gap-3"
          >
            <Avatar username={work.author?.username} size="md" />
            <div>
              <p className="text-sm font-semibold hover:underline">
                {work.author?.username}
              </p>
              <p className="text-xs text-muted-foreground">Ver perfil</p>
            </div>
          </Link>
          <div className="mt-5">
            <FollowButton userId={work.author?.id} />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">
            Más de {work.author?.username}
          </h2>
          <WorksMasonry works={related} />
        </section>
      ) : null}
    </Container>
  );
}
