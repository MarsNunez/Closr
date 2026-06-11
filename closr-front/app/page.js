import { HomeRouter } from "./components/HomeRouter";
import { apiServerFetch } from "./lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Closr — Conecta con tus creadores favoritos",
};

export default async function HomePage() {
  const works = (await apiServerFetch("/works")) || [];
  // For the masonry (logged-in view) send all works
  // For the landing preview send the first 16
  const featuredWorks = works.slice(0, 16);

  return <HomeRouter works={works} featuredWorks={featuredWorks} />;
}
