import Link from "next/link";
import { ShieldCheck, Zap, FileCheck, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HowItWorks from "@/components/HowItWorks";

const features = [
  {
    icon: ShieldCheck,
    title: "Comprehensive Protection",
    description: "Coverage designed around the real value of what you own, not just its replacement cost.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    description: "Claims are reviewed quickly with clear updates at every step of the process.",
  },
  {
    icon: FileCheck,
    title: "Transparent Terms",
    description: "No hidden fees or fine print surprises — every policy is written in plain language.",
  },
];

const coverageTypes = [
  { title: "Property Coverage", description: "Protection for your home and physical assets against loss or damage." },
  { title: "Valuables & Collectibles", description: "Specialized coverage for high-value items that need extra protection." },
  { title: "Liability Protection", description: "Safeguard your finances against claims and legal costs." },
  { title: "Business Assets", description: "Coverage built for the equipment and inventory that keep you running." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-[#0a1f44] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Protection you can trust, when it matters most.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/80">
                American Shield delivers straightforward asset insurance backed by
                real people and a claims process built for speed and clarity.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/access"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#c8a04d] px-6 py-3.5 text-base font-semibold text-[#0a1f44] transition-colors hover:bg-[#e0c07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Have an existing case with us?
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/coverage"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore Coverage
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-widest text-[#e0c07a]">Why clients choose us</p>
              <ul className="mt-6 space-y-4 text-white/85">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c8a04d]" aria-hidden="true" />
                  Dedicated case managers for every policyholder
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c8a04d]" aria-hidden="true" />
                  Real-time case status through your secure portal
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c8a04d]" aria-hidden="true" />
                  Clear, plain-language policy documents
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 p-6">
                <feature.icon className="h-8 w-8 text-[#0a1f44]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-[#0a1f44]">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <HowItWorks />

        <section className="bg-[#f7f8fa] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0a1f44] sm:text-3xl">Featured Coverage</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coverageTypes.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold text-[#0a1f44]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/coverage" className="inline-flex items-center gap-2 font-semibold text-[#0a1f44] hover:text-[#c8a04d]">
                View all coverage options <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}