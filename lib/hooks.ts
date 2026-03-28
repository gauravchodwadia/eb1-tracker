"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useData<T>(filename: string, options?: { pollInterval?: number }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const pollMs = options?.pollInterval ?? 30000;

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/data/${filename}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(`Failed to load ${filename}:`, err);
    } finally {
      setLoading(false);
    }
  }, [filename]);

  useEffect(() => {
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
