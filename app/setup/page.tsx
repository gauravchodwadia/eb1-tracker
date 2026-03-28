"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Copy, Check, Terminal } from "lucide-react";

type SetupStep =
  | "form"
  | "creating_repo"
  | "setting_up_files"
  | "done";

export default function SetupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [step, setStep] = useState<SetupStep>("form");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setStep("creating_repo");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, field, targetDate: targetDate || null }),
      });

      if (res.status === 409) {
        router.push("/");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Setup failed. Please try again.");
      }

      setStep("setting_up_files");
      const data = await res.json();
      setRepoUrl(data.repoUrl);
      await new Promise((r) => setTimeout(r, 800));

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("form");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto">
            EB
          </div>
          <h1 className="text-2xl font-bold text-white">
            Let&apos;s set up your EB-1A Tracker
          </h1>
          <p className="text-zinc-400 text-sm">
            We&apos;ll create a private GitHub repo to store your data
          </p>
          {session?.user?.name && (
            <p className="text-zinc-500 text-xs">
              Signed in as{" "}
              <span className="text-zinc-300">{session.user.name}</span>
            </p>
          )}
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="field"
                className="block text-sm font-medium text-zinc-300"
              >
                Field of Expertise
              </label>
              <input
                id="field"
                type="text"
                required
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g., Machine Learning, Biomedical Engineering"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="targetDate"
                className="block text-sm font-medium text-zinc-300"
              >
                Target Filing Date{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Create My Tracker
            </button>
          </form>
        ) : step !== "done" ? (
          <div className="space-y-4">
            <ProgressStep
              label="Creating your private repository..."
              status={step === "creating_repo" ? "active" : "done"}
            />
            <ProgressStep
              label="Setting up your data files..."
              status={step === "setting_up_files" ? "active" : "pending"}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success */}
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Your tracker is ready!</span>
            </div>

            {/* Claude Code prompt */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Terminal size={16} />
                <span className="text-sm font-medium">Next step: Customize with Claude Code</span>
              </div>
              <p className="text-xs text-zinc-400">
                Open Claude Code in your terminal and paste this prompt to personalize your tracker:
              </p>
              <div className="relative">
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 whitespace-pre-wrap overflow-x-auto">
{`Read the CLAUDE.md file at https://github.com/${session?.username || "USERNAME"}/gc-tracker-data/blob/main/CLAUDE.md — then help me set up my EB-1A tracker. I'm a ${field || "professional"} in ${name ? name + "'s" : "my"} field. Walk me through each criterion and help me assess my profile.`}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Read the CLAUDE.md file at https://github.com/${session?.username || "USERNAME"}/gc-tracker-data/blob/main/CLAUDE.md — then help me set up my EB-1A tracker. I'm a ${field || "professional"} in ${name ? name + "'s" : "my"} field. Walk me through each criterion and help me assess my profile.`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Go to dashboard */}
            <button
              onClick={() => router.push("/")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Go to Dashboard
            </button>

            {repoUrl && (
              <p className="text-center text-xs text-zinc-500">
                Your data repo:{" "}
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                  {repoUrl.replace("https://github.com/", "")}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressStep({
  label,
  status,
}: {
  label: string;
  status: "pending" | "active" | "done";
}) {
  return (
    <div className="flex items-center gap-3">
      {status === "pending" && (
        <div className="w-5 h-5 rounded-full border-2 border-zinc-700 shrink-0" />
      )}
      {status === "active" && (
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
      )}
      {status === "done" && (
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      <span
        className={
          status === "pending"
            ? "text-sm text-zinc-600"
            : status === "active"
            ? "text-sm text-zinc-300"
            : "text-sm text-zinc-400"
        }
      >
        {label}
      </span>
    </div>
  );
}
