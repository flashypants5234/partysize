import Link from "next/link";
import { Shield } from "lucide-react";

const navLinks = [
  { href: "/coverage", label: "Coverage" },
  { href: "/claims", label: "Claims" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1f44] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Shield className="h-7 w-7 text-[#c8a04d]" aria-hidden="true" />
          <span className="text-lg">American Shield</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a04d]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/access"
          className="rounded-md bg-[#c8a04d] px-5 py-2.5 text-sm font-semibold text-[#0a1f44] transition-colors hover:bg-[#e0c07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Access My Case
        </Link>
      </div>
    </header>
  );
}