"use server";

import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendLeadNotification, sendLeadConfirmation } from "@/lib/notifications";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  companyName: z.string().min(1, "Company name is required").max(200),
  phone: z.string().min(1, "Phone number is required").max(30),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  projectType: z.enum(["jetting", "splicing", "both", "emergency"], {
    message: "Select a project type",
  }),
  estimatedFootage: z.string().max(200).optional().default(""),
  targetDate: z.string().optional().default(""),
  notes: z.string().max(5000).optional().default(""),
  turnstileToken: z.string().optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------
export interface SubmitLeadResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Supabase helpers (lazy-loaded to avoid throwing when env vars are missing)
// ---------------------------------------------------------------------------
async function uploadFiles(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const urls: string[] = [];

  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = getSupabaseAdmin();
    const timestamp = Date.now();

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `prints/${timestamp}/${safeName}`;

      const { error } = await supabase.storage
        .from("lead-files")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (error) {
        console.error(`[Upload] Failed to upload ${file.name}:`, error.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("lead-files")
        .getPublicUrl(path);

      urls.push(urlData.publicUrl);
    }
  } catch (err) {
    console.warn("[Upload] Supabase not configured — skipping file uploads:", err);
  }

  return urls;
}

async function insertLead(lead: {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  service_needed: string;
  estimated_footage: string;
  target_date: string;
  notes: string;
  file_urls: string[];
}): Promise<void> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("leads").insert({
      ...lead,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[DB] Failed to insert lead:", error.message);
    }
  } catch (err) {
    console.warn("[DB] Supabase not configured — skipping database insert:", err);
  }
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------
export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  try {
    // Extract fields from FormData
    const raw = {
      firstName: formData.get("firstName") as string ?? "",
      lastName: formData.get("lastName") as string ?? "",
      companyName: formData.get("companyName") as string ?? "",
      phone: formData.get("phone") as string ?? "",
      email: formData.get("email") as string ?? "",
      projectType: formData.get("projectType") as string ?? "",
      estimatedFootage: formData.get("estimatedFootage") as string ?? "",
      targetDate: formData.get("targetDate") as string ?? "",
      notes: formData.get("notes") as string ?? "",
      turnstileToken: formData.get("cf-turnstile-response") as string ?? "",
      website: formData.get("website") as string ?? "",
    };

    // Honeypot — silently "succeed" if filled
    if (raw.website) {
      return { success: true };
    }

    // Validate with Zod
    const parsed = leadSchema.safeParse(raw);
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

    // Turnstile verification
    const turnstile = await verifyTurnstile(data.turnstileToken);
    if (!turnstile.success) {
      return {
        success: false,
        error: turnstile.error || "Bot verification failed. Please refresh and try again.",
      };
    }

    // Collect files
    const files: File[] = [];
    const fileEntries = formData.getAll("files");
    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) {
        // 25MB per file limit
        if (entry.size > 25 * 1024 * 1024) {
          return {
            success: false,
            error: `File "${entry.name}" exceeds the 25MB limit.`,
          };
        }
        files.push(entry);
      }
    }

    // Upload files to Supabase Storage
    const fileUrls = await uploadFiles(files);

    // Build contact name
    const contactName = `${data.firstName} ${data.lastName}`.trim();

    // Insert into database
    await insertLead({
      company_name: data.companyName,
      contact_name: contactName,
      email: data.email,
      phone: data.phone,
      service_needed: data.projectType,
      estimated_footage: data.estimatedFootage,
      target_date: data.targetDate,
      notes: data.notes,
      file_urls: fileUrls,
    });

    // Send internal notification + auto-responder to submitter
    // Fire both in parallel, neither blocks the success response
    await Promise.all([
      sendLeadNotification({
        companyName: data.companyName,
        contactName,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType,
        estimatedFootage: data.estimatedFootage,
        targetDate: data.targetDate,
        notes: data.notes,
        fileUrls,
      }).catch((err) => console.error("[Email] Internal notification failed:", err)),

      sendLeadConfirmation({
        contactName,
        email: data.email,
        projectType: data.projectType,
        targetDate: data.targetDate,
      }).catch((err) => console.error("[Email] Auto-responder failed:", err)),
    ]);

    // Console log for dev visibility
    console.log("--- Lead Submitted ---");
    console.log(`Company: ${data.companyName}`);
    console.log(`Contact: ${contactName} (${data.email})`);
    console.log(`Service: ${data.projectType}`);
    console.log(`Files: ${fileUrls.length}`);
    console.log("----------------------");

    return { success: true };
  } catch (err) {
    console.error("[submitLead] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
