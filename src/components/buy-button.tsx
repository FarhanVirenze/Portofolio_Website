"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/store";

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

function loadDuitkuSdk(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.checkout !== "undefined") {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src*="duitku"]`);
    if (existingScript) {
      const start = Date.now();
      const interval = setInterval(() => {
        if (typeof window.checkout !== "undefined") {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > 8000) {
          clearInterval(interval);
          resolve(false);
        }
      }, 200);
      return;
    }

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_DUITKU_POP_JS_URL || "https://app-prod.duitku.com/lib/js/duitku.js";
    script.onload = () => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (typeof window.checkout !== "undefined") {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > 5000) {
          clearInterval(interval);
          resolve(false);
        }
      }, 200);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

type BuyButtonProps = {
  product: Product;
  className?: string;
};

export function BuyButton({ product, className }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileRes = await fetch("/api/user/profile");
      const profileData = await profileRes.json().catch(() => null);

      if (!profileRes.ok) {
        window.location.href = `/login?redirect=${encodeURIComponent("/")}`;
        return;
      }

      const p = profileData?.profile;
      if (!p || !p.full_name || !p.phone || !p.address) {
        window.location.href = `/settings?redirect=${encodeURIComponent("/")}`;
        return;
      }

      const sdkReady = await loadDuitkuSdk();
      if (!sdkReady) {
        throw new Error("Duitku Pop tidak tersedia. Pastikan JavaScript tidak diblokir.");
      }

      const response = await fetch("/api/checkout/duitku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
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
            setError("Terjadi kesalahan pada pembayaran. Silakan coba lagi.");
            setIsLoading(false);
          },
          closeEvent: () => {
            setError("Popup ditutup. Klik lagi untuk melanjutkan.");
            setIsLoading(false);
          },
        });
        return;
      }

      throw new Error("Gateway pembayaran tidak mengembalikan referensi transaksi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat checkout.");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("mt-6 space-y-2", className)}>
      <button
        type="button"
        onClick={handleBuy}
        disabled={isLoading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
        {isLoading ? "Memproses..." : "Beli Sekarang"}
      </button>
      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
