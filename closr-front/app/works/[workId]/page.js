import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../components/Container";
import { Avatar } from "../../components/Avatar";
import { WorkCard } from "../../components/WorkCard";
import { FollowButton } from "../../components/FollowButton";
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
  const related = authorWorks.filter((w) => w.id !== work.id).slice(0, 3);

  return (
    <Container size="lg" className="py-12 sm:py-16">
      <Link
        href="/explore"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a explorar
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
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {work.title}
          </h1>
          {work.description ? (
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
              {work.description}
            </p>
          ) : null}
          <p className="mt-6 text-xs text-muted-foreground">
            Publicado el {formatDate(work.createdAt)}
          </p>
        </div>

        <aside className="rounded-2xl border border-[color:var(--border)] bg-card p-5">
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <WorkCard key={item.id} work={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
