import { Lock } from "lucide-react";
import { submitCaseId } from "./actions";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-navy-700 bg-navy-900 p-8 shadow-xl">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
            <Lock className="h-6 w-6 text-accent-500" aria-hidden />
          </div>
        </div>
        <h1 className="mt-4 text-center text-xl font-semibold text-white">Beta Access</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter the Case ID you were provided to continue.
        </p>

        <form action={submitCaseId} className="mt-6 space-y-4">
          <div>
            <label htmlFor="caseId" className="sr-only">
              Case ID
            </label>
            <input
              id="caseId"
              name="caseId"
              type="text"
              autoComplete="off"
              placeholder="e.g. CASE-1029"
              required
              className="w-full rounded-md border border-navy-600 bg-navy-800 px-4 py-3 text-center text-sm font-medium tracking-wide text-white placeholder:text-slate-500 focus:border-accent-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-center text-sm text-red-400">
              That Case ID couldn&apos;t be verified. Please check it and try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo platform. Case IDs are issued for beta testing only.
        </p>
      </div>
    </main>
  );
}
