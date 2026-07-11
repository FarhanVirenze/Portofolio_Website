import crypto from "node:crypto";
import { getServiceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

function signCallbackHmac(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string) {
  return crypto.createHmac("sha256", apiKey).update(`${merchantCode}${amount}${merchantOrderId}`).digest("hex");
}

function signCallbackMd5(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string) {
  return crypto.createHash("md5").update(`${merchantCode}${amount}${merchantOrderId}${apiKey}`).digest("hex");
}

async function parseCallbackPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as Record<string, unknown>;

    return Object.fromEntries(Object.entries(json).map(([key, value]) => [key, String(value ?? "")]));
  }

  const formData = await request.formData();

  return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
}

export async function POST(request: Request) {
  const apiKey = process.env.DUITKU_API_KEY?.trim();

  if (!apiKey) {
    return new Response("Duitku API key is not configured", { status: 500 });
  }

  const callbackPayload = await parseCallbackPayload(request);
  const merchantCode = callbackPayload.merchantCode || "";
  const amount = callbackPayload.amount || callbackPayload.paymentAmount || "";
  const merchantOrderId = callbackPayload.merchantOrderId || "";
  const resultCode = callbackPayload.resultCode || "";
  const paymentCode = callbackPayload.paymentCode || "";
  const reference = callbackPayload.reference || "";
  const signature = callbackPayload.signature || "";

  if (!merchantCode || !amount || !merchantOrderId || !signature) {
    return new Response("Invalid callback payload", { status: 400 });
  }

  const validSignatures = [
    signCallbackMd5(merchantCode, amount, merchantOrderId, apiKey),
    signCallbackHmac(merchantCode, amount, merchantOrderId, apiKey),
  ];

  if (!validSignatures.some((validSignature) => signature.toLowerCase() === validSignature.toLowerCase())) {
    return new Response("Invalid callback signature", { status: 400 });
  }

  const status = resultCode === "00" ? "paid" : resultCode === "01" ? "pending" : "cancelled";
  const updatePayload: Record<string, unknown> = {
    status,
    result_code: resultCode,
    duitku_reference: reference || null,
    raw_callback: callbackPayload,
    paid_at: resultCode === "00" ? new Date().toISOString() : null,
  };

  if (paymentCode) {
    updatePayload.payment_method = paymentCode;
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from("checkout_transactions")
    .update(updatePayload)
    .eq("merchant_order_id", merchantOrderId);

  if (error) {
    console.error("Failed to update Duitku callback transaction", {
      merchantOrderId,
      resultCode,
      message: error.message,
    });

    return new Response("Failed to update transaction", { status: 500 });
  }

  console.info("Duitku Pop callback received", {
    merchantCode,
    amount,
    merchantOrderId,
    resultCode,
    reference,
    paid: resultCode === "00",
  });

  return new Response("OK", { status: 200 });
}
