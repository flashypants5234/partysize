import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { savePreset, deletePreset } from "../actions";

export default async function PresetsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/808admin-panel");
  }

  const { data: role } = await supabase.rpc("current_staff_role");
  if (role !== "admin") {
    redirect("/808admin-panel");
  }

  const { data: presets } = await supabase
    .from("quote_presets")
    .select("id, title, description, quote_text, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="as-skin">
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <Link href="/808admin-panel" className="small">
            ← Back to Dashboard
          </Link>
          <h1 style={{ marginTop: 12 }}>Quote Presets</h1>
          <p className="small" style={{ color: "var(--slate-light)" }}>
            Secret to admin only. Quote text stays redacted until you expand it. {presets?.length ?? 0} / 25 used.
          </p>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          <div className="panel">
            <div className="panel-head">
              <h3>New Preset</h3>
            </div>
            <form action={savePreset}>
              <div className="field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="description">Description (optional)</label>
                <input id="description" name="description" type="text" />
              </div>
              <div className="field">
                <label htmlFor="quoteText">Quote Text</label>
                <textarea id="quoteText" name="quoteText" rows={5} required />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Preset
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Saved Presets</h3>
            </div>
            {(presets ?? []).map((p) => (
              <details key={p.id} style={{ marginBottom: 14, borderBottom: "1px solid var(--rule)", paddingBottom: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  {p.title} {p.description ? `— ${p.description}` : ""}
                </summary>
                <div className="small" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                  {p.quote_text}
                </div>
                <form action={deletePreset} style={{ marginTop: 10 }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="btn btn-outline btn-sm">
                    Delete
                  </button>
                </form>
              </details>
            ))}
            {(!presets || presets.length === 0) && <p className="small">No presets saved yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}