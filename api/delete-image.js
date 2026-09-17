import crypto from 'crypto';
import https from 'https';

function postToCloudinary(cloudName, formData) {
  return new Promise((resolve, reject) => {
    const postBody = new URLSearchParams(formData).toString();
    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/image/destroy`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postBody),
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
              message: parsed.error?.message || `Cloudinary API error (${res.statusCode})`,
              details: parsed,
            });
          }
        } catch {
          reject({
            status: res.statusCode,
            message: `Cloudinary response parse error (${res.statusCode}): ${resBody}`,
          });
        }
      });
    });

    req.on('error', (err) => {
      reject({ status: 500, message: err.message || 'Network error connecting to Cloudinary' });
    });

    req.write(postBody);
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.VITE_CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY ||
    process.env.VITE_CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET ||
    process.env.VITE_CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Server error: Cloudinary credentials missing in server environment.');
    return res.status(500).json({ error: 'Cloudinary server credentials missing' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { publicId } = body || {};

  if (!publicId || typeof publicId !== 'string' || publicId.length > 500) {
    return res.status(400).json({ error: 'A valid publicId string is required' });
  }

  // Prevent directory traversal or invalid characters in publicId
  if (publicId.includes('..') || !/^[a-zA-Z0-9_\-\/]+$/.test(publicId)) {
    return res.status(400).json({ error: 'Invalid characters in publicId' });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const result = await postToCloudinary(cloudName, {
      public_id: publicId,
      api_key: apiKey,
      timestamp: timestamp.toString(),
      signature,
    });

    return res.status(200).json({
      result: result.data?.result || 'ok',
      publicId,
    });
  } catch (err) {
    console.error(`[delete-image error for ${publicId}]:`, err);
    return res.status(err.status || 500).json({
      error: err.message || 'Failed to delete asset from Cloudinary',
    });
  }
}
