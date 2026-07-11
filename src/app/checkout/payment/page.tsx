import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, ExternalLink, ReceiptText, ShieldCheck } from "lucide-react";
import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/store";

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
  created_at: string;
};

function formatDateTime(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getRemainingText(expiresAt: string | null) {
  if (!expiresAt) return "Ikuti instruksi pembayaran sebelum transaksi kedaluwarsa.";

  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) return "Waktu pembayaran sudah habis.";

  const minutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours > 0) return `${hours} jam ${restMinutes} menit tersisa`;

  return `${Math.max(1, restMinutes)} menit tersisa`;
}

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
    .select("merchant_order_id, product_name, payment_method, amount, status, payment_url, expires_at, created_at")
    .eq("merchant_order_id", merchantOrderId)
    .eq("user_id", user.id)
    .single<PaymentOrder>();

  if (error || !order) {
    redirect("/orders");
  }

  const isExpired = isExpiredAt(order.expires_at);
  const canPay = order.status === "pending" && !isExpired && Boolean(order.payment_url);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[380px_1fr]">
        <aside className="border-b border-border bg-card px-6 py-7 shadow-sm lg:border-b-0 lg:border-r lg:px-8">
          <Link
            href="/orders"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke history
          </Link>

          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <ReceiptText className="h-6 w-6 text-primary" />
          </div>

          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Halaman Pembayaran</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Selesaikan Transaksi</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Instruksi pembayaran Duitku ditampilkan di panel kanan tanpa kembali ke halaman home.
          </p>

          <dl className="mt-8 space-y-3 rounded-2xl border border-border bg-background p-5">
            <InfoItem label="Produk" value={order.product_name} />
            <InfoItem label="Order ID" value={order.merchant_order_id} />
            <InfoItem label="Metode" value={order.payment_method} />
            <InfoItem label="Nominal" value={formatRupiah(order.amount)} />
            <InfoItem label="Dibuat" value={formatDateTime(order.created_at)} />
            <InfoItem label="Expired" value={formatDateTime(order.expires_at)} />
          </dl>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{getRemainingText(order.expires_at)}</span>
          </div>

          {order.payment_url && (
            <a
              href={order.payment_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              Buka di tab baru
            </a>
          )}
        </aside>

        <section className="min-h-[720px] bg-muted/40 p-4 md:p-6 lg:min-h-screen">
          {canPay && order.payment_url ? (
            <div className="h-[calc(100vh-2rem)] min-h-[680px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl md:h-[calc(100vh-3rem)]">
              <iframe
                title={`Pembayaran ${order.merchant_order_id}`}
                src={order.payment_url}
                className="h-full w-full border-0 bg-white"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="flex min-h-[680px] items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="max-w-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {isExpired ? "Transaksi Expired" : "Pembayaran Tidak Tersedia"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {isExpired
                    ? "Buat checkout baru karena masa berlaku pembayaran ini sudah habis."
                    : "Link pembayaran belum tersedia atau status transaksi sudah berubah."}
                </p>
                <Link
                  href="/checkout"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  Checkout Baru
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
