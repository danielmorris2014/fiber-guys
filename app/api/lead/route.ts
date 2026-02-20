import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { processSubmission } from "@/lib/lead-handlers";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(ip, 5, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    // Honeypot check — silently succeed if filled
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Extract fields
    const companyName = (formData.get("companyName") as string)?.trim() || "";
    const contactName = (formData.get("contactName") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const cityState = (formData.get("cityState") as string)?.trim() || "";
    const serviceNeeded = (formData.get("serviceNeeded") as string)?.trim() || "";
    const targetStartDate = (formData.get("targetStartDate") as string)?.trim() || "";
    const estimatedFootage = (formData.get("estimatedFootage") as string)?.trim() || "";
    const notes = (formData.get("notes") as string)?.trim() || "";

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!companyName) errors.companyName = "Company name is required";
    if (!contactName) errors.contactName = "Contact name is required";
    if (!email) errors.email = "Email is required";
    else if (!validateEmail(email)) errors.email = "Please enter a valid email";
    if (!phone) errors.phone = "Phone number is required";
    if (!cityState) errors.cityState = "City / State is required";
    if (!serviceNeeded || !["jetting", "splicing", "both", "emergency"].includes(serviceNeeded)) {
      errors.serviceNeeded = "Please select a service";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    // Collect files
    const files: File[] = [];
    const fileEntries = formData.getAll("files");
    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) {
        files.push(entry);
      }
    }

    // Process submission
    await processSubmission({
      companyName,
      contactName,
      email,
      phone,
      cityState,
      serviceNeeded,
      targetStartDate,
      estimatedFootage,
      notes,
      files,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
