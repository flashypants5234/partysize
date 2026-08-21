"use client";

import { useEffect, useState, useTransition } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import {
  assetQuestions,
  valueRanges,
  digitalStorageOptions,
  goalsOptions,
  securityLoadingSteps,
  type AssetKey,
} from "@/data/onboarding";
import { submitOnboardingResponses } from "./actions";

type Step = "loading" | "about" | "assets" | "followups" | "goals" | "review" | "submitting";

const progressSteps: Step[] = ["about", "assets", "followups", "goals", "review"];

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>("loading");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<AssetKey[]>([]);
  const [followups, setFollowups] = useState<Record<string, string>>({});
  const [goals, setGoals] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (step !== "loading") return;
    if (loadingIndex >= securityLoadingSteps.length) {
      const t = setTimeout(() => setStep("about"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLoadingIndex((i) => i + 1), 800);
    return () => clearTimeout(t);
  }, [step, loadingIndex]);

  function toggleAsset(key: AssetKey) {
    setSelectedAssets((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleGoal(value: string) {
    setGoals((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function handleSubmit() {
    setStep("submitting");
    startTransition(() => {
      submitOnboardingResponses({
        display_name: displayName || null,
        assets: selectedAssets,
        followups,
        goals,
      });
    });
  }

  const progressIndex = progressSteps.indexOf(step);

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl">
        {step === "loading" && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <ShieldCheck className="h-12 w-12 text-accent-500" aria-hidden />
            <h1 className="mt-6 text-lg font-semibold">Setting up your secure session</h1>
            <ul className="mt-6 space-y-2 text-sm text-slate-400">
              {securityLoadingSteps.map((label, i) => (
                <li key={label} className={i <= loadingIndex ? "text-white" : ""}>
                  {i < loadingIndex ? "✓ " : i === loadingIndex ? "… " : ""}
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step !== "loading" && step !== "submitting" && (
          <>
            <div className="mb-8 h-1.5 w-full rounded-full bg-navy-800">
              <div
                className="h-1.5 rounded-full bg-accent-500 transition-all"
                style={{ width: `${((progressIndex + 1) / progressSteps.length) * 100}%` }}
              />
            </div>

            {step === "about" && (
              <section>
                <h2 className="text-xl font-semibold">About you</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Optional — how should we address you?
                </p>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="First name (optional)"
                  className="mt-6 w-full rounded-md border border-navy-600 bg-navy-800 px-4 py-3 text-sm placeholder:text-slate-500 focus:border-accent-500"
                />
                <NavButtons onNext={() => setStep("assets")} />
              </section>
            )}

            {step === "assets" && (
              <section>
                <h2 className="text-xl font-semibold">Your assets</h2>
                <p className="mt-1 text-sm text-slate-400">Select all that apply.</p>
                <div className="mt-6 space-y-3">
                  {assetQuestions.map((q) => (
                    <label
                      key={q.key}
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-navy-700 bg-navy-900 p-4 text-sm hover:border-accent-500"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(q.key)}
                        onChange={() => toggleAsset(q.key)}
                        className="mt-1 h-4 w-4 accent-accent-500"
                      />
                      <span>{q.label}</span>
                    </label>
                  ))}
                </div>
                <NavButtons onBack={() => setStep("about")} onNext={() => setStep("followups")} />
              </section>
            )}

            {step === "followups" && (
              <section>
                <h2 className="text-xl font-semibold">A bit more detail</h2>
                {selectedAssets.length === 0 && (
                  <p className="mt-4 text-sm text-slate-400">
                    No assets selected — nothing more needed here.
                  </p>
                )}
                <div className="mt-6 space-y-6">
                  {selectedAssets.map((key) => (
                    <div key={key} className="rounded-md border border-navy-700 bg-navy-900 p-4">
                      <p className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</p>
                      <label className="mt-3 block text-xs uppercase tracking-wide text-slate-400">
                        Estimated value range
                      </label>
                      <select
                        value={followups[`${key}_value`] ?? ""}
                        onChange={(e) =>
                          setFollowups((f) => ({ ...f, [`${key}_value`]: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm"
                      >
                        <option value="">Select a range</option>
                        {valueRanges.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>

                      {key === "digital_assets" && (
                        <>
                          <label className="mt-3 block text-xs uppercase tracking-wide text-slate-400">
                            How do you currently store it?
                          </label>
                          <select
                            value={followups.digital_assets_storage ?? ""}
                            onChange={(e) =>
                              setFollowups((f) => ({
                                ...f,
                                digital_assets_storage: e.target.value,
                              }))
                            }
                            className="mt-1 w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm"
                          >
                            <option value="">Select an option</option>
                            {digitalStorageOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <NavButtons onBack={() => setStep("assets")} onNext={() => setStep("goals")} />
              </section>
            )}

            {step === "goals" && (
              <section>
                <h2 className="text-xl font-semibold">Your goals</h2>
                <p className="mt-1 text-sm text-slate-400">
                  What are you hoping to get from us?
                </p>
                <div className="mt-6 space-y-3">
                  {goalsOptions.map((g) => (
                    <label
                      key={g.value}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-navy-700 bg-navy-900 p-4 text-sm hover:border-accent-500"
                    >
                      <input
                        type="checkbox"
                        checked={goals.includes(g.value)}
                        onChange={() => toggleGoal(g.value)}
                        className="h-4 w-4 accent-accent-500"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
                <NavButtons onBack={() => setStep("followups")} onNext={() => setStep("review")} />
              </section>
            )}

            {step === "review" && (
              <section>
                <h2 className="text-xl font-semibold">Review &amp; submit</h2>
                <div className="mt-6 space-y-2 rounded-md border border-navy-700 bg-navy-900 p-4 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500">Name:</span> {displayName || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Assets:</span>{" "}
                    {selectedAssets.length ? selectedAssets.join(", ") : "None selected"}
                  </p>
                  <p>
                    <span className="text-slate-500">Goals:</span>{" "}
                    {goals.length ? goals.join(", ") : "None selected"}
                  </p>
                </div>
                <NavButtons
                  onBack={() => setStep("goals")}
                  onNext={handleSubmit}
                  nextLabel="Submit"
                  disabled={isPending}
                />
              </section>
            )}
          </>
        )}

        {step === "submitting" && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent-500" aria-hidden />
            <p className="mt-6 text-sm text-slate-400">Securing your responses…</p>
          </div>
        )}
      </div>
    </main>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  disabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-8 flex justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-navy-600 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-400"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="rounded-md bg-accent-500 px-6 py-2.5 text-sm font-semibold hover:bg-accent-600 disabled:opacity-60"
      >
        {nextLabel}
      </button>
    </div>
  );
}
