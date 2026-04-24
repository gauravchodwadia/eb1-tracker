"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export const OWNER_COOKIE = "selectedOwner";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function useSelectedOwner(): {
  selectedOwner: string | null;
  isSelf: boolean;
} {
  const params = useSearchParams();
  const { data: session } = useSession();
  const self = session?.username ?? null;

  const fromUrl = params.get("owner");
  const fromCookie = fromUrl ? null : readCookie(OWNER_COOKIE);
  const selected = fromUrl || fromCookie || self;

  return {
    selectedOwner: selected,
    isSelf: !selected || !self || selected === self,
  };
}

export function useData<T>(
  filename: string,
  options?: { pollInterval?: number }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const pollMs = options?.pollInterval ?? 30000;
  const { selectedOwner, isSelf } = useSelectedOwner();
  const ownerQuery = !isSelf && selectedOwner ? `?owner=${encodeURIComponent(selectedOwner)}` : "";

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/data/${filename}${ownerQuery}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(`Failed to load ${filename}:`, err);
    } finally {
      setLoading(false);
    }
  }, [filename, ownerQuery]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  // Auto-refresh polling
  useEffect(() => {
    if (pollMs <= 0) return;
    const interval = setInterval(load, pollMs);
    return () => clearInterval(interval);
  }, [load, pollMs]);

  return { data, loading, reload: load };
}
