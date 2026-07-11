"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { products } from "@/lib/store";

declare global {
  interface Window {
    checkout?: {
      process: (
        reference: string,
        options: {
          defaultLanguage?: string;
          successEvent?: (result: { resultCode: string; merchantOrderId: string; reference: string }) => void;
          pendingEvent?: (result: { resultCode: string; merchantOrderId: string; reference: string }) => void;
          errorEvent?: (result: { resultCode: string; merchantOrderId: string; reference: string }) => void;
          closeEvent?: (result: { resultCode: string; merchantOrderId: string; reference: string }) => void;
        }
      ) => void;
    };
  }
}

type CheckoutPageProps = {
  initialProductId?: string;
};

function waitForCheckoutSdk(maxWaitMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.checkout !== "undefined") {
      resolve(true);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (typeof window.checkout !== "undefined") {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > maxWaitMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 200);
  });
}

export function CheckoutPage({ initialProductId }: CheckoutPageProps) {
  const [status, setStatus] = useState<"checking" | "processing" | "error">("checking");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        const product = products.find((p) => p.id === initialProductId);
        if (!product) {
          setMessage("Produk tidak ditemukan.");
          setStatus("error");
          return;
        }

        setStatus("processing");

        const sdkReady = await waitForCheckoutSdk();
        if (!sdkReady) {
          throw new Error("Duitku Pop tidak tersedia. Pastikan JavaScript tidak diblokir lalu coba lagi.");
        }

        const response = await fetch("/api/checkout/duitku", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          if (typeof data?.redirectTo === "string") {
            window.location.href = data.redirectTo;
            return;
          }
          throw new Error(data?.message ?? "Checkout belum bisa diproses.");
        }

        if (typeof data.reference === "string" && data.reference) {
          window.checkout!.process(data.reference, {
            defaultLanguage: "id",
            successEvent: (result) => {
              window.location.href = `/checkout/return?merchantOrderId=${encodeURIComponent(result.merchantOrderId)}&resultCode=${result.resultCode}&reference=${result.reference}`;
            },
            pendingEvent: (result) => {
              window.location.href = `/checkout/return?merchantOrderId=${encodeURIComponent(result.merchantOrderId)}&resultCode=${result.resultCode}&reference=${result.reference}`;
            },
            errorEvent: () => {
              setMessage("Terjadi kesalahan pada pembayaran. Silakan coba lagi.");
              setStatus("error");
            },
            closeEvent: () => {
              setMessage("Popup pembayaran ditutup. Silakan coba lagi dari halaman produk.");
              setStatus("error");
            },
          });
          return;
        }

        throw new Error("Gateway pembayaran tidak mengembalikan referensi transaksi.");
      } catch (error) {
        if (controller.signal.aborted) return;
        setMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat checkout.");
        setStatus("error");
      }
    };

    run();

    return () => controller.abort();
  }, [initialProductId]);

  const productName = products.find((p) => p.id === initialProductId)?.name ?? "Produk";

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6 py-28">
      <div className="w-full max-w-md text-center">
        {status !== "error" && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Memproses Pembayaran</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {status === "checking" ? "Mengecek data..." : `Membuat invoice untuk ${productName}...`}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <span className="text-2xl">!</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Gagal Memproses</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <Link
              href="/#products"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Produk
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
