"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addProduct } from "@/app/actions/crud";
import { Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/toast";

export function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addProduct(formData);
      showToast("Produk berhasil ditambahkan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Product
        </CardTitle>
        <CardDescription>Tambahkan produk digital baru ke toko.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input name="name" placeholder="e.g. Landing Page Bisnis" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Name</label>
              <Input name="short_name" placeholder="e.g. Landing Page" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" placeholder="Deskripsi produk..." rows={3} className="resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (IDR)</label>
              <Input name="price" type="number" placeholder="750000" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeline</label>
              <Input name="timeline" placeholder="e.g. 3-5 hari kerja" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Includes (comma separated)</label>
            <Input name="includes" placeholder="e.g. 1 halaman utama, Form kontak, SEO dasar" required />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
