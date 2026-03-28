"use client";

import { signIn } from "next-auth/react";
import { Shield, RefreshCw, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-lg space-y-10 text-center">
        {/* Hero */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl mx-auto">
            EB
          </div>
          <h1 className="text-3xl font-bold text-white">EB-1A Tracker</h1>
          <p className="text-zinc-400 text-base">
            Track your Extraordinary Ability petition progress
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-sm text-zinc-300">
              Your data stays in your private GitHub repo
            </span>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw size={20} className="text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-sm text-zinc-300">
              Auto-refreshes every 30 seconds
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-sm text-zinc-300">
              Claude keeps your tracker up to date
            </span>
          </div>
        </div>

        {/* Sign in button */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3.5 rounded-lg text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sign in with GitHub
        </button>

        {/* Bottom note */}
        <p className="text-zinc-500 text-xs">
          First time? We&apos;ll set everything up for you automatically.
        </p>
      </div>
    </div>
  );
}
