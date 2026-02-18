import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { setContent, getContent } from "@/lib/content-store";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, data } = await request.json();

  if (!key || !data) {
    return NextResponse.json(
      { error: "Missing key or data" },
      { status: 400 }
    );
  }

  const validKeys = ["map", "faq", "site"];
  if (!validKeys.includes(key)) {
    return NextResponse.json(
      { error: "Invalid content key" },
      { status: 400 }
    );
  }

  const result = await setContent(key, data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Revalidate affected pages
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json(
      { error: "Missing key parameter" },
      { status: 400 }
    );
  }

  const data = await getContent(key);
  return NextResponse.json(data);
}
