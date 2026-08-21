import Link from "next/link";
import { Shield, Mail, MessageCircle } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#061530] text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-white">
            <Shield className="h-6 w-6 text-[#c8a04d]" aria-hidden="true" />
            <span className="font-semibold">American Shield</span>
          </div>
          <p className="text-sm">
            Trusted asset protection built on transparency and rapid response.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/coverage" className="hover:text-white">Coverage</Link></li>
            <li><Link href="/claims" className="hover:text-white">Claims</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Access</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/access" className="hover:text-white">Case ID Login</Link></li>
            <li><Link href="/staff/login" className="hover:text-white">Staff Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" aria-hidden="true" /> support@americanshield.com</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Live chat available 9–6 ET</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} American Shield. All rights reserved.</p>
        <p className="mt-1">American Shield is a private company and is not affiliated with, endorsed by, or sponsored by any U.S. government agency.</p>
      </div>
    </footer>
  );
}