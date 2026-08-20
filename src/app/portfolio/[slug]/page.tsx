import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS } from "@/data/config";

// ─── SSG: pre-render every project page at build time ────────
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// ─── Per-page SEO ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

// ─── Page ─────────────────────────────────────────────────────
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject =
    currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div
        className={`h-72 md:h-96 bg-gradient-to-br ${project.gradient} w-full`}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
          <Link href="/portfolio" className="hover:text-neutral-700 transition">
            Portfolio
          </Link>{" "}
          <span aria-hidden="true">›</span>{" "}
          <span className="text-neutral-700">{project.title}</span>
        </nav>

        {/* Title block */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs bg-neutral-100 rounded-full px-3 py-1">
              {project.year}
            </span>
            <span className="text-xs bg-neutral-100 rounded-full px-3 py-1">
              {project.role}
            </span>
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-neutral-100 rounded-full px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-lg text-neutral-600">{project.tagline}</p>
        </div>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest accent-text mb-3">
            Overview
          </h2>
          <p className="text-neutral-700 leading-relaxed">{project.description}</p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Challenge */}
          <section className="md:col-span-1 bg-neutral-50 rounded-2xl p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              Challenge
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {project.challenge}
            </p>
          </section>

          {/* Solution */}
          <section className="md:col-span-2 bg-neutral-50 rounded-2xl p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              Approach
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {project.solution}
            </p>
          </section>
        </div>

        {/* Outcome */}
        <section className="border-l-4 border-violet-400 pl-6 mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            Outcome
          </h2>
          <p className="text-neutral-700 leading-relaxed font-medium">
            {project.outcome}
          </p>
        </section>

        {/* Live link */}
        {project.liveUrl && (
          <div className="mb-12">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-bg text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition inline-block text-sm"
            >
              Visit live project →
            </a>
          </div>
        )}

        {/* Divider */}
        <hr className="border-neutral-100 mb-12" />

        {/* Prev / Next navigation */}
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="Project navigation"
        >
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.slug}`}
              className="group flex flex-col items-start"
            >
              <span className="text-xs text-neutral-400 mb-1">← Previous</span>
              <span className="text-sm font-semibold group-hover:accent-text transition">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextProject ? (
            <Link
              href={`/portfolio/${nextProject.slug}`}
              className="group flex flex-col items-end text-right"
            >
              <span className="text-xs text-neutral-400 mb-1">Next →</span>
              <span className="text-sm font-semibold group-hover:accent-text transition">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </>
  );
}
