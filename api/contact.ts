import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const myEmail = process.env.MY_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;

  if (!apiKey) {
    return res.status(500).json({
      error: 'RESEND_API_KEY environment variable is missing.'
    });
  }

  if (!myEmail) {
    return res.status(500).json({
      error: 'MY_EMAIL environment variable is missing in your .env file.'
    });
  }

  try {
    const resend = new Resend(apiKey);
    const mailSubject = subject ? `[Portfolio] ${subject}` : `[Portfolio] ${name}`;

    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [myEmail],
      replyTo: email,
      subject: mailSubject,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; line-height: 1.6;">
          <p><strong>From:</strong> ${name} &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
          <p><strong>Subject:</strong> ${subject || 'New Portfolio Message'}</p>
          <br/>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error sending email with Resend:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email.' });
  }
}
