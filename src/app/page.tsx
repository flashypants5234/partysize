import Link from "next/link";
import { ShieldCheck, Smartphone, ClipboardCheck, Coins, Lock, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HowItWorks from "@/components/HowItWorks";

const features = [
  {
    icon: ClipboardCheck,
    title: "Case Tracking",
    body: "Follow your case status from intake to coverage, all in one place.",
    accent: "border-sky-400",
  },
  {
    icon: Smartphone,
    title: "Digital-First Support",
    body: "Reach our team and manage updates without ever picking up the phone.",
    accent: "border-accent-500",
  },
  {
    icon: ShieldCheck,
    title: "Coverage Access",
    body: "Review your coverage terms and documents whenever you need them.",
    accent: "border-navy-900",
  },
];

const coverageTypes = [
  { icon: Coins, title: "Cryptocurrency Coverage", live: true, href: "/coverage/crypto" },
  { icon: ShieldCheck, title: "Property & Auto", live: false },
  { icon: Lock, title: "Valuable Personal Property", live: false },
  { icon: ShieldCheck, title: "Business Assets", live: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              Manage your case
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-600 sm:text-lg">
              Log in to check your status anytime. Your data stays encrypted and protected,
              around the clock.
            </p>

            <div className="mt-8">
              <button
                type="button"
                className="rounded-md bg-accent-500 px-8 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
              >
                Log In
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm font-semibold text-navy-900 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/access" className="inline-flex items-center gap-1 hover:text-accent-600">
                New user? Have a Case ID?
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/access" className="inline-flex items-center gap-1 hover:text-accent-600">
                Check your coverage status
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-xs lg:block">
            <div className="absolute right-0 top-1/2 -z-10 grid -translate-y-1/2 translate-x-16 grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-accent-500/70" />
              ))}
            </div>
            <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent-100" />
            <div className="overflow-hidden rounded-[2rem] border-[6px] border-navy-900 bg-white shadow-2xl">
              <div className="bg-navy-900 px-4 py-3 text-center text-xs font-bold tracking-widest text-white">
                AMERICAN SHIELD
              </div>
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
                  <ShieldCheck className="h-8 w-8 text-white" aria-hidden />
                </div>
                <p className="text-center text-sm font-bold text-navy-900">
                  Bank-Level Security
                </p>
                <p className="text-center text-xs text-slate-500">
                  256-bit encryption protects every case, every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section id="resources" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-navy-900 sm:text-3xl">
            Even more within reach
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            From your case status to your coverage documents, everything you need is designed to
            be simple to find and easy to trust.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className={`border-t-4 border-b-4 ${f.accent} px-4 py-8`}>
                <f.icon className="mx-auto h-8 w-8 text-navy-900" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-navy-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Coverage */}
      <section id="coverage" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-navy-900 sm:text-3xl">
            Featured Coverage
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
            Cryptocurrency coverage is available now, with more asset types on the way.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl gap-x-10 gap-y-4 sm:grid-cols-2">
            {coverageTypes.map((c) => (
              <div
                key={c.title}
                className={`flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 ${
                  !c.live ? "opacity-60" : ""
                }`}
              >
                <span className="flex items-center gap-3 font-semibold text-navy-900">
                  <c.icon className="h-5 w-5 text-accent-500" aria-hidden />
                  {c.title}
                </span>
                {c.live ? (
                  <Link href={c.href!} className="text-accent-600">
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </Link>
                ) : (
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" />

      <SiteFooter />
    </main>
  );
}
