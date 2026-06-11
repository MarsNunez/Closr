"use client";

import { useAuth } from "../providers/AuthProvider";
import { WorksMasonry } from "./WorksMasonry";
import { LandingHero } from "./LandingHero";
import { Container } from "./Container";

export function HomeRouter({ works, featuredWorks }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <Container size="xl" className="py-8">
        <div className="columns-2 gap-2.5 sm:columns-3 lg:columns-4 xl:columns-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="mb-2.5 break-inside-avoid animate-pulse rounded-2xl bg-muted"
              style={{ height: `${180 + (i % 3) * 80}px` }}
            />
          ))}
        </div>
      </Container>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="px-3 py-6 sm:px-5">
        <WorksMasonry works={works} />
      </div>
    );
  }

  return <LandingHero featuredWorks={featuredWorks} />;
}
