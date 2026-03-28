"use client";

import { useData } from "@/lib/hooks";
import type { Settings } from "@/lib/types";
import { Settings as SettingsIcon, User, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";

function ValueDisplay({ value }: { value: string | null | undefined }) {
  return value ? (
    <span className="text-white text-sm">{value}</span>
  ) : (
    <span className="text-zinc-500 text-sm">Not set</span>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-zinc-800 last:border-b-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <ValueDisplay value={value} />
    </div>
  );
}

export default function SettingsPage() {
  const { data, loading } = useData<Settings>("settings");

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-48" />
        <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={24} className="text-indigo-400" />
          Settings
        </h1>
        <p className="text-zinc-400 mt-1">Current application settings</p>
      </div>

      {/* Profile */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <User size={18} className="text-indigo-400" /> Profile
        </h2>
        <div className="divide-y divide-zinc-800">
          <Row label="Applicant Name" value={data.applicantName} />
          <Row label="Field of Expertise" value={data.fieldOfExpertise} />
          <Row
            label="Target Filing Date"
            value={data.targetFilingDate ? formatDate(data.targetFilingDate) : null}
          />
        </div>
      </div>

      {/* Attorney */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Briefcase size={18} className="text-indigo-400" /> Attorney
        </h2>
        <div className="divide-y divide-zinc-800">
          <Row label="Attorney Name" value={data.attorneyName} />
          <Row label="Attorney Email" value={data.attorneyEmail} />
        </div>
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Settings are managed via API
      </p>
    </div>
  );
}
