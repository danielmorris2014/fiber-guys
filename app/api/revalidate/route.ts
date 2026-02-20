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
 * ISR cache for /gallery and /careers so changes appear without
 * waiting for the hourly revalidation window.
 */
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
    revalidatePath("/gallery");
    revalidatePath("/careers");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("[Revalidate] Error:", err);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 },
    );
  }
}
