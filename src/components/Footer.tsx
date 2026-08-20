import Link from 'next/link';
import { SITE, NAV_LINKS, SOCIAL_LINKS } from '@/data/config';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-100 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="font-bold text-neutral-900 text-lg">
              {SITE.name}
              <span className="accent-text" aria-hidden="true">.</span>
            </Link>
            <p className="text-sm text-neutral-500 mt-1">{SITE.title}</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-500 hover:text-neutral-900 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400 pt-6 border-t border-neutral-100">
          <nav className="flex gap-6" aria-label="Social links">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-700 transition"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <p>© {year} {SITE.name}. Designed &amp; built with care.</p>
        </div>
      </div>
    </footer>
  );
}
