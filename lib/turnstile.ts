/**
 * Cloudflare Turnstile server-side token verification.
 *
 * Required env var:
 *   TURNSTILE_SECRET_KEY — Secret key from Cloudflare Turnstile dashboard
 *
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileResult {
  success: boolean;
  error?: string;
}

export async function verifyTurnstile(token: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If no secret key configured, skip verification (dev mode)
  if (!secret) {
    console.warn("[Turnstile] No TURNSTILE_SECRET_KEY set — skipping verification");
    return { success: true };
  }

  // Empty token = widget wasn't loaded or user didn't complete challenge
  if (!token) {
    return { success: false, error: "Turnstile verification required" };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: `Turnstile failed: ${(data["error-codes"] || []).join(", ")}`,
    };
  } catch (err) {
    console.error("[Turnstile] Verification request failed:", err);
    return { success: false, error: "Turnstile verification unavailable" };
  }
}
