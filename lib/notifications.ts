/**
 * Lead notification emails via Resend.
 *
 * Required env var:
 *   RESEND_API_KEY — API key from resend.com dashboard
 *
 * Optional:
 *   NOTIFICATION_EMAIL — Override recipient (defaults to info@fiberguysllc.com)
 */

import { Resend } from "resend";

interface LeadNotification {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  projectType: string;
  estimatedFootage: string;
  targetDate: string;
  notes: string;
  fileUrls: string[];
}

const PROJECT_LABELS: Record<string, string> = {
  jetting: "Fiber Jetting",
  splicing: "Precision Splicing",
  both: "Jetting + Splicing",
  emergency: "Emergency Restoration",
};

export async function sendLeadNotification(
  lead: LeadNotification
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient =
    process.env.NOTIFICATION_EMAIL || "info@fiberguysllc.com";

  if (!apiKey) {
    console.warn("[Notifications] No RESEND_API_KEY set — logging instead");
    console.log("--- LEAD NOTIFICATION ---");
    console.log(`To: ${recipient}`);
    console.log(`Subject: [NEW BID] Project Review: ${lead.companyName}`);
    console.log(`Contact: ${lead.contactName} (${lead.email})`);
    console.log(`Phone: ${lead.phone}`);
    console.log(`Type: ${lead.projectType}`);
    console.log(`Footage: ${lead.estimatedFootage || "Not specified"}`);
    console.log(`Target: ${lead.targetDate || "Not specified"}`);
    console.log(`Notes: ${lead.notes || "None"}`);
    console.log(`Files: ${lead.fileUrls.length}`);
    console.log("-------------------------");
    return;
  }

  const resend = new Resend(apiKey);

  const filesSection =
    lead.fileUrls.length > 0
      ? `<h3 style="color:#2563EB;margin-top:24px;">Attached Prints</h3>
         <ul>${lead.fileUrls.map((url) => `<li><a href="${url}" style="color:#60A5FA;">${url.split("/").pop()}</a></li>`).join("")}</ul>`
      : "<p style='color:#666;'>No files attached</p>";

  await resend.emails.send({
    from: "Fiber Guys Dispatch <dispatch@fiberguysllc.com>",
    to: [recipient],
    subject: `[NEW BID] Project Review: ${lead.companyName}`,
    html: `
      <div style="font-family:monospace;background:#050505;color:#e0e0e0;padding:32px;max-width:600px;">
        <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:24px;">
          <h1 style="color:#fff;font-size:20px;margin:0;">New Project Review Request</h1>
          <p style="color:#2563EB;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:4px 0 0;">
            ${PROJECT_LABELS[lead.projectType] || lead.projectType}
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#666;width:140px;">Company</td>
            <td style="padding:8px 0;color:#fff;">${lead.companyName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;">Contact</td>
            <td style="padding:8px 0;color:#fff;">${lead.contactName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${lead.email}" style="color:#60A5FA;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;">Phone</td>
            <td style="padding:8px 0;"><a href="tel:${lead.phone}" style="color:#60A5FA;">${lead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;">Est. Footage</td>
            <td style="padding:8px 0;color:#fff;">${lead.estimatedFootage || "—"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;">Target Date</td>
            <td style="padding:8px 0;color:#fff;">${lead.targetDate || "—"}</td>
          </tr>
        </table>

        ${lead.notes ? `<div style="margin-top:24px;padding:16px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;"><p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Notes</p><p style="color:#ccc;margin:0;white-space:pre-wrap;">${lead.notes}</p></div>` : ""}

        ${filesSection}

        <p style="color:#333;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:16px;">
          Fiber Guys LLC — Automated Dispatch Notification
        </p>
      </div>
    `,
  });
}

// ---------------------------------------------------------------------------
// Auto-responder — confirmation email to the submitter
// ---------------------------------------------------------------------------
export async function sendLeadConfirmation(
  lead: Pick<LeadNotification, "contactName" | "email" | "projectType" | "targetDate">
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[Auto-Responder] No RESEND_API_KEY — skipping confirmation to", lead.email);
    return;
  }

  const resend = new Resend(apiKey);
  const projectLabel = PROJECT_LABELS[lead.projectType] || lead.projectType;
  const mobilization = lead.targetDate || "To be determined";
  const firstName = lead.contactName.split(" ")[0] || lead.contactName;

  await resend.emails.send({
    from: "Fiber Guys Dispatch <dispatch@fiberguysllc.com>",
    replyTo: "info@fiberguysllc.com",
    to: [lead.email],
    subject: "Project Review Initiated // Fiber Guys LLC",
    html: `
      <div style="font-family:'Courier New',Courier,monospace;background:#050505;color:#d4d4d4;padding:40px 32px;max-width:600px;line-height:1.7;">

        <div style="border-left:3px solid #2563EB;padding-left:16px;margin-bottom:32px;">
          <p style="color:#2563EB;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 4px;">
            Fiber Guys LLC // Dispatch
          </p>
          <h1 style="color:#ffffff;font-size:18px;font-weight:700;margin:0;">
            Project Review Initiated
          </h1>
        </div>

        <p style="color:#d4d4d4;font-size:14px;margin:0 0 20px;">
          ${firstName},
        </p>

        <p style="color:#d4d4d4;font-size:14px;margin:0 0 20px;">
          Project specs received.
        </p>

        <p style="color:#a3a3a3;font-size:13px;margin:0 0 20px;">
          This is an automated confirmation that your project details and prints
          have been successfully routed to our management team. Zach and the
          operations team are currently reviewing the scope, conduit
          specifications, and target mobilization dates you provided.
        </p>

        <p style="color:#a3a3a3;font-size:13px;margin:0 0 28px;">
          We will review your requirements and respond shortly with crew
          availability and a production timeline.
        </p>

        <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;padding:20px;margin-bottom:28px;">
          <p style="color:#2563EB;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 14px;font-weight:700;">
            Submission Details
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:6px 0;color:#666;width:160px;">Project Type</td>
              <td style="padding:6px 0;color:#ffffff;">${projectLabel}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#666;">Target Mobilization</td>
              <td style="padding:6px 0;color:#ffffff;">${mobilization}</td>
            </tr>
          </table>
        </div>

        <p style="color:#a3a3a3;font-size:13px;margin:0 0 32px;">
          If you need immediate emergency mobilization, please reply directly
          to this email or call dispatch.
        </p>

        <div style="border-top:1px solid #1a1a1a;padding-top:20px;">
          <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
            &mdash;<br/>
            <span style="color:#888;">Fiber Guys LLC Operations</span><br/>
            <span style="color:#666;">Nationwide Fiber Jetting &amp; Splicing</span>
          </p>
        </div>

      </div>
    `,
  });
}
