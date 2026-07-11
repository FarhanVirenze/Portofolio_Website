import { redirect } from "next/navigation";
import { DuitkuPaymentClient } from "@/components/duitku-payment-client";
import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { findPaymentMethod } from "@/lib/store";

type PaymentPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

type PaymentOrder = {
  merchant_order_id: string;
  product_name: string;
  payment_method: string;
  amount: number;
  status: string;
  payment_url: string | null;
  expires_at: string | null;
};

function isExpiredAt(expiresAt: string | null) {
  return expiresAt ? new Date(expiresAt).getTime() <= Date.now() : false;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;
  const merchantOrderId = params.order;

  if (!merchantOrderId) {
    redirect("/orders");
  }

  const authSupabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = getServiceSupabase();
  const { data: order, error } = await supabase
    .from("checkout_transactions")
    .select("merchant_order_id, product_name, payment_method, amount, status, payment_url, expires_at")
    .eq("merchant_order_id", merchantOrderId)
    .eq("user_id", user.id)
    .single<PaymentOrder>();

  if (error || !order) {
    redirect("/orders");
  }

  const isExpired = isExpiredAt(order.expires_at);

  if (!order.payment_url || isExpired || order.status !== "pending") {
    redirect(`/orders`);
  }

  const paymentMethodName = findPaymentMethod(order.payment_method)?.name ?? order.payment_method;

  return (
    <DuitkuPaymentClient
      paymentUrl={order.payment_url}
      productName={order.product_name}
      paymentMethodName={paymentMethodName}
      amount={order.amount}
      merchantOrderId={order.merchant_order_id}
    />
  );
}
