"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Package, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah, products } from "@/lib/store";

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
  const initialProduct = products.find((product) => product.id === initialProductId) ?? products[0];
  const [productId, setProductId] = useState(initialProduct.id);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then((data) => {
        const p = data?.profile;
        if (!p || !p.full_name || !p.phone || !p.address) {
          setProfileIncomplete(true);
        }
      })
      .catch(() => {});
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? products[0],
    [productId]
  );

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const sdkReady = await waitForCheckoutSdk();
      if (!sdkReady) {
        throw new Error("Duitku Pop tidak tersedia. Pastikan JavaScript tidak diblokir lalu coba lagi.");
      }

      const response = await fetch("/api/checkout/duitku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
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
            setIsLoading(false);
          },
          closeEvent: () => {
            setMessage("Popup pembayaran ditutup. Klik tombol lagi untuk melanjutkan.");
            setIsLoading(false);
          },
        });
        return;
      }

      throw new Error("Gateway pembayaran tidak mengembalikan referensi transaksi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat checkout.");
      setIsLoading(false);
    }
  };

  return (
    <section className="relative z-10 min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 md:px-10 md:py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke produk
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.85fr] lg:gap-8">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 md:mb-4 md:h-10 md:w-10">
                <ShoppingCart className="h-4 w-4 text-primary md:h-5 md:w-5" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Checkout</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Selesaikan Pembelian</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 md:text-base">
                Pilih produk lalu pilih metode pembayaran langsung di Duitku Pop. Data nama, email, telepon, dan alamat diambil dari profile akun.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submitCheckout}>
              {profileIncomplete && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-red-600 dark:text-red-400">Data checkout belum lengkap</p>
                    <p className="mt-1 text-red-600/80 dark:text-red-400/80">
                      Lengkapi nama, telepon, dan alamat di{" "}
                      <Link href="/settings" className="font-medium underline underline-offset-2 hover:text-red-600 dark:hover:text-red-300">
                        Settings
                      </Link>{" "}
                      sebelum melanjutkan pembayaran.
                    </p>
                  </div>
                </div>
              )}

              <label className="block space-y-2 text-sm font-medium text-foreground">
                Produk
                <select
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors [color-scheme:dark] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id} className="bg-background text-foreground">
                      {product.name} - {formatRupiah(product.price)}
                    </option>
                  ))}
                </select>
              </label>

              {message && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {message}
                </p>
              )}

              <Button type="submit" size="lg" className="h-11 w-full gap-2 rounded-xl" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Bayar Sekarang
              </Button>
            </form>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ringkasan Pesanan</p>

            <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-4 sm:mt-6 sm:p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-4 sm:h-12 sm:w-12">
                <Package className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{selectedProduct.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">{selectedProduct.description}</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-primary sm:mt-5 sm:text-3xl">
                {formatRupiah(selectedProduct.price)}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground sm:mt-5 sm:space-y-3">
              {selectedProduct.includes.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border/70 p-3.5 text-sm sm:mt-6 sm:p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Pembayaran</p>
              <p className="mt-1 font-medium text-foreground">Dipilih di Duitku Pop</p>
              <p className="mt-1 text-muted-foreground">Pilih metode pembayaran setelah klik Bayar</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
