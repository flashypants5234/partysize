import Link from "next/link";
import { ShieldCheck, Phone } from "lucide-react";

const navLinks = [
  { href: "#coverage", label: "Coverage & More" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#resources", label: "Resources" },
  { href: "#about", label: "About Us" },
];

export default function SiteHeader() {
  return (
    <div>
      <div className="bg-navy-950 py-1.5 text-center text-[11px] font-medium uppercase tracking-widest text-brass-400">
        American-owned &amp; operated · Serving clients nationwide
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-navy-900">
            <ShieldCheck className="h-7 w-7 text-accent-500" aria-hidden />
            <span className="text-lg">AMERICAN SHIELD</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-navy-900">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="tel:18005550142"
              className="hidden items-center gap-1.5 font-semibold text-navy-900 sm:flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              1-800-555-0142
            </a>
            <button
              type="button"
              className="font-semibold text-navy-900 hover:text-accent-600"
            >
              Log In
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
