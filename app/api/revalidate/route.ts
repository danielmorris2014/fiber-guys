import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation webhook for Sanity CMS.
 *
 * Configure in Sanity dashboard → Settings → Webhooks:
 *   URL:    https://yourdomain.com/api/revalidate
 *   Method: POST
 *   Headers: x-revalidation-secret = <your REVALIDATION_SECRET env var>
 *
 * When content is published in Sanity, this instantly purges the
 * ISR cache so changes appear without waiting for the revalidation window.
 */

/** Map Sanity document types to the routes that depend on them */
const TYPE_TO_PATHS: Record<string, string[]> = {
  jobPosting: ["/careers"],
  galleryImage: ["/gallery"],
  siteSettings: ["/", "/careers", "/contact", "/about"],
  testimonial: ["/"],
  service: ["/services", "/services/jetting", "/services/splicing"],
  caseStudy: ["/case-studies", "/about"],
  faqItem: ["/careers"],
  libraryDocument: ["/documents"],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "REVALIDATION_SECRET not configured" },
      { status: 500 },
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    // Try to read the Sanity webhook payload to revalidate only affected paths
    let paths: string[] = [];
    try {
      const body = await request.json();
      const docType = body?._type as string | undefined;
      if (docType && TYPE_TO_PATHS[docType]) {
        paths = TYPE_TO_PATHS[docType];
      }
    } catch {
      // If body parsing fails, fall through to revalidate all
    }

    // Fallback: revalidate all content paths
    if (paths.length === 0) {
      paths = [...new Set(Object.values(TYPE_TO_PATHS).flat())];
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, paths, now: Date.now() });
  } catch (err) {
    console.error("[Revalidate] Error:", err);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 },
    );
  }
}
