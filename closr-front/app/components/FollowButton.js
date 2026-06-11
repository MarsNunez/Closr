"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import { useAuthModal } from "../providers/AuthModalProvider";
import { Button } from "./Button";

export function FollowButton({ userId }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (status !== "authenticated" || !user) {
        setChecked(true);
        return;
      }
      try {
        const list = await apiRequest(`/follows/${user.id}/following`, {
          auth: "none",
        });
        if (cancelled) return;
        const isFollowing = Array.isArray(list)
          ? list.some((row) => row.following?.id === userId || row.followingId === userId)
          : false;
        setFollowing(isFollowing);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setChecked(true);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, userId, status]);

  if (status === "authenticated" && user?.id === userId) {
    return null;
  }

  const handleToggle = async () => {
    if (status !== "authenticated") {
      openAuthModal("login");
      return;
    }
    if (pending) return;

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setPending(true);

    try {
      await apiRequest(`/follows/${userId}`, {
        method: nextFollowing ? "POST" : "DELETE",
      });
      router.refresh();
    } catch {
      setFollowing(!nextFollowing);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant={following ? "outline" : "primary"}
      size="sm"
      disabled={pending || !checked}
    >
      {following ? "Siguiendo" : "Seguir"}
    </Button>
  );
}
