import Link from "next/link";
import { SITE, SOCIAL_LINKS, PROJECTS, SKILL_GROUPS } from "@/data/config";

export default function Home() {
  const featuredProjects = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="soft-grad">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          {SITE.available && (
            <p className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Available for select freelance projects
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Hi, I&apos;m {SITE.name.split(" ")[0]} —<br />
            {SITE.tagline.split(" ").slice(0, 3).join(" ")}{" "}
            <br className="hidden md:block" />
            <span className="accent-text">
              {SITE.tagline.split(" ").slice(3).join(" ")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mt-7 max-w-2xl">
            {SITE.bio}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9">
            <Link
              href="/portfolio"
              className="accent-bg text-white px-7 py-3.5 rounded-full font-semibold hover:opacity-90 transition text-center"
            >
              View my work
            </Link>
            <Link
              href="/contact"
              className="border border-neutral-300 px-7 py-3.5 rounded-full font-semibold hover:bg-neutral-50 transition text-center"
            >
              Let&apos;s talk
            </Link>
          </div>
          <nav className="flex gap-6 mt-10 text-sm text-neutral-500" aria-label="Social links">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 transition"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── WHAT I DO ────────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-8">
            What I do
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {SKILL_GROUPS.map((g) => (
              <div key={g.heading}>
                <h2 className="font-semibold text-lg mb-3">{g.heading}</h2>
                <div className="flex flex-wrap gap-2">
                  {g.tags.map((t) => (
                    <span
                      key={t}
                      className="text-sm bg-white border border-neutral-200 rounded-full px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WORK ────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-2">
                Selected work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Things I&apos;ve shipped
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-block text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition"
            >
              All projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group block rounded-2xl border border-neutral-100 overflow-hidden hover:border-neutral-200 hover:shadow-md transition"
              >
                <div
                  className={`h-52 bg-gradient-to-br ${p.gradient} group-hover:scale-[1.02] transition duration-300`}
                />
                <div className="p-5">
                  <p className="text-xs text-neutral-400 mb-1">{p.year} · {p.role}</p>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-neutral-600 text-sm mt-1">{p.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-neutral-100 rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Link
              href="/portfolio"
              className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition"
            >
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Let&apos;s build something good
          </h2>
          <p className="text-neutral-600 mb-8 text-lg">
            Have a project, a role, or just want to say hi? Drop me a line.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="accent-bg text-white px-7 py-3.5 rounded-full font-semibold hover:opacity-90 transition text-center"
            >
              Get in touch
            </Link>
            <a
              href={SITE.cvPdf}
              className="border border-neutral-300 px-7 py-3.5 rounded-full font-semibold hover:bg-white transition text-center"
              download
            >
              Download CV
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
