import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { FileText, Search, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  { icon: FileText, title: "File Your Claim", description: "Log in with your Case ID and submit the details of your claim through your secure portal." },
  { icon: Search, title: "Review & Investigation", description: "Your dedicated case manager reviews the claim and reaches out if anything more is needed." },
  { icon: CheckCircle2, title: "Resolution", description: "Once approved, you'll receive a clear breakdown of your settlement and next steps." },
];

export default function ClaimsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[#0a1f44] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Claims Made Simple</h1>
            <p className="mt-6 text-lg text-white/80">
              A clear, guided process from filing to resolution — with real updates
              at every stage.
            </p>
            <Link
              href="/access"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#c8a04d] px-6 py-3.5 text-base font-semibold text-[#0a1f44] transition-colors hover:bg-[#e0c07a]"
            >
              Access My Case <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-slate-200 p-6">
                  <span className="text-sm font-semibold text-[#c8a04d]">Step {index + 1}</span>
                  <step.icon className="mt-3 h-8 w-8 text-[#0a1f44]" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-[#0a1f44]">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}