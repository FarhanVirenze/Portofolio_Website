"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Package, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah, paymentMethods, products } from "@/lib/store";

type CheckoutPageProps = {
  initialProductId?: string;
};

export function CheckoutPage({ initialProductId }: CheckoutPageProps) {
  const initialProduct = products.find((product) => product.id === initialProductId) ?? products[0];
  const [productId, setProductId] = useState(initialProduct.id);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.code ?? "VC");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? products[0],
    [productId]
  );

  const selectedPayment = useMemo(
    () => paymentMethods.find((method) => method.code === paymentMethod) ?? paymentMethods[0],
    [paymentMethod]
  );

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout/duitku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data?.redirectTo === "string") {
          window.location.href = data.redirectTo;
          return;
        }

        throw new Error(data?.message ?? "Checkout belum bisa diproses.");
      }

      if (typeof data.redirectTo === "string") {
        window.location.href = data.redirectTo;
        return;
      }

      if (typeof data.merchantOrderId === "string") {
        window.location.href = `/checkout/payment?order=${encodeURIComponent(data.merchantOrderId)}`;
        return;
      }

      throw new Error("Gateway pembayaran tidak mengembalikan halaman pembayaran.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative z-10 min-h-screen bg-background px-6 py-28 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke produk
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Checkout</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Selesaikan Pembelian</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Pilih produk dan metode pembayaran. Data nama, email, telepon, dan alamat akan otomatis diambil dari profile akun.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submitCheckout}>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                Produk
                <select
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatRupiah(product.price)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2 text-sm font-medium text-foreground">
                Metode Pembayaran
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.code} value={method.code}>
                      {method.name} ({method.code})
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                Belum lengkap data checkout? Perbarui nama, telepon, dan alamat di{" "}
                <Link href="/settings" className="font-medium text-primary hover:text-primary/80">
                  Settings
                </Link>
                .
              </div>

              {message && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {message}
                </p>
              )}

              <Button type="submit" size="lg" className="h-11 w-full gap-2 rounded-xl" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Lanjutkan Pembayaran
              </Button>
            </form>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ringkasan Pesanan</p>

            <div className="mt-6 rounded-xl border border-border/70 bg-muted/20 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">{selectedProduct.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selectedProduct.description}</p>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-primary">
                {formatRupiah(selectedProduct.price)}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              {selectedProduct.includes.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border/70 p-4 text-sm">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Pembayaran</p>
              <p className="mt-1 font-medium text-foreground">{selectedPayment?.name}</p>
              <p className="mt-1 text-muted-foreground">{selectedPayment?.description}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
