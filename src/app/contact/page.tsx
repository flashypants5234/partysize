import type { Metadata } from "next";
import { SITE, SOCIAL_LINKS } from "@/data/config";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE.name}. Available for freelance projects, full-time roles, and collaboration.`,
};

export default function ContactPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="soft-grad">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-3">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Let&apos;s build something good
          </h1>
          <p className="text-neutral-600 text-lg max-w-xl">
            Have a project, a role, or just want to say hi? Drop me a line — I
            read every message.
          </p>
        </div>
      </section>

      {/* ── CONTACT CONTENT ──────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Left: info */}
          <aside className="md:col-span-1 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                Email
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium hover:underline"
              >
                {SITE.email}
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                Location
              </p>
              <p className="font-medium">{SITE.location}</p>
            </div>

            {SITE.available && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-800">
                  Available for select freelance projects
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                Find me online
              </p>
              <ul className="space-y-2">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
                    >
                      {s.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
