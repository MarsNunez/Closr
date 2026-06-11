"use client";

import { Masonry } from "masonic";
import { WorkCard } from "./WorkCard";

function MasonryItem({ data }) {
  return <WorkCard work={data} />;
}

export function WorksMasonry({ works }) {
  if (!works || works.length === 0) return null;

  return (
    <Masonry
      items={works}
      render={MasonryItem}
      columnGutter={10}
      columnWidth={236}
      maxColumnCount={6}
      itemKey={(data) => data.id}
      itemHeightEstimate={320}
      overscanBy={3}
    />
  );
}
