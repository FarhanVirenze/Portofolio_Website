"use client";

import { Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/store";
import { BuyButton } from "@/components/buy-button";
import type { Product } from "@/lib/store";

export function StoreSection({ products }: { products: Product[] }) {
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
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className={cn(
                "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
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

              <BuyButton product={product} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
