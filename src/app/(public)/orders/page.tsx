"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, CreditCard, Loader2, PackageCheck, ReceiptText } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/store";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  merchant_order_id: string;
  duitku_reference: string | null;
  payment_url: string | null;
  product_name: string;
  payment_method: string;
  amount: number;
  status: string;
  display_status: string;
  result_code: string | null;
  created_at: string;
  expires_at: string | null;
  paid_at: string | null;
  is_expired: boolean;
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Dibayar",
  failed: "Gagal",
  cancelled: "Dibatalkan",
  expired: "Expired",
};

const statusStyles: Record<string, string> = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  failed: "border-destructive/20 bg-destructive/10 text-destructive",
  cancelled: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300",
  expired: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300",
};

function formatDateTime(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getRemainingText(expiresAt: string | null, status: string) {
  if (status !== "pending" || !expiresAt) return null;

  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) return "Waktu pembayaran habis";

  const minutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} jam ${restMinutes} menit tersisa`;
  }

  return `${Math.max(1, restMinutes)} menit tersisa`;
}

function getDisplayStatus(order: Order) {
  if (order.status === "pending" && order.expires_at && new Date(order.expires_at).getTime() <= Date.now()) {
    return "expired";
  }

  return order.display_status || order.status;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [, setNowTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTick((value) => value + 1);
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/orders");
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.message ?? "History pesanan belum bisa dimuat.");
        setIsLoading(false);
        return;
      }

      setOrders(data.orders ?? []);
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const summary = orders.reduce(
    (acc, order) => {
      const status = getDisplayStatus(order);
      if (status === "pending") acc.pending += 1;
      if (status === "paid") acc.paid += 1;
      if (status === "cancelled" || status === "expired") acc.cancelled += 1;
      return acc;
    },
    { pending: 0, paid: 0, cancelled: 0 }
  );

  return (
    <section className="relative z-10 min-h-screen bg-background px-6 py-28 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <ReceiptText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">History Pesanan</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Transaksi Pembayaran</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Lihat pesanan yang sudah dibuat, lanjutkan pembayaran yang masih pending, dan cek masa expired transaksi.
            </p>
          </div>

          <Link
            href="/#products"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Checkout Baru
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard label="Total Pesanan" value={orders.length} />
          <SummaryCard label="Pending" value={summary.pending} />
          <SummaryCard label="Dibayar" value={summary.paid} />
          <SummaryCard label="Dibatalkan" value={summary.cancelled} />
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat history pesanan...
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
            {message}
          </div>
        )}

        {!isLoading && !message && orders.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <PackageCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Belum ada pesanan</h2>
            <p className="mt-2 text-sm text-muted-foreground">Pesanan yang kamu checkout akan muncul di sini.</p>
          </div>
        )}

        {!isLoading && !message && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getDisplayStatus(order);
              const remainingText = getRemainingText(order.expires_at, status);
              const canPay = status === "pending" && Boolean(order.payment_url);

              return (
                <article key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                            statusStyles[status] ?? statusStyles.cancelled
                          )}
                        >
                          {statusLabels[status] ?? status}
                        </span>
                        {remainingText && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {remainingText}
                          </span>
                        )}
                      </div>

                      <h2 className="truncate text-xl font-semibold tracking-tight">{order.product_name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.merchant_order_id} · {order.payment_method} · {formatRupiah(order.amount)}
                      </p>

                      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                        <InfoItem label="Dibuat" value={formatDateTime(order.created_at)} />
                        <InfoItem label="Expired" value={formatDateTime(order.expires_at)} />
                        <InfoItem label="Reference" value={order.duitku_reference || "-"} />
                      </dl>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      {canPay && (
                        <Link
                          href={`/checkout/payment?order=${encodeURIComponent(order.merchant_order_id)}`}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                        >
                          <CreditCard className="h-4 w-4" />
                          Lanjut Bayar
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 p-3">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium text-foreground">{value}</dd>
    </div>
  );
}
