"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export interface SubscribeResult {
  success: boolean;
  error?: string;
}

async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[TalentPool] Welcome email skipped (no RESEND_API_KEY): ${email}`);
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Fiber Guys Careers <dispatch@fiberguysllc.com>",
      to: [email],
      subject: "You are on the list // Fiber Guys LLC",
      html: `
        <div style="font-family:'Courier New',Courier,monospace;background:#050505;color:#e0e0e0;padding:32px;max-width:600px;">
          <div style="border-left:3px solid #10B981;padding-left:16px;margin-bottom:24px;">
            <h1 style="color:#fff;font-size:20px;margin:0;">You're in the Talent Network</h1>
            <p style="color:#10B981;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0 0;">
              Fiber Guys LLC
            </p>
          </div>

          <p style="color:#999;font-size:14px;line-height:1.6;">
            We've added you to the list. When we spin up new jetting or splicing crews
            for major projects, you'll be the first to know.
          </p>

          <p style="color:#999;font-size:14px;line-height:1.6;margin-top:16px;">
            In the meantime, if you're ready to apply now:
          </p>

          <a href="https://fiberguysllc.com/careers" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#10B981;color:#fff;text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:bold;">
            View Open Positions
          </a>

          <p style="color:#333;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:16px;">
            Fiber Guys LLC — Nationwide Fiber Jetting &amp; Splicing<br/>
            Granger, TX
          </p>
        </div>
      `,
    });

    console.log(`[TalentPool] Welcome email sent to ${email}`);
  } catch (err) {
    // Don't fail the subscription if email fails
    console.error("[TalentPool] Welcome email failed:", err);
  }
}

export async function subscribeJobAlerts(
  formData: FormData
): Promise<SubscribeResult> {
  try {
    const raw = { email: (formData.get("email") as string) ?? "" };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email } = parsed.data;

    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const supabase = getSupabaseAdmin();

      // Check for duplicate
      const { data: existing } = await supabase
        .from("talent_pool")
        .select("id")
        .eq("email", email.toLowerCase())
        .limit(1);

      if (existing && existing.length > 0) {
        // Already subscribed — return success silently
        return { success: true };
      }

      const { error } = await supabase.from("talent_pool").insert({
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
      });

      if (error) {
        console.error("[TalentPool] Insert failed:", error.message);
        return { success: false, error: "Something went wrong. Try again." };
      }

      // Send welcome email (non-blocking — don't fail subscription on email error)
      await sendWelcomeEmail(email.toLowerCase());
    } catch (err) {
      console.warn("[TalentPool] Supabase not configured — logging:", err);
      console.log(`[TalentPool] ${email}`);
    }

    return { success: true };
  } catch (err) {
    console.error("[subscribeJobAlerts] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
