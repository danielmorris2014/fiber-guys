import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/content-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  const validKeys = ["map", "faq", "site"];
  if (!validKeys.includes(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const data = await getContent(key);

  if (data === null) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
