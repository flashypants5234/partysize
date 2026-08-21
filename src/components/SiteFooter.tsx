import Link from "next/link";
import { Search, Mail, MessageCircle, Rss } from "lucide-react";

const columns = [
  {
    title: "Coverage",
    links: [
      { label: "Cryptocurrency Coverage", href: "/coverage/crypto" },
      { label: "Property & Auto", href: "#" },
      { label: "Valuable Personal Property", href: "#" },
      { label: "Explore All Coverage", href: "#coverage" },
    ],
  },
  {
    title: "Our Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Newsroom", href: "#" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Have a Case ID?", href: "/access" },
      { label: "Contact Us", href: "#" },
      { label: "Resources", href: "#resources" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>1-800-555-0142</li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3 text-slate-400">
              <Mail className="h-4 w-4" aria-hidden />
              <MessageCircle className="h-4 w-4" aria-hidden />
              <Rss className="h-4 w-4" aria-hidden />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 border-t border-navy-800 pt-8">
          <Search className="h-4 w-4 text-slate-500" aria-hidden />
          <input
            placeholder="Search / Keywords"
            className="w-full max-w-xs border-b border-navy-700 bg-transparent py-1 text-sm text-white placeholder:text-slate-500 focus:border-accent-500"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300">
            Contact Us
          </a>
          <a href="#" className="hover:text-slate-300">
            Site Map
          </a>
          <a href="#" className="hover:text-slate-300">
            Privacy &amp; Security
          </a>
          <a href="#" className="hover:text-slate-300">
            Terms of Use
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          © 1995–2026 American Shield Insurance. All rights reserved. American Shield is a
          privately operated company and is not a government agency and not affiliated with the
          FDIC or any federal program.
        </p>
      </div>
    </footer>
  );
}
