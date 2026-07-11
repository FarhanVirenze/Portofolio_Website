import crypto from "node:crypto";
import { getServiceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

function signCallback(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string) {
  return crypto.createHmac("sha256", apiKey).update(`${merchantCode}${amount}${merchantOrderId}`).digest("hex");
}

export async function POST(request: Request) {
  const apiKey = process.env.DUITKU_API_KEY;

  if (!apiKey) {
    return new Response("Duitku API key is not configured", { status: 500 });
  }

  const formData = await request.formData();
  const merchantCode = String(formData.get("merchantCode") ?? "");
  const amount = String(formData.get("amount") ?? "");
  const merchantOrderId = String(formData.get("merchantOrderId") ?? "");
  const resultCode = String(formData.get("resultCode") ?? "");
  const paymentCode = String(formData.get("paymentCode") ?? "");
  const reference = String(formData.get("reference") ?? "");
  const signature = String(formData.get("signature") ?? "");

  if (!merchantCode || !amount || !merchantOrderId || !signature) {
    return new Response("Invalid callback payload", { status: 400 });
  }

  const expectedSignature = signCallback(merchantCode, amount, merchantOrderId, apiKey);

  if (signature.toLowerCase() !== expectedSignature.toLowerCase()) {
    return new Response("Invalid callback signature", { status: 400 });
  }

  const callbackPayload = Object.fromEntries(formData.entries());
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
  await supabase.from("checkout_transactions").update(updatePayload).eq("merchant_order_id", merchantOrderId);

  console.info("Duitku V2 callback received", {
    merchantCode,
    amount,
    merchantOrderId,
    resultCode,
    reference,
    paid: resultCode === "00",
  });

  return new Response("OK", { status: 200 });
}
