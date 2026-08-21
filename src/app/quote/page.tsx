import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCaseSession, CASE_SESSION_COOKIE } from "@/lib/case-session";
import { supabase } from "@/integrations/supabase/client";

type QuoteRow = { quote_text: string | null; requested_at: string | null; issued_at: string | null };

export default async function QuotePage() {
  const session = await getCaseSession();
  if (!session) {
    redirect("/access");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  let quoteText: string | null = null;
  let issuedAt: string | null = null;

  if (token) {
    const { data } = await supabase.rpc("get_case_quote", { p_token: token });
    const rows = (data ?? []) as QuoteRow[];
    if (rows.length > 0) {
      quoteText = rows[0].quote_text;
      issuedAt = rows[0].issued_at;
    }
  }

  const isIssued = Boolean(issuedAt && quoteText);

  return (
    <div className="as-skin">
      <main className="case-shell">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="eyebrow">Your Quote</div>
          <h1>{isIssued ? "Your Custom Quote" : "Preparing Your Quote"}</h1>

          <div className="quote-box">
            {isIssued ? (
              <>
                <div
                  className="quote-amount"
                  style={{ fontSize: "1.3rem", whiteSpace: "pre-wrap", textAlign: "left" }}
                >
                  {quoteText}
                </div>
                <p className="small" style={{ color: "var(--slate-light)", marginTop: 12 }}>
                  Issued {new Date(issuedAt as string).toLocaleString()}. This quote is confidential and
                  prepared specifically for you.
                </p>
              </>
            ) : (
              <p className="small" style={{ color: "var(--slate-light)" }}>
                Your specialist{session.specialist_name ? `, ${session.specialist_name},` : ""} has been
                notified and is preparing your custom quote. Check back shortly, or we&apos;ll follow up
                directly.
              </p>
            )}
          </div>

          <Link href="/portal" className="btn btn-outline btn-block" style={{ marginTop: 24 }}>
            Back to Portal
          </Link>
        </div>
      </main>
    </div>
  );
}