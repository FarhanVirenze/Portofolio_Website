import { NextResponse } from "next/server";
import { metricsRegistry } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
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
      { error: "Failed to collect metrics", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
