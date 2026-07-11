"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRupiah, paymentMethods, products, supportContact, type Product } from "@/lib/store";

type CheckoutState = {
  productId: string;
  paymentMethod: string;
};

const initialCheckoutState: CheckoutState = {
  productId: products[0]?.id ?? "",
  paymentMethod: paymentMethods[0]?.code ?? "VC",
};

export function StoreSection() {
  const [checkout, setCheckout] = useState<CheckoutState>(initialCheckoutState);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === checkout.productId) ?? products[0],
    [checkout.productId]
  );

  const updateCheckout = (field: keyof CheckoutState, value: string) => {
    setCheckout((current) => ({ ...current, [field]: value }));
  };

  const startCheckout = (product: Product) => {
    setCheckout((current) => ({ ...current, productId: product.id }));
    setMessage(null);
    window.requestAnimationFrame(() => {
      document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout/duitku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: checkout.productId,
          paymentMethod: checkout.paymentMethod,
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

      if (typeof data.paymentUrl === "string") {
        window.location.href = data.paymentUrl;
        return;
      }

      throw new Error("Duitku tidak mengembalikan URL pembayaran.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="products" className="relative z-10 w-full bg-background py-24">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              Produk digital
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Paket pengembangan website dan aplikasi untuk membantu usaha tampil rapi, mudah dihubungi, dan siap menerima pembayaran online.
            </p>
          </div>
          <a
            href="#checkout"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Checkout
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className={cn(
                "flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
                selectedProduct.id === product.id ? "border-primary/50" : "border-border"
              )}
            >
              <div className="flex flex-1 flex-col gap-5">
                <div>
                  <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    {product.timeline}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    {formatRupiah(product.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Harga mulai dari</p>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="button"
                size="lg"
                className="mt-6 h-11 w-full gap-2 rounded-xl"
                onClick={() => startCheckout(product)}
              >
                <ShoppingCart className="h-4 w-4" />
                Beli Sekarang
              </Button>
            </article>
          ))}
        </div>

        <div id="checkout" className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Duitku API V2
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Checkout Pembelian
                </h3>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-right">
                <p className="text-xs text-muted-foreground">{selectedProduct.shortName}</p>
                <p className="text-sm font-semibold text-primary">{formatRupiah(selectedProduct.price)}</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={submitCheckout}>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                Produk
                <select
                  value={checkout.productId}
                  onChange={(event) => updateCheckout("productId", event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
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
                  value={checkout.paymentMethod}
                  onChange={(event) => updateCheckout("paymentMethod", event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.code} value={method.code}>
                      {method.name} ({method.code})
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                Checkout memakai data akun dari profile user. Lengkapi nama, nomor telepon, dan alamat di{" "}
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
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                Bayar dengan Duitku
              </Button>
            </form>
          </div>

          <aside id="support" className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Kontak Support
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Bantuan Pembelian
            </h3>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <a
                href={`mailto:${supportContact.email}`}
                className="flex items-start gap-3 rounded-xl border border-border/70 p-4 transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground">Email</span>
                  {supportContact.email}
                </span>
              </a>
              <a
                href={`tel:${supportContact.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-start gap-3 rounded-xl border border-border/70 p-4 transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground">Telepon</span>
                  {supportContact.phone}
                </span>
              </a>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground">Alamat Usaha</span>
                  {supportContact.address}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
