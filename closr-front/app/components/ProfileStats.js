"use client";

import { useState } from "react";
import { FollowsModal } from "./FollowsModal";

export function ProfileStats({ userId, stats }) {
  const [openType, setOpenType] = useState(null);

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <StaticStat label="Trabajos" value={stats.works} />
        <StaticStat label="Posts" value={stats.posts} />
        <ClickableStat
          label="Seguidores"
          value={stats.followers}
          onClick={() => setOpenType("followers")}
        />
        <ClickableStat
          label="Siguiendo"
          value={stats.following}
          onClick={() => setOpenType("following")}
        />
      </div>

      <FollowsModal
        open={openType !== null}
        type={openType ?? "followers"}
        userId={userId}
        onClose={() => setOpenType(null)}
      />
    </>
  );
}

function StaticStat({ label, value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-semibold tabular-nums">{value ?? 0}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function ClickableStat({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-baseline gap-1 rounded-md transition-colors hover:text-foreground"
    >
      <span className="font-semibold tabular-nums">{value ?? 0}</span>
      <span className="text-muted-foreground hover:text-foreground hover:underline">
        {label}
      </span>
    </button>
  );
}
