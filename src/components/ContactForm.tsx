"use client";

import { useState } from "react";

export default function ContactForm() {
  const [note, setNote] = useState(
    "This is a design prototype — the form doesn't send yet, but the interaction works."
  );
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setNote("Thanks — this is a prototype, so nothing was actually sent, but that's the confirmation state.");
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="c-name">Full name</label>
        <input id="c-name" type="text" required placeholder="Jordan Alvarez" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="c-topic">Topic</label>
        <select id="c-topic" defaultValue="General question">
          <option>General question</option>
          <option>Existing policy</option>
          <option>Claims support</option>
          <option>Press / partnerships</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" rows={4} required placeholder="How can we help?" />
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Send Message
      </button>
      <p className="form-note" style={sent ? { color: "var(--success)" } : undefined}>
        {note}
      </p>
    </form>
  );
}
