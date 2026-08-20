import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-40 px-6 text-center">
      <p className="text-7xl font-bold tracking-tight accent-text mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
      <p className="text-neutral-500 mb-8 max-w-sm">
        Sorry, I couldn&apos;t find what you were looking for. It may have moved or
        never existed.
      </p>
      <Link
        href="/"
        className="accent-bg text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition"
      >
        Back to home
      </Link>
    </section>
  );
}
