import Link from "next/link";
import { ShieldCheck, Lock, Coins } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <ShieldCheck className="h-6 w-6 text-accent-500" aria-hidden />
            <span>American Shield</span>
          </div>
          <Link
            href="/access"
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Beta Access
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-600">
          American-First Asset Protection — Demo Platform
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-navy-900 sm:text-5xl">
          Protecting what you&apos;ve built, backed by American standards.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          We&apos;re building a modern asset-insurance platform starting with cryptocurrency
          coverage. This is a beta preview — all figures and claims on this site are
          placeholder/demo content.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/access"
            className="rounded-md bg-navy-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            I have a Case ID — Enter Beta
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-5">
            <Coins className="h-6 w-6 text-accent-500" aria-hidden />
            <h2 className="mt-3 font-semibold text-navy-900">Cryptocurrency Coverage</h2>
            <p className="mt-1 text-sm text-slate-600">
              Our flagship product, launching first in beta. Placeholder coverage tiers and
              sample rates.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-5 opacity-60">
            <ShieldCheck className="h-6 w-6 text-slate-400" aria-hidden />
            <h2 className="mt-3 font-semibold text-navy-900">Savings &amp; Property</h2>
            <p className="mt-1 text-sm text-slate-600">Coming soon.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-5 opacity-60">
            <Lock className="h-6 w-6 text-slate-400" aria-hidden />
            <h2 className="mt-3 font-semibold text-navy-900">Valuable Personal Property</h2>
            <p className="mt-1 text-sm text-slate-600">Coming soon.</p>
          </div>
        </div>
      </section>

      <footer className="bg-navy-900 py-8 text-center text-xs text-slate-400">
        <p>
          Demo platform for illustration only. Not a government agency, not affiliated with the
          FDIC, and no real coverage is provided.
        </p>
      </footer>
    </main>
  );
}
