"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Users } from "lucide-react";
import { OWNER_COOKIE, useSelectedOwner } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface Profile {
  owner: string;
  avatarUrl: string | null;
  isSelf: boolean;
}

function setOwnerCookie(value: string | null) {
  if (typeof document === "undefined") return;
  if (value) {
    document.cookie = `${OWNER_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } else {
    document.cookie = `${OWNER_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export default function ProfileSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { selectedOwner } = useSelectedOwner();

  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || profiles !== null) return;
    let cancelled = false;
    fetch("/api/profiles")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { profiles: Profile[] }) => {
        if (!cancelled) setProfiles(json.profiles);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [open, profiles]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const current = profiles?.find((p) => p.owner === selectedOwner) ?? null;
  const selfProfile = profiles?.find((p) => p.isSelf) ?? null;

  function select(p: Profile) {
    setOpen(false);
    const qp = new URLSearchParams(params.toString());
    if (p.isSelf) {
      qp.delete("owner");
      setOwnerCookie(null);
    } else {
      qp.set("owner", p.owner);
      setOwnerCookie(p.owner);
    }
    const qs = qp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  const display = current?.owner ?? selectedOwner ?? "Loading…";
  const avatar = current?.avatarUrl;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
          "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/50"
        )}
      >
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={20}
            height={20}
            className="rounded-full"
          />
        ) : (
          <Users size={16} className="text-zinc-400" />
        )}
        <span className="flex-1 min-w-0 truncate text-left font-medium">
          {display}
        </span>
        <ChevronDown size={14} className="text-zinc-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {error && (
            <div className="px-3 py-2 text-xs text-red-400">
              Failed to load profiles: {error}
            </div>
          )}
          {!error && profiles === null && (
            <div className="px-3 py-2 text-xs text-zinc-500">Loading…</div>
          )}
          {profiles && profiles.length === 0 && (
            <div className="px-3 py-2 text-xs text-zinc-500">
              No profiles found
            </div>
          )}
          {profiles && profiles.length > 0 && (
            <ul className="py-1 max-h-80 overflow-y-auto">
              {profiles.map((p) => {
                const isCurrent = current
                  ? p.owner === current.owner
                  : p.isSelf && !selectedOwner;
                return (
                  <li key={p.owner}>
                    <button
                      onClick={() => select(p)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                        isCurrent
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-zinc-300 hover:bg-zinc-800"
                      )}
                    >
                      {p.avatarUrl ? (
                        <Image
                          src={p.avatarUrl}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <Users size={16} className="text-zinc-500" />
                      )}
                      <span className="flex-1 min-w-0 truncate">{p.owner}</span>
                      {p.isSelf && (
                        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                          you
                        </span>
                      )}
                      {isCurrent && (
                        <Check size={14} className="text-indigo-400" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {profiles && selfProfile && (
            <div className="border-t border-zinc-800 px-3 py-2 text-[11px] text-zinc-500 leading-snug">
              Share your data: add friends as read collaborators on
              {" "}
              <code className="text-zinc-400">
                {selfProfile.owner}/eb1-tracker-data
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
