import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { Resend } from 'resend';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'local-api-contact-handler',
        configureServer(server) {
          server.middlewares.use('/api/contact', (req: any, res: any, next: any) => {
            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const { name, email, subject, message } = JSON.parse(body || '{}');

                if (!name || !email || !message) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Name, email, and message are required.' }));
                }

                const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
                const myEmail = env.MY_EMAIL || process.env.MY_EMAIL || env.CONTACT_RECIPIENT_EMAIL || process.env.CONTACT_RECIPIENT_EMAIL;

                if (!apiKey) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(
                    JSON.stringify({
                      error: 'RESEND_API_KEY is missing in your .env file.'
                    })
                  );
                }

                if (!myEmail) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(
                    JSON.stringify({
                      error: 'MY_EMAIL is missing in your .env file.'
                    })
                  );
                }

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

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true, data: result }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: err.message || 'Failed to send email.' }));
              }
            });
          });
        }
      }
    ],
    server: {
      port: 5173,
      host: true,
      watch: {
        usePolling: true,
        interval: 1000
      }
    }
  };
});
