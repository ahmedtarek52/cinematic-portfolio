// ──────────────────────────────────────────────────────
// Contact & Email Dispatch Service
// ──────────────────────────────────────────────────────

/**
 * Dispatches contact message to the serverless endpoint
 * which safely records it in Supabase (with admin service role)
 * and sends an email notification via Resend.
 *
 * @param {Object} params
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @param {string} params.email
 * @param {string} params.message
 * @returns {Promise<Object>}
 */
export async function sendContactEmail({ firstName, lastName, email, message }) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      message,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || `Email delivery failed (Server error: ${response.status})`
    );
  }

  return data;
}
