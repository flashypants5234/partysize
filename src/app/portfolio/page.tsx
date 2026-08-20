import type { Metadata } from "next";
import Link from "next/link";
import { SITE, PROJECTS } from "@/data/config";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Selected projects by ${SITE.name}. Design systems, product redesigns, open-source tools, and more.`,
};

export default function PortfolioPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="soft-grad">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-3">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Things I&apos;ve shipped
          </h1>
          <p className="text-neutral-600 text-lg max-w-xl">
            A selection of design and engineering projects — each with a real
            challenge, a deliberate approach, and a measured outcome.
          </p>
        </div>
      </section>

      {/* ── PROJECT GRID ─────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group block rounded-2xl border border-neutral-100 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition"
              >
                {/* Cover */}
                <div
                  className={`h-56 bg-gradient-to-br ${p.gradient} group-hover:scale-[1.02] transition duration-300`}
                />
                {/* Body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-400">{p.year}</span>
                    {p.featured && (
                      <span className="text-xs font-medium text-violet-600 bg-violet-50 rounded-full px-2.5 py-0.5">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-xl">{p.title}</h2>
                  <p className="text-neutral-600 text-sm mt-1">{p.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-neutral-100 rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-medium accent-text group-hover:underline">
                    View case study →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
