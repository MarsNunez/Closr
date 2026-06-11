import { notFound } from "next/navigation";
import { Container } from "../../components/Container";
import { Avatar } from "../../components/Avatar";
import { PostCard } from "../../components/PostCard";
import { FollowButton } from "../../components/FollowButton";
import { ProfileStats } from "../../components/ProfileStats";
import { WorksMasonry } from "../../components/WorksMasonry";
import { ProfileSavedWorks } from "../../components/ProfileSavedWorks";
import { EmptyState } from "../../components/EmptyState";
import { apiServerFetch } from "../../lib/api";
import { formatDate } from "../../lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { userId } = await params;
  const user = await apiServerFetch(`/users/${userId}`);
  if (!user) return { title: "Perfil — Closr" };
  return { title: `@${user.username} — Closr` };
}

export default async function CreatorProfilePage({ params }) {
  const { userId } = await params;
  const [user, works, posts] = await Promise.all([
    apiServerFetch(`/users/${userId}`),
    apiServerFetch(`/works/user/${userId}`),
    apiServerFetch(`/posts/user/${userId}`),
  ]);

  if (!user) {
    notFound();
  }

  const stats = user._count || {};

  return (
    <Container size="lg" className="py-12 sm:py-16">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <Avatar username={user.username} size="xl" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.username}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              En Closr desde {formatDate(user.createdAt)}
            </p>
            <ProfileStats userId={user.id} stats={stats} />
          </div>
        </div>
        <FollowButton userId={user.id} />
      </header>

      <section className="mt-16">
        <h2 className="mb-6 text-lg font-semibold tracking-tight">Trabajos</h2>
        {Array.isArray(works) && works.length > 0 ? (
          <div className="px-0">
            <WorksMasonry works={works} />
          </div>
        ) : (
          <EmptyState
            title="Sin trabajos por ahora"
            description="Cuando este creador publique algo, aparecerá aquí."
          />
        )}
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-lg font-semibold tracking-tight">Posts</h2>
        {Array.isArray(posts) && posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, user: { id: user.id, username: user.username } }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin posts aún"
            description="Pronto verás novedades por aquí."
          />
        )}
      </section>

      {/* Private: saved works — rendered client-side only for the owner */}
      <ProfileSavedWorks profileUserId={user.id} />
    </Container>
  );
}
