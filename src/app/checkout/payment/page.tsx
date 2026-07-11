import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
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
    .select("merchant_order_id, product_name, payment_method, amount, payment_url, expires_at")
    .eq("merchant_order_id", merchantOrderId)
    .eq("user_id", user.id)
    .single<PaymentOrder>();

  if (error || !order) {
    redirect("/orders");
  }

  const isExpired = isExpiredAt(order.expires_at);

  if (!order.payment_url || isExpired) {
    redirect("/orders");
  }

  const paymentMethodName = findPaymentMethod(order.payment_method)?.name ?? order.payment_method;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ExternalLink className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Halaman Pembayaran</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Klik tombol di bawah untuk membuka halaman pembayaran Duitku.
          </p>

          <div className="mt-5 rounded-xl border border-border/70 bg-muted/20 p-4 text-left text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="font-medium text-foreground">{order.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium text-foreground">{paymentMethodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominal</span>
                <span className="font-medium text-primary">{formatRupiah(order.amount)}</span>
              </div>
            </div>
          </div>

          <a
            href={order.payment_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <ExternalLink className="h-4 w-4" />
            Bayar Sekarang
          </a>
        </div>

        <div className="flex justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Status di Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
