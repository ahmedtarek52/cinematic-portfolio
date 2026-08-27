import https from 'https';
import { createClient } from '@supabase/supabase-js';

function postToResend(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let resBody = '';
      res.on('data', (chunk) => {
        resBody += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = resBody ? JSON.parse(resBody) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject({
              status: res.statusCode,
              message: parsed.message || `Resend error (${res.statusCode})`,
              details: parsed,
            });
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: { raw: resBody } });
          } else {
            reject({
              status: res.statusCode,
              message: `Resend error (${res.statusCode}): ${resBody}`,
            });
          }
        }
      });
    });

    req.on('error', (err) => {
      reject({ status: 500, message: err.message || 'Network error connecting to Resend' });
    });

    req.write(data);
    req.end();
  });
}

export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY =
    process.env.RESEND_API_KEY ||
    process.env.VITE_RESEND_API_KEY;

  const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  const SUPABASE_SERVICE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  const OWNER_EMAIL =
    process.env.OWNER_EMAIL ||
    process.env.VITE_OWNER_EMAIL ||
    'Mahmoudaboheussin57@gmail.com';

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { firstName, lastName = '', email, message } = body || {};

    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // 1. Insert into Supabase table (service role key bypasses RLS safely on server)
    let dbRecord = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data, error: dbErr } = await supabaseAdmin
          .from('contact_messages')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            message,
          })
          .select()
          .single();

        if (dbErr) {
          console.warn('Supabase DB insert warning:', dbErr.message);
        } else {
          dbRecord = data;
        }
      } catch (dbEx) {
        console.warn('Supabase DB insert exception:', dbEx);
      }
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured in environment variables.');
      return res.status(500).json({
        error: 'Email service configuration error: missing RESEND_API_KEY environment variable.',
        dbSaved: !!dbRecord,
      });
    }

    // 2. Dispatch email via Resend API with native Node HTTPS request
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Portfolio Message</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0c0c0e;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #141418;
            border: 1px solid #27272a;
            border-radius: 16px;
            overflow: hidden;
          }
          .header {
            padding: 32px 32px 24px;
            background: linear-gradient(180deg, #1c1c22 0%, #141418 100%);
            border-bottom: 1px solid #27272a;
          }
          .brand {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #a1a1aa;
            text-transform: uppercase;
            margin: 0 0 6px;
          }
          .title {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 32px;
          }
          .field-group {
            margin-bottom: 20px;
          }
          .field-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #71717a;
            margin-bottom: 6px;
            font-weight: 600;
          }
          .field-value {
            font-size: 15px;
            color: #e4e4e7;
            font-weight: 500;
          }
          .message-box {
            background-color: #09090b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            font-size: 15px;
            line-height: 1.6;
            color: #f4f4f5;
            white-space: pre-wrap;
            margin-top: 10px;
          }
          .cta-container {
            margin-top: 32px;
            text-align: center;
          }
          .reply-button {
            display: inline-block;
            background-color: #ffffff;
            color: #09090b !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 28px;
            border-radius: 10px;
          }
          .footer {
            padding: 20px 32px;
            background-color: #09090b;
            border-top: 1px solid #1f1f23;
            text-align: center;
            font-size: 12px;
            color: #52525b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p class="brand">Mahmoud Abo Hussein • Portfolio</p>
            <h1 class="title">New Client Inquiry</h1>
          </div>
          
          <div class="content">
            <div class="field-group">
              <div class="field-label">Sender Name</div>
              <div class="field-value">${fullName}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Email Address</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a>
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Received At</div>
              <div class="field-value">${submittedAt}</div>
            </div>

            <div class="field-group" style="margin-top: 24px;">
              <div class="field-label">Message Details</div>
              <div class="message-box">${message}</div>
            </div>

            <div class="cta-container">
              <a href="mailto:${email}?subject=Re:%20Inquiry%20from%20Portfolio" class="reply-button">
                Reply to ${firstName}
              </a>
            </div>
          </div>

          <div class="footer">
            Delivered directly via Resend • Cinematic Portfolio System
          </div>
        </div>
      </body>
      </html>
    `;

    const resendPayload = {
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [OWNER_EMAIL],
      reply_to: email,
      subject: `🎬 New Portfolio Message from ${fullName}`,
      html: emailHtml,
    };

    let resendResult;
    try {
      resendResult = await postToResend(resendPayload, RESEND_API_KEY);
    } catch (resendErr) {
      console.error('Resend delivery failure:', resendErr);
      return res.status(resendErr.status || 500).json({
        error: resendErr.message || 'Failed to send email via Resend',
        details: resendErr.details,
        dbSaved: !!dbRecord,
      });
    }

    return res.status(200).json({
      success: true,
      emailId: resendResult?.data?.id,
      dbSaved: !!dbRecord,
    });
  } catch (error) {
    console.error('Serverless send-email handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
