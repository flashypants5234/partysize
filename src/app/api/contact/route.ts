export const runtime = 'nodejs';

/**
 * Contact / lead form handler. POST { name, email, message }.
 * Wire this to your email provider (Resend, SendGrid) or DB. Returns JSON.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
    };

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ error: 'Message is too long.' }, { status: 400 });
    }

    // TODO: send the email / save the lead. Example with Resend:
    //   await resend.emails.send({ from, to, subject, text: message });
    // The validated { name, email, message } is ready to forward to your
    // email provider or database here.

    return Response.json({
      ok: true,
      delivered: false,
      message: 'Demo validation passed. Connect an email provider or database before using this form in production.',
    });
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
