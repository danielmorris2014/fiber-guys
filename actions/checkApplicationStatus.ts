"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export interface ApplicationStatusEntry {
  trackingNumber: string;
  position: string;
  status: string;
  createdAt: string;
  statusUpdatedAt: string;
}

export interface CheckStatusResult {
  success: boolean;
  error?: string;
  applications?: ApplicationStatusEntry[];
}

export async function checkApplicationStatus(
  formData: FormData
): Promise<CheckStatusResult> {
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

      const { data, error } = await supabase
        .from("applications")
        .select("tracking_number, position, status, created_at, status_updated_at")
        .eq("email", email.toLowerCase())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[StatusLookup] Query failed:", error.message);
        return { success: false, error: "Unable to look up applications. Please try again." };
      }

      const applications: ApplicationStatusEntry[] = (data || []).map((row) => ({
        trackingNumber: row.tracking_number,
        position: row.position,
        status: row.status,
        createdAt: row.created_at,
        statusUpdatedAt: row.status_updated_at,
      }));

      return { success: true, applications };
    } catch (err) {
      console.warn("[StatusLookup] Supabase not configured:", err);
      return { success: true, applications: [] };
    }
  } catch (err) {
    console.error("[checkApplicationStatus] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
