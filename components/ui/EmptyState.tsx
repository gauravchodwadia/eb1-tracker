"use client";

import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox size={48} className="text-zinc-600 mb-4" />
      <h3 className="text-lg font-medium text-zinc-300 mb-2">{title}</h3>
      <p className="text-zinc-500 max-w-md mb-4">{description}</p>
      {action}
    </div>
  );
}
