"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
const STAFF_EMAIL_DOMAIN = "internal.beta";

export default function StaffLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const supabase = createSupabaseBrowserClient();
        const email = `${username.trim().toLowerCase()}@${STAFF_EMAIL_DOMAIN}`;

        const {
            error: signInError
        } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setSubmitting(false);

        if (signInError) {
            setError("Invalid username or password.");
            return;
        }

        router.push("/staff/dashboard");
        router.refresh();
    }

    return (
        <div className="as-skin">
            <main id="main">
                <section
                    style={{
                        padding: "70px 0",
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center"
                    }}>
                    <div
                        className="container"
                        style={{
                            maxWidth: 460
                        }}>
                        <div
                            className="eyebrow"
                            style={{
                                justifyContent: "center",
                                display: "flex"
                            }}>Secure Log In
                                        </div>
                        <h1
                            className="text-center"
                            style={{
                                fontSize: "2rem"
                            }}>Welcome back.
                                        </h1>
                        <div className="tabs">
                            <Link href="/access" className="tab">Customer
                                              </Link>
                            <div className="tab active">Employee</div>
                        </div>
                        <form className="form-card" onSubmit={handleSubmit}>
                            <div className="field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    autoComplete="off" />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required />
                            </div>
                            {error && (<p
                                role="alert"
                                className="small"
                                style={{
                                    color: "var(--alert)"
                                }}>
                                {error}
                            </p>)}
                            <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
                                {submitting ? "Signing in…" : "Log In to Admin Panel"}
                            </button>
                            <p className="form-note">Staff sign-in only. Contact an admin if you need an account.</p>
                        </form>
                    </div>
                </section>
            </main>
            <footer
                className="site-footer"
                style={{
                    padding: "26px 0"
                }}>
                <div
                    className="container footer-bottom"
                    style={{
                        borderTop: "none"
                    }}>
                    <span>© {new Date().getFullYear()}Asset Shield, Inc. — placeholder name.</span>
                    <span>Prototype build — not a licensed insurer yet</span>
                </div>
            </footer>
        </div>
    );
}