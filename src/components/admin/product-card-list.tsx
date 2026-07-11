"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Package, DollarSign, Clock } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProduct } from "@/app/actions/crud";
import { showToast } from "@/components/toast";

interface Product {
  id: string;
  name: string;
  short_name: string;
  description: string;
  price: number;
  timeline: string;
  includes: string[];
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCardList({ products }: { products: Product[] }) {
  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    showToast("Produk berhasil dihapus");
  };

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-muted-foreground">
        <Package className="w-12 h-12 stroke-[1] mb-2 text-muted-foreground/60" />
        <p className="text-sm font-medium">Belum ada produk.</p>
        <p className="text-xs">Gunakan form untuk menambah produk pertama.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border border-border/80 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 bg-card">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-foreground">{product.name}</h3>
            <ConfirmDialog
              title="Hapus Produk"
              description={`Yakin ingin menghapus produk "${product.name}"?`}
              onConfirm={() => handleDelete(product.id)}
            />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">{formatRupiah(product.price)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{product.timeline}</span>
            </div>
          </div>
          {product.includes && product.includes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-xs font-medium text-muted-foreground mb-2">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {product.includes.map((item, idx) => (
                  <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
