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

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const isAllowedOrigin =
    !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.endsWith('.vercel.app') ||
    origin.includes('mahmoudabohussein.com');

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept'
  );
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

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

  const OWNER_EMAIL = (
    process.env.OWNER_EMAIL ||
    process.env.VITE_OWNER_EMAIL ||
    'mahmoudaboheussin57@gmail.com'
  ).trim().toLowerCase();

  const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ||
    process.env.VITE_RESEND_FROM_EMAIL ||
    'Portfolio Contact <onboarding@resend.dev>';

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { firstName, lastName = '', email, message, _hp } = body || {};

    // 1. Anti-spam honeypot: silently drop bot submissions without consuming quotas
    if (_hp) {
      return res.status(200).json({ success: true, dbSaved: false });
    }

    // 2. Strict Input Validation
    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required.' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // 3. Length caps to protect against memory/storage abuse
    if (firstName.length > 80 || (typeof lastName === 'string' && lastName.length > 80)) {
      return res.status(400).json({ error: 'Name cannot exceed 80 characters.' });
    }
    if (email.length > 120) {
      return res.status(400).json({ error: 'Email cannot exceed 120 characters.' });
    }
    if (message.length > 3000) {
      return res.status(400).json({ error: 'Message cannot exceed 3000 characters.' });
    }

    // 4. Strict Email Regex validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // 5. Sanitize header injection (strip CRLF from name)
    const cleanFirstName = firstName.replace(/[\r\n]/g, ' ').trim();
    const cleanLastName = typeof lastName === 'string' ? lastName.replace(/[\r\n]/g, ' ').trim() : '';
    const fullName = `${cleanFirstName} ${cleanLastName}`.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // 6. Insert into Supabase table (service role key bypasses RLS safely on server)
    let dbRecord = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data, error: dbErr } = await supabaseAdmin
          .from('contact_messages')
          .insert({
            first_name: cleanFirstName,
            last_name: cleanLastName,
            email: cleanEmail,
            message: cleanMessage,
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
    const emailText = `New Client Inquiry - Mahmoud Abo Hussein Portfolio
--------------------------------------------------
Sender Name: ${fullName}
Email Address: ${cleanEmail}
Received At: ${submittedAt}

Message Details:
${cleanMessage}
--------------------------------------------------
Delivered directly via Resend • Cinematic Portfolio System`;

    const resendPayload = {
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      reply_to: cleanEmail,
      subject: `🎬 New Portfolio Message from ${fullName}`,
      text: emailText,
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
