"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    title: "Enter your Case ID",
    body: "If our team has already set you up, enter the Case ID you were given to pick up right where you left off.",
    href: "/access",
    linkLabel: "Have a Case ID?",
  },
  {
    title: "Complete your intake",
    body: "For some cases, we'll ask a short set of questions about your assets and goals so we can tailor your coverage options.",
  },
  {
    title: "Review your coverage options",
    body: "See what's available for your situation, starting with cryptocurrency coverage, with more asset types coming online.",
  },
  {
    title: "Stay connected",
    body: "Our team follows up directly using the contact information tied to your case.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Click to see
          </p>
          <div className="mt-4 space-y-1">
            {steps.map((step, i) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-4 rounded-md px-3 py-4 text-left transition ${
                  active === i ? "bg-slate-50" : ""
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    active === i ? "text-accent-600" : "text-slate-400"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{step.title}</span>
                  {active === i && (
                    <span className="mt-2 block text-sm text-slate-600">
                      {step.body}{" "}
                      {step.href && (
                        <Link href={step.href} className="font-semibold text-accent-600 hover:underline">
                          {step.linkLabel}
                        </Link>
                      )}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl bg-slate-100 p-6">
          <div className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-1.5 bg-navy-900 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
            </div>
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="rounded-md border border-slate-200 p-3">
                <div className="h-2 w-1/3 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-accent-100" />
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="h-2 w-1/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-accent-100" />
              </div>
              <div className="h-8 w-1/3 rounded bg-accent-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
