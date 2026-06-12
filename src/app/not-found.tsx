import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-gold">404 · table not found</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        This page isn&apos;t in the catalog.
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-md border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-gold/60 hover:text-gold"
      >
        ← Back to home
      </Link>
    </main>
  );
}
