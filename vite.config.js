import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';

// ─── Gmail SMTP transporter (uses App Password) ───────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dipendramahato.2303048@srec.ac.in',
    pass: 'kqas rhzk xpzf pkdm',   // Gmail App Password
  },
});

// ─── Vite plugin: /api/send-otp ───────────────────────────────────────────────
function sendOtpPlugin() {
  return {
    name: 'send-otp-api',
    configureServer(server) {
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405); res.end('Method Not Allowed'); return;
        }
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
          try {
            const { email, otp, recipientName } = JSON.parse(body);
            await transporter.sendMail({
              from: '"SmartSofa Security" <dipendramahato.2303048@srec.ac.in>',
              to: email,
              subject: `SmartSofa: Your OTP is ${otp}`,
              html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0b1122;color:#fff;border-radius:16px;overflow:hidden;padding:32px;">
                  <h2 style="color:#3B82F6;margin-top:0">SmartSofa Security</h2>
                  <p style="color:#94a3b8">Hi ${recipientName || 'User'},</p>
                  <p style="color:#cbd5e1">Your one-time verification code is:</p>
                  <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#fff;background:#1e293b;padding:20px;border-radius:12px;text-align:center;border:1px solid #334155;margin:24px 0;">${otp}</div>
                  <p style="color:#64748b;font-size:13px;">This code expires in <strong style="color:#f59e0b">10 minutes</strong>. Do not share it with anyone.</p>
                  <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;"/>
                  <p style="color:#475569;font-size:11px;">SmartSofa IoT Dashboard · dipendramahato.2303048@srec.ac.in</p>
                </div>
              `,
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('[OTP Email Error]', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), sendOtpPlugin()],
  server: {
    port: 3000,
    host: true,
  },
});
