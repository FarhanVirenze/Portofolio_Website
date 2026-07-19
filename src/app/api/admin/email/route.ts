import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || !verifySessionToken(session.value).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionData = verifySessionToken(session.value);
  return NextResponse.json({ email: sessionData.email || "" });
}
