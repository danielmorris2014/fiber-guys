"use server";

import { z } from "zod";

const referralSchema = z.object({
  referrerName: z.string().min(1, "Your name is required").max(200),
  referrerEmail: z.string().min(1, "Your email is required").email("Enter a valid email"),
  referrerPhone: z.string().max(30).optional().default(""),
  candidateName: z.string().min(1, "Candidate name is required").max(200),
  candidateEmail: z.string().min(1, "Candidate email is required").email("Enter a valid email"),
  candidatePhone: z.string().max(30).optional().default(""),
  position: z.string().max(200).optional().default(""),
  notes: z.string().max(3000).optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

export interface SubmitReferralResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitReferral(
  formData: FormData
): Promise<SubmitReferralResult> {
  try {
    const raw = {
      referrerName: (formData.get("referrerName") as string) ?? "",
      referrerEmail: (formData.get("referrerEmail") as string) ?? "",
      referrerPhone: (formData.get("referrerPhone") as string) ?? "",
      candidateName: (formData.get("candidateName") as string) ?? "",
      candidateEmail: (formData.get("candidateEmail") as string) ?? "",
      candidatePhone: (formData.get("candidatePhone") as string) ?? "",
      position: (formData.get("position") as string) ?? "",
      notes: (formData.get("notes") as string) ?? "",
      website: (formData.get("website") as string) ?? "",
    };

    // Honeypot
    if (raw.website) {
      return { success: true };
    }

    const parsed = referralSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const data = parsed.data;

    // Insert into Supabase
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const supabase = getSupabaseAdmin();

      const { error } = await supabase.from("referrals").insert({
        referrer_name: data.referrerName,
        referrer_email: data.referrerEmail.toLowerCase(),
        referrer_phone: data.referrerPhone || null,
        candidate_name: data.candidateName,
        candidate_email: data.candidateEmail.toLowerCase(),
        candidate_phone: data.candidatePhone || null,
        position: data.position || null,
        notes: data.notes || null,
        status: "submitted",
      });

      if (error) {
        console.error("[Referral] Supabase insert failed:", error.message);
      }
    } catch (err) {
      console.warn("[Referral] Supabase not configured — logging:", err);
      console.log("[Referral]", JSON.stringify(data, null, 2));
    }

    // Send notification email
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);

        await resend.emails.send({
          from: "Fiber Guys Careers <dispatch@fiberguysllc.com>",
          to: ["careers@fiberguysllc.com"],
          replyTo: data.referrerEmail,
          subject: `[REFERRAL] ${data.candidateName} — referred by ${data.referrerName}`,
          html: `
            <div style="font-family:'Courier New',Courier,monospace;background:#050505;color:#e0e0e0;padding:32px;max-width:600px;">
              <div style="border-left:3px solid #F59E0B;padding-left:16px;margin-bottom:24px;">
                <h1 style="color:#fff;font-size:20px;margin:0;">New Referral</h1>
                <p style="color:#F59E0B;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0 0;">
                  Referral Program
                </p>
              </div>

              <h3 style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Referred By</h3>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
                <tr><td style="padding:6px 0;color:#666;width:120px;">Name</td><td style="color:#fff;">${data.referrerName}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Email</td><td><a href="mailto:${data.referrerEmail}" style="color:#60A5FA;">${data.referrerEmail}</a></td></tr>
                ${data.referrerPhone ? `<tr><td style="padding:6px 0;color:#666;">Phone</td><td style="color:#fff;">${data.referrerPhone}</td></tr>` : ""}
              </table>

              <h3 style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Candidate</h3>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
                <tr><td style="padding:6px 0;color:#666;width:120px;">Name</td><td style="color:#fff;">${data.candidateName}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Email</td><td><a href="mailto:${data.candidateEmail}" style="color:#60A5FA;">${data.candidateEmail}</a></td></tr>
                ${data.candidatePhone ? `<tr><td style="padding:6px 0;color:#666;">Phone</td><td style="color:#fff;">${data.candidatePhone}</td></tr>` : ""}
                ${data.position ? `<tr><td style="padding:6px 0;color:#666;">Position</td><td style="color:#fff;">${data.position}</td></tr>` : ""}
              </table>

              ${data.notes ? `<div style="padding:16px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;">
                <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Notes</p>
                <p style="color:#ccc;margin:0;white-space:pre-wrap;">${data.notes}</p>
              </div>` : ""}

              <p style="color:#333;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:16px;">
                Fiber Guys LLC — Automated Referral Notification
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[Referral] Email failed:", err);
      }
    } else {
      console.log("--- NEW REFERRAL ---");
      console.log(`Referrer: ${data.referrerName} (${data.referrerEmail})`);
      console.log(`Candidate: ${data.candidateName} (${data.candidateEmail})`);
      console.log(`Position: ${data.position || "Any"}`);
      console.log("--------------------");
    }

    return { success: true };
  } catch (err) {
    console.error("[submitReferral] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
