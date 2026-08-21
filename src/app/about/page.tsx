import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ShieldCheck, Users, Target } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Integrity", description: "We do what we say, and we say what we mean — every policy, every claim." },
  { icon: Users, title: "People First", description: "Every client is paired with a dedicated case manager who knows their file." },
  { icon: Target, title: "Precision", description: "Our underwriting and claims teams focus on accuracy so nothing is missed." },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#0a1f44] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About American Shield</h1>
            <p className="mt-6 text-lg text-white/80">
              We built American Shield to make asset protection simple, transparent,
              and genuinely reliable when it counts.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="rounded-xl border border-slate-200 p-6">
                  <value.icon className="h-8 w-8 text-[#0a1f44]" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-[#0a1f44]">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0a1f44] sm:text-3xl">Our Story</h2>
            <p className="mt-4 text-slate-600">
              American Shield was founded on a simple idea: insurance should protect
              people, not confuse them. Today, our team works directly with
              policyholders through every step, from onboarding to claims resolution,
              with a secure case portal that keeps everyone informed.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}