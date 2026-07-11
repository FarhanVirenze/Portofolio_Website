import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const authSupabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await authSupabase.auth.getUser();

  if (error || !user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data, error: ordersError } = await supabase
    .from("checkout_transactions")
    .select(
      "id, merchant_order_id, duitku_reference, payment_url, product_name, payment_method, amount, status, result_code, raw_response, created_at, expires_at, paid_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    return Response.json({ message: ordersError.message }, { status: 500 });
  }

  const now = Date.now();
  const orders = (data ?? []).map((order) => {
    const expiresAt = order.expires_at ? new Date(order.expires_at).getTime() : null;
    const isExpired = order.status === "pending" && expiresAt !== null && expiresAt <= now;
    const rawResponse = order.raw_response as { paymentUrl?: string } | null;

    return {
      ...order,
      raw_response: undefined,
      payment_url: order.payment_url ?? rawResponse?.paymentUrl ?? null,
      display_status: isExpired ? "expired" : order.status,
      is_expired: isExpired,
    };
  });

  return Response.json({ orders });
}
