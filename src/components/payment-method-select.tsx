"use client";

import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  QrCode,
  Store,
  WalletCards,
  Zap,
} from "lucide-react";
import { type PaymentMethod } from "@/lib/store";
import { cn } from "@/lib/utils";

type PaymentMethodSelectProps = {
  methods: PaymentMethod[];
  value: string;
  onChange: (code: string) => void;
};

const categoryConfig: Record<
  PaymentMethod["category"],
  { label: string; icon: typeof Building2; color: string }
> = {
  "virtual-account": { label: "Virtual Account", icon: Building2, color: "text-blue-500" },
  qris: { label: "QRIS", icon: QrCode, color: "text-emerald-500" },
  "e-wallet": { label: "E-Wallet", icon: WalletCards, color: "text-violet-500" },
  retail: { label: "Retail", icon: Store, color: "text-orange-500" },
  card: { label: "Kartu", icon: CreditCard, color: "text-rose-500" },
};

function getMethodIcon(code: string, category: PaymentMethod["category"]) {
  const iconMap: Record<string, typeof Building2> = {
    BC: Zap,
    M2: Zap,
    I1: Zap,
    BR: Zap,
    BT: Zap,
    B1: Zap,
    VA: Zap,
    A1: Zap,
    SP: QrCode,
    NQ: QrCode,
    GQ: QrCode,
    SQ: QrCode,
    OV: WalletCards,
    DA: WalletCards,
    LA: WalletCards,
    SA: WalletCards,
    FT: Store,
    VC: CreditCard,
  };

  return iconMap[code] ?? categoryConfig[category].icon;
}

export function PaymentMethodSelect({ methods, value, onChange }: PaymentMethodSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = methods.find((m) => m.code === value);
  const selectedCategory = selected ? categoryConfig[selected.category] : null;
  const SelectedIcon = selected ? getMethodIcon(selected.code, selected.category) : Building2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const grouped = methods.reduce(
    (acc, method) => {
      if (!acc[method.category]) acc[method.category] = [];
      acc[method.category].push(method);
      return acc;
    },
    {} as Record<PaymentMethod["category"], PaymentMethod[]>
  );

  const categoryOrder: PaymentMethod["category"][] = [
    "virtual-account",
    "qris",
    "e-wallet",
    "retail",
    "card",
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-background px-4 text-left text-sm outline-none transition-all",
          "hover:border-primary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          isOpen && "border-primary ring-3 ring-ring/50"
        )}
      >
        {selected && (
          <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10", selectedCategory?.color)}>
            <SelectedIcon className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block font-medium text-foreground">{selected.name}</span>
              <span className="block text-xs text-muted-foreground">{selected.description}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Pilih metode pembayaran</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95">
          {categoryOrder.map((category) => {
            const items = grouped[category];
            if (!items || items.length === 0) return null;

            const catConfig = categoryConfig[category];
            const CatIcon = catConfig.icon;

            return (
              <div key={category} className="mb-1">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <CatIcon className={cn("h-3 w-3", catConfig.color)} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {catConfig.label}
                  </span>
                </div>

                {items.map((method) => {
                  const isSelected = method.code === value;
                  const MethodIcon = getMethodIcon(method.code, method.category);

                  return (
                    <button
                      key={method.code}
                      type="button"
                      onClick={() => {
                        onChange(method.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-primary/10 text-primary"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted",
                          isSelected ? "bg-primary/20" : "",
                          catConfig.color
                        )}
                      >
                        <MethodIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{method.name}</span>
                        <span className="block text-xs text-muted-foreground">{method.description}</span>
                      </span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
