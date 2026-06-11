import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../components/Container";
import { PostCard } from "../../components/PostCard";
import { CommentSection } from "../../components/CommentSection";
import { apiServerFetch } from "../../lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { postId } = await params;
  const post = await apiServerFetch(`/posts/${postId}`);
  if (!post) return { title: "Post — Closr" };
  const snippet = (post.content || "").slice(0, 60);
  return {
    title: `${post.author?.username || "Post"} — Closr`,
    description: snippet,
  };
}

export default async function PostDetailPage({ params }) {
  const { postId } = await params;
  const post = await apiServerFetch(`/posts/${postId}`);

  if (!post) {
    notFound();
  }

  return (
    <Container size="md" className="py-12 sm:py-16">
      <Link
        href="/feed"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver al feed
      </Link>

      <PostCard post={post} asLink={false} />

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Comentarios
        </h2>
        <CommentSection postId={postId} />
      </section>
    </Container>
  );
}
