import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <h1 className="text-2xl font-semibold text-zinc-200">404</h1>
      <p className="text-zinc-500">Page not found.</p>
      <Link
        href="/"
        className="text-indigo-400 hover:text-indigo-300 text-sm"
      >
        Go home
      </Link>
    </div>
  );
}
