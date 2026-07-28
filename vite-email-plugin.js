// Vite plugin: adds /api/send-otp endpoint served by the dev server
// Uses nodemailer with Gmail app password to send OTP emails
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dipendramahato.2303048@srec.ac.in',
    pass: 'kqas rhzk xpzf pkdm',   // Gmail App Password
  },
});

export default function emailPlugin() {
  return {
    name: 'email-otp-api',
    configureServer(server) {
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { email, otp, recipientName } = JSON.parse(body);

            if (!email || !otp) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'email and otp required' }));
              return;
            }

            const mailOptions = {
              from: '"SmartSofa PRO" <dipendramahato.2303048@srec.ac.in>',
              to: email,
              subject: '🛋️ SmartSofa – Your Password Reset OTP',
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0;padding:0;background:#070B14;font-family:'Segoe UI',Arial,sans-serif;">
                  <div style="max-width:480px;margin:40px auto;background:linear-gradient(135deg,#0F172A,#0B1428);border:1px solid rgba(59,130,246,0.2);border-radius:24px;overflow:hidden;">
                    
                    <!-- Header -->
                    <div style="background:linear-gradient(135deg,#2563EB,#0891B2);padding:32px 40px;text-align:center;">
                      <div style="display:inline-flex;align-items:center;gap:12px;">
                        <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;">
                          <span style="font-size:24px;">🛋️</span>
                        </div>
                        <span style="color:white;font-size:22px;font-weight:900;letter-spacing:-0.5px;">SmartSofa PRO</span>
                      </div>
                      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Intelligent Furniture Platform</p>
                    </div>

                    <!-- Body -->
                    <div style="padding:36px 40px;">
                      <h2 style="color:#F1F5F9;font-size:20px;font-weight:800;margin:0 0 8px;">Password Reset OTP</h2>
                      <p style="color:#94A3B8;font-size:14px;margin:0 0 28px;line-height:1.6;">
                        Hi ${recipientName || 'there'}, we received a request to reset your SmartSofa account password. Use the OTP below to continue:
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#0A1628;border:2px solid rgba(59,130,246,0.4);border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
                        <p style="color:#64748B;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Your One-Time Password</p>
                        <div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#60A5FA;font-family:'Courier New',monospace;">${otp}</div>
                        <p style="color:#64748B;font-size:11px;margin:14px 0 0;">⏱️ Valid for <strong style="color:#F59E0B;">10 minutes</strong> only</p>
                      </div>

                      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:14px 18px;margin-bottom:24px;">
                        <p style="color:#F59E0B;font-size:12px;margin:0;font-weight:600;">⚠️ Security Notice: Never share this OTP with anyone. SmartSofa support will never ask for it.</p>
                      </div>

                      <p style="color:#64748B;font-size:12px;margin:0;line-height:1.6;">
                        If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                      </p>
                    </div>

                    <!-- Footer -->
                    <div style="border-top:1px solid rgba(255,255,255,0.05);padding:20px 40px;text-align:center;">
                      <p style="color:#334155;font-size:11px;margin:0;">
                        SmartSofa PRO &bull; Intelligent Furniture Control System<br>
                        Developed by Dipendra Mahato &bull; SREC
                      </p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            };

            await transporter.sendMail(mailOptions);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('[email-otp] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}
