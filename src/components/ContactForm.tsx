'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = 'Please enter your name.';
  if (!email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!message.trim()) errors.message = 'Please enter a message.';
  else if (message.length > 5000) errors.message = 'Message must be under 5,000 characters.';
  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get('name') as string) ?? '';
    const email = (data.get('email') as string) ?? '';
    const message = (data.get('message') as string) ?? '';

    const errors = validate(name, email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setStatus('ok');
      setServerMsg(json.message as string);
      form.reset();
    } catch (err) {
      setStatus('error');
      setServerMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 text-xl">
          ✓
        </div>
        <h3 className="font-semibold text-lg mb-2 text-emerald-800">Demo submission validated</h3>
        <p className="text-emerald-700 text-sm">{serverMsg}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-emerald-700 hover:underline"
        >
          Try another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate aria-label="Contact form">
      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            aria-invalid={!!fieldErrors.name}
            className={`w-full rounded-xl bg-neutral-50 border px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition ${
              fieldErrors.name
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-neutral-200 focus:border-violet-500 focus:ring-violet-100'
            }`}
          />
          {fieldErrors.name && (
            <p id="err-name" role="alert" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            aria-invalid={!!fieldErrors.email}
            className={`w-full rounded-xl bg-neutral-50 border px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition ${
              fieldErrors.email
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-neutral-200 focus:border-violet-500 focus:ring-violet-100'
            }`}
          />
          {fieldErrors.email && (
            <p id="err-email" role="alert" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Subject <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          autoComplete="off"
          placeholder="Freelance project, job opportunity, etc."
          className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 transition"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={5000}
          placeholder="Tell me about your project, idea, or question…"
          aria-describedby={fieldErrors.message ? 'err-message' : undefined}
          aria-invalid={!!fieldErrors.message}
          className={`w-full rounded-xl bg-neutral-50 border px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 resize-none transition ${
            fieldErrors.message
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-neutral-200 focus:border-violet-500 focus:ring-violet-100'
          }`}
        />
        {fieldErrors.message && (
          <p id="err-message" role="alert" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <p className="text-xs text-neutral-500 text-center">
        Demo only: input is validated but not delivered until you connect an email provider or database.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full accent-bg text-white py-3.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {status === 'loading' ? 'Checking…' : 'Try demo form'}
      </button>

      {/* Server error */}
      {status === 'error' && (
        <p role="alert" aria-live="polite" className="text-sm text-center text-red-600">
          {serverMsg}
        </p>
      )}
    </form>
  );
}
