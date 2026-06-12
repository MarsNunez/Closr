"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { apiRequest } from "../lib/api";
import { WorksMasonry } from "./WorksMasonry";

export function ExploreWorks({ serverWorks }) {
  const { status } = useAuth();
  const [works, setWorks] = useState(serverWorks);

  useEffect(() => {
    if (status !== "authenticated") return;
    apiRequest("/works")
      .then((data) => setWorks(Array.isArray(data) ? data : serverWorks))
      .catch(() => {});
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  return <WorksMasonry works={works} />;
}
