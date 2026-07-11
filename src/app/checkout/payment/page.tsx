import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { parseDuitkuResponse } from "@/lib/duitku";
import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { findPaymentMethod, formatRupiah } from "@/lib/store";

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
  raw_response: unknown;
  expires_at: string | null;
  created_at: string;
};

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
    .select("merchant_order_id, product_name, payment_method, amount, status, payment_url, raw_response, expires_at, created_at")
    .eq("merchant_order_id", merchantOrderId)
    .eq("user_id", user.id)
    .single<PaymentOrder>();

  if (error || !order) {
    redirect("/orders");
  }

  const paymentMethodName = findPaymentMethod(order.payment_method)?.name ?? order.payment_method;

  if (order.payment_url) {
    redirect(order.payment_url);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Menunggu Pembayaran</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Transaksi <span className="font-medium text-foreground">{order.product_name}</span> dengan metode{" "}
          <span className="font-medium text-foreground">{paymentMethodName}</span> sebesar{" "}
          <span className="font-medium text-foreground">{formatRupiah(order.amount)}</span> sedang diproses.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Mengalihkan ke halaman pembayaran...
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/orders"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Status di Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
