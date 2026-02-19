interface LeadSubmission {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  cityState: string;
  serviceNeeded: string;
  targetStartDate: string;
  estimatedFootage: string;
  notes: string;
  files: File[];
}

export async function processSubmission(submission: LeadSubmission): Promise<void> {
  // Log submission for dev
  console.log("--- New Lead Submission ---");
  console.log("Company:", submission.companyName);
  console.log("Contact:", submission.contactName);
  console.log("Email:", submission.email);
  console.log("Phone:", submission.phone);
  console.log("Location:", submission.cityState);
  console.log("Service:", submission.serviceNeeded);
  console.log("Start Date:", submission.targetStartDate || "Not specified");
  console.log("Est. Footage:", submission.estimatedFootage || "Not specified");
  console.log("Notes:", submission.notes || "None");
  console.log("Files:", submission.files.length);
  console.log("--------------------------");

  // --- Future integrations ---

  // Email notification (Resend/SendGrid):
  // await sendEmail({
  //   to: "crew@fiberguysllc.com",
  //   subject: `New Lead: ${submission.companyName}`,
  //   ...
  // });

  // File storage (S3/R2):
  // for (const file of submission.files) {
  //   await uploadToStorage(file, `leads/${submission.email}/${file.name}`);
  // }

  // Database (Supabase/Postgres):
  // await db.insert("leads", { ...submission, createdAt: new Date() });
}
