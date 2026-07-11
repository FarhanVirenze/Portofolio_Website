import { getServiceSupabase } from "@/lib/supabase";
import { Package } from "lucide-react";
import { AddProductForm } from "@/components/admin/add-product-form";
import { ProductCardList } from "@/components/admin/product-card-list";

export default async function AdminProductsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let products: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const p = await supabase.from("products").select("*").order("created_at", { ascending: false });
    products = p.data || [];
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
        <p className="text-muted-foreground mt-2">Kelola produk digital yang dijual di toko.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code>.
        </div>
      )}

      {isSupabaseConfigured && (
        <div className="space-y-8">
          <AddProductForm />

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              Current Products ({products.length})
            </h2>
            <ProductCardList products={products} />
          </div>
        </div>
      )}
    </div>
  );
}
