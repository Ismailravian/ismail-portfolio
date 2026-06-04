import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent">404</p>
        <h1 className="font-display text-5xl font-bold mt-2">Not found</h1>
        <p className="text-muted mt-2">That page doesn't exist (yet).</p>
        <Link href="/" className="inline-block mt-6 px-4 py-2 rounded-full bg-fg text-bg text-sm font-medium">
          Back home
        </Link>
      </div>
    </div>
  );
}
