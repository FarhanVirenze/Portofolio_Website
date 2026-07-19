import { NextResponse } from "next/server";
import { metricsRegistry } from "@/lib/metrics";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession || !verifySessionToken(adminSession.value).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await metricsRegistry.metrics();

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        "Content-Type": metricsRegistry.contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error collecting metrics:", error);
    return NextResponse.json(
      { error: "Failed to collect metrics" },
      { status: 500 }
    );
  }
}
