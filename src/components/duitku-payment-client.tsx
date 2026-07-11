"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/store";

type DuitkuPaymentClientProps = {
  paymentUrl: string;
  productName: string;
  paymentMethodName: string;
  amount: number;
  merchantOrderId: string;
};

export function DuitkuPaymentClient({
  paymentUrl,
  productName,
  paymentMethodName,
  amount,
  merchantOrderId,
}: DuitkuPaymentClientProps) {
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  const openDuitkuPopup = useCallback(() => {
    setIsOpening(true);
    setPopupBlocked(false);

    const popup = window.open(
      paymentUrl,
      "duitku-payment",
      "width=500,height=700,scrollbars=yes,resizable=yes,top=100,left=200"
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setPopupBlocked(true);
      setIsOpening(false);
    } else {
      setIsOpening(false);

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
        }
      }, 500);
    }
  }, [paymentUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      openDuitkuPopup();
    }, 300);

    return () => clearTimeout(timer);
  }, [openDuitkuPopup]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Menunggu Pembayaran</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Halaman pembayaran Duitku sedang dibuka di popup. Selesaikan pembayaran di popup tersebut.
          </p>

          <div className="mt-5 rounded-xl border border-border/70 bg-muted/20 p-4 text-left text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="font-medium text-foreground">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span className="font-medium text-foreground">{paymentMethodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominal</span>
                <span className="font-medium text-primary">{formatRupiah(amount)}</span>
              </div>
            </div>
          </div>

          {popupBlocked && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
              <p className="mb-3">Popup diblokir browser. Klik tombol di bawah untuk membuka halaman pembayaran.</p>
              <button
                type="button"
                onClick={openDuitkuPopup}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
                Buka Halaman Pembayaran
              </button>
            </div>
          )}

          {!popupBlocked && !isOpening && (
            <p className="mt-4 text-xs text-muted-foreground">
              Setelah selesai membayar, status akan diperbarui otomatis.
            </p>
          )}
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
