'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, NAV_LINKS } from '@/data/config';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold tracking-tight text-lg"
          aria-label={`${SITE.name} — home`}
        >
          {SITE.name}
          <span className="accent-text" aria-hidden="true">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  active
                    ? 'font-semibold text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="text-sm font-semibold accent-bg text-white px-4 py-2 rounded-full hover:opacity-90 transition"
        >
          Get in touch
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-neutral-100 px-6 py-2 flex gap-6 text-sm overflow-x-auto">
        {NAV_LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap transition ${
                active
                  ? 'font-semibold text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
