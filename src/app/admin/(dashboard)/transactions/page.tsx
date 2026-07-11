import { getServiceSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ReceiptText, Clock, CheckCircle } from "lucide-react";
import { RevenueLineChart, StatusPieChart, ProductBarChart, PaymentMethodPieChart } from "@/components/admin/transaction-charts";
import { TransactionTable } from "@/components/admin/transaction-table";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default async function AdminTransactionsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let transactions: any[] = [];
  let totalRevenue = 0;
  let totalTransactions = 0;
  let pendingCount = 0;
  let paidCount = 0;
  let revenueLast30Days: { date: string; revenue: number }[] = [];
  let statusBreakdown: { name: string; value: number }[] = [];
  let productBreakdown: { name: string; revenue: number; count: number }[] = [];
  let paymentBreakdown: { name: string; value: number }[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const { data: txRows } = await supabase
      .from("checkout_transactions")
      .select("id, merchant_order_id, product_name, product_id, customer_name, email, amount, payment_method, status, created_at, paid_at");

    transactions = txRows || [];
    totalTransactions = transactions.length;
    paidCount = transactions.filter((t) => t.status === "paid").length;
    pendingCount = transactions.filter((t) => t.status === "pending").length;
    totalRevenue = transactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + (t.amount || 0), 0);

    // Revenue last 30 days
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayRevenue = transactions
        .filter((t) => t.status === "paid" && t.created_at.startsWith(dateStr))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      revenueLast30Days.push({ date: dateStr, revenue: dayRevenue });
    }

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    transactions.forEach((t) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });
    statusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Product breakdown
    const productMap: Record<string, { revenue: number; count: number }> = {};
    transactions.forEach((t) => {
      const key = t.product_name || "Unknown";
      if (!productMap[key]) productMap[key] = { revenue: 0, count: 0 };
      productMap[key].count += 1;
      if (t.status === "paid") productMap[key].revenue += t.amount || 0;
    });
    productBreakdown = Object.entries(productMap).map(([name, data]) => ({ name, ...data }));

    // Payment method breakdown
    const paymentCounts: Record<string, number> = {};
    transactions.forEach((t) => {
      const method = t.payment_method || "Unknown";
      paymentCounts[method] = (paymentCounts[method] || 0) + 1;
    });
    paymentBreakdown = Object.entries(paymentCounts).map(([name, value]) => ({ name, value }));
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-2">Monitor semua transaksi penjualan produk digital.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code>.
        </div>
      )}

      {isSupabaseConfigured && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Dari {paidCount} transaksi berhasil</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                <ReceiptText className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground mt-1">Semua status</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="w-5 h-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Menunggu pembayaran</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Berhasil</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{paidCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Pembayaran sukses</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Revenue 30 Hari Terakhir</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueLineChart data={revenueLast30Days} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusPieChart data={statusBreakdown} />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue per Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductBarChart data={productBreakdown} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodPieChart data={paymentBreakdown} />
              </CardContent>
            </Card>
          </div>

          {/* Transaction Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Semua Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
