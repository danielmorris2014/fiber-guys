"use server";

import { z } from "zod";
import { Resend } from "resend";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phone: z.string().min(1, "Phone number is required").max(30),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  position: z.string().min(1, "Select a position"),
  yearsExperience: z.string().min(1, "Years of experience is required"),
  hasCDL: z.enum(["yes", "no"], { message: "CDL status is required" }),
  equipmentExperience: z.string().max(3000).optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

export interface SubmitApplicationResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  trackingNumber?: string;
}

function generateTrackingNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FG-${date}-${rand}`;
}

export async function submitApplication(
  formData: FormData
): Promise<SubmitApplicationResult> {
  try {
    const raw = {
      firstName: (formData.get("firstName") as string) ?? "",
      lastName: (formData.get("lastName") as string) ?? "",
      phone: (formData.get("phone") as string) ?? "",
      email: (formData.get("email") as string) ?? "",
      position: (formData.get("position") as string) ?? "",
      yearsExperience: (formData.get("yearsExperience") as string) ?? "",
      hasCDL: (formData.get("hasCDL") as string) ?? "",
      equipmentExperience: (formData.get("equipmentExperience") as string) ?? "",
      website: (formData.get("website") as string) ?? "",
    };

    // Honeypot
    if (raw.website) {
      return { success: true };
    }

    const parsed = applicationSchema.safeParse(raw);
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
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const trackingNumber = generateTrackingNumber();

    // Handle optional resume attachment
    const resumeFile = formData.get("resume") as File | null;
    let resumeAttachment: { filename: string; content: Buffer } | null = null;
    let resumeUrl: string | null = null;

    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      resumeAttachment = { filename: resumeFile.name, content: buffer };

      // Upload resume to Supabase Storage
      try {
        const { getSupabaseAdmin } = await import("@/lib/supabase");
        const supabase = getSupabaseAdmin();
        const filePath = `${trackingNumber}/${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("application-files")
          .upload(filePath, buffer, { contentType: resumeFile.type });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("application-files")
            .getPublicUrl(filePath);
          resumeUrl = urlData.publicUrl;
        } else {
          console.warn("[Application] Resume upload failed:", uploadError.message);
        }
      } catch {
        // Storage not configured — continue without URL
      }
    }

    // Insert into Supabase applications table
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const supabase = getSupabaseAdmin();

      const { error } = await supabase.from("applications").insert({
        tracking_number: trackingNumber,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        position: data.position,
        years_experience: data.yearsExperience,
        has_cdl: data.hasCDL,
        equipment_experience: data.equipmentExperience || null,
        resume_url: resumeUrl,
        status: "submitted",
      });

      if (error) {
        console.error("[Application] Supabase insert failed:", error.message);
        // Continue — don't fail the application just because DB insert failed
      }
    } catch (err) {
      console.warn("[Application] Supabase not configured:", err);
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("--- NEW APPLICATION ---");
      console.log(`Tracking: ${trackingNumber}`);
      console.log(`Name: ${fullName}`);
      console.log(`Email: ${data.email}`);
      console.log(`Phone: ${data.phone}`);
      console.log(`Position: ${data.position}`);
      console.log(`Experience: ${data.yearsExperience} years`);
      console.log(`CDL: ${data.hasCDL}`);
      console.log(`Equipment: ${data.equipmentExperience || "Not specified"}`);
      if (resumeAttachment) {
        const sizeMB = (resumeAttachment.content.length / (1024 * 1024)).toFixed(1);
        console.log(`Resume: ${resumeAttachment.filename} (${sizeMB} MB)`);
      } else {
        console.log("Resume: Not provided");
      }
      console.log("-----------------------");
      return { success: true, trackingNumber };
    }

    const resend = new Resend(apiKey);

    // Send internal notification
    await resend.emails.send({
      from: "Fiber Guys Careers <dispatch@fiberguysllc.com>",
      to: ["careers@fiberguysllc.com"],
      replyTo: data.email,
      subject: `[NEW APPLICANT] ${fullName} — ${data.position}`,
      ...(resumeAttachment ? { attachments: [resumeAttachment] } : {}),
      html: `
        <div style="font-family:'Courier New',Courier,monospace;background:#050505;color:#e0e0e0;padding:32px;max-width:600px;">
          <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:24px;">
            <h1 style="color:#fff;font-size:20px;margin:0;">New Field Operator Application</h1>
            <p style="color:#2563EB;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0 0;">
              ${data.position} &mdash; ${trackingNumber}
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#666;width:160px;">Name</td>
              <td style="padding:8px 0;color:#fff;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#60A5FA;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Phone</td>
              <td style="padding:8px 0;"><a href="tel:${data.phone}" style="color:#60A5FA;">${data.phone}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">OSP Experience</td>
              <td style="padding:8px 0;color:#fff;">${data.yearsExperience} years</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Valid CDL</td>
              <td style="padding:8px 0;color:${data.hasCDL === "yes" ? "#4ade80" : "#f87171"};">${data.hasCDL === "yes" ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Tracking #</td>
              <td style="padding:8px 0;color:#60A5FA;">${trackingNumber}</td>
            </tr>
          </table>

          ${
            data.equipmentExperience
              ? `<div style="margin-top:24px;padding:16px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;">
                  <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Equipment Experience</p>
                  <p style="color:#ccc;margin:0;white-space:pre-wrap;">${data.equipmentExperience}</p>
                </div>`
              : ""
          }

          <p style="color:#333;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:16px;">
            Fiber Guys LLC — Automated Careers Notification
          </p>
        </div>
      `,
    });

    // Send confirmation email to applicant
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiberguysllc.com";
      await resend.emails.send({
        from: "Fiber Guys Careers <dispatch@fiberguysllc.com>",
        to: [data.email],
        subject: `Application Received — ${trackingNumber}`,
        html: `
          <div style="font-family:'Courier New',Courier,monospace;background:#050505;color:#e0e0e0;padding:32px;max-width:600px;">
            <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:24px;">
              <h1 style="color:#fff;font-size:20px;margin:0;">Application Received</h1>
              <p style="color:#2563EB;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0 0;">
                Fiber Guys LLC
              </p>
            </div>

            <p style="color:#999;font-size:14px;line-height:1.6;">
              Hey ${data.firstName},<br/><br/>
              We received your application for <strong style="color:#fff;">${data.position}</strong>.
              Our team reviews applications on a rolling basis. If your experience matches what we need in the field,
              dispatch will reach out directly.
            </p>

            <div style="margin:24px 0;padding:16px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;">
              <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Your Tracking Number</p>
              <p style="color:#60A5FA;font-size:18px;font-weight:bold;margin:0;">${trackingNumber}</p>
            </div>

            <p style="color:#999;font-size:14px;line-height:1.6;">
              You can check your application status anytime:
            </p>

            <a href="${siteUrl}/careers/status" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#2563EB;color:#fff;text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:bold;">
              Check Application Status
            </a>

            <p style="color:#333;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:16px;">
              Fiber Guys LLC — Nationwide Fiber Jetting &amp; Splicing<br/>
              Granger, TX
            </p>
          </div>
        `,
      });
    } catch (err) {
      // Don't fail the application if confirmation email fails
      console.error("[Application] Confirmation email failed:", err);
    }

    console.log(`[Careers] Application received: ${fullName} — ${data.position} (${trackingNumber})`);

    return { success: true, trackingNumber };
  } catch (err) {
    console.error("[submitApplication] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
