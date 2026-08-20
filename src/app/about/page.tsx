import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  SKILL_GROUPS,
} from "@/data/config";

export const metadata: Metadata = {
  title: "About & Resume",
  description: `${SITE.bio} Experience, education, skills and CV download.`,
};

export default function AboutPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="soft-grad">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-3">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Designer who codes.
            <br />
            Engineer who cares.
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl leading-relaxed">
            {SITE.bio}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href={SITE.cvPdf}
              download
              className="accent-bg text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition text-center text-sm"
            >
              Download CV (PDF)
            </a>
            <Link
              href="/contact"
              className="border border-neutral-300 px-7 py-3 rounded-full font-semibold hover:bg-neutral-50 transition text-center text-sm"
            >
              Say hello
            </Link>
          </div>
        </div>
      </section>

      {/* ── BIO ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest accent-text">
              The longer story
            </p>
          </div>
          <div className="md:col-span-2">
            {SITE.bioExtended.split("\n\n").map((para, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">
                {para}
              </p>
            ))}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-2xl p-5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">
                  Location
                </p>
                <p className="font-medium">{SITE.location}</p>
              </div>
              <div className="bg-neutral-50 rounded-2xl p-5">
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-medium accent-text"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-8">
            Skills &amp; tools
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

      {/* ── EXPERIENCE TIMELINE ──────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-1">
              Experience
            </p>
            <a
              href={SITE.cvPdf}
              download
              className="text-xs text-neutral-400 hover:text-neutral-700 transition"
            >
              ↓ Download full CV
            </a>
          </div>
          <div className="md:col-span-2 space-y-10">
            {EXPERIENCE.map((e) => (
              <div
                key={e.role + e.company}
                className="relative pl-6 border-l-2 border-neutral-200"
              >
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full accent-bg" />
                <div className="text-sm text-neutral-400">{e.period}</div>
                <h3 className="font-semibold text-lg mt-1">
                  {e.role} ·{" "}
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {e.company}
                  </a>
                </h3>
                <p className="text-neutral-600 text-sm mt-2">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ────────────────────────────────────────── */}
      <section className="py-24 border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest accent-text">
              Education
            </p>
          </div>
          <div className="md:col-span-2 space-y-10">
            {EDUCATION.map((e) => (
              <div
                key={e.degree}
                className="relative pl-6 border-l-2 border-neutral-200"
              >
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-neutral-300" />
                <div className="text-sm text-neutral-400">{e.period}</div>
                <h3 className="font-semibold text-lg mt-1">{e.degree}</h3>
                <p className="text-neutral-600 text-sm font-medium">{e.school}</p>
                <p className="text-neutral-500 text-sm mt-1">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ───────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest accent-text">
              Certifications
            </p>
          </div>
          <div className="md:col-span-2">
            <ul className="space-y-4">
              {CERTIFICATIONS.map((c) => (
                <li key={c.name} className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0 w-10 text-xs text-neutral-400 font-medium">
                    {c.year}
                  </span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-neutral-500">{c.issuer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
