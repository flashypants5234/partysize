import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Home, Gem, Scale, Briefcase } from "lucide-react";

const coverages = [
  { icon: Home, title: "Property Coverage", description: "Full protection for your home and physical structures against loss, damage, and unexpected events." },
  { icon: Gem, title: "Valuables & Collectibles", description: "Tailored coverage for jewelry, art, and collectibles that require specialized appraisal and protection." },
  { icon: Scale, title: "Liability Protection", description: "Coverage that shields your finances from legal claims and associated costs." },
  { icon: Briefcase, title: "Business Assets", description: "Protection for equipment, inventory, and tools essential to your operations." },
];

export default function CoveragePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#0a1f44] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Coverage Built Around You</h1>
            <p className="mt-6 text-lg text-white/80">
              Explore the range of protection plans American Shield offers to keep
              what matters most secure.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
            {coverages.map((coverage) => (
              <div key={coverage.title} className="rounded-xl border border-slate-200 p-8">
                <coverage.icon className="h-9 w-9 text-[#c8a04d]" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold text-[#0a1f44]">{coverage.title}</h3>
                <p className="mt-3 text-slate-600">{coverage.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}