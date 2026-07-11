import Link from "next/link";
import { getServiceSupabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, FolderOpen, Award, ArrowRight, DollarSign, ReceiptText, Clock, CheckCircle } from "lucide-react";
import { RevenueMiniChart } from "@/components/admin/revenue-mini-chart";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Dibayar",
  failed: "Gagal",
  cancelled: "Dibatalkan",
};

const statusStyles: Record<string, string> = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  failed: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300",
  cancelled: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-300",
};

export default async function AdminDashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let skillsCount = 0;
  let projectsCount = 0;
  let certificationsCount = 0;
  let hasHomeContent = false;

  let totalRevenue = 0;
  let totalTransactions = 0;
  let pendingCount = 0;
  let paidCount = 0;
  let recentTransactions: any[] = [];
  let revenueLast7Days: { date: string; revenue: number }[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const [s, p, c, h] = await Promise.all([
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("certifications").select("id", { count: "exact", head: true }),
      supabase.from("home_content").select("id").limit(1),
    ]);
    skillsCount = s.count || 0;
    projectsCount = p.count || 0;
    certificationsCount = c.count || 0;
    hasHomeContent = (h.data && h.data.length > 0) || false;

    // Transaction stats
    const txResult = await supabase.from("checkout_transactions").select("amount, status, created_at, merchant_order_id, product_name, customer_name, email, payment_method, paid_at");
    const txRows = txResult.data || [];

    totalTransactions = txRows.length;
    paidCount = txRows.filter((t) => t.status === "paid").length;
    pendingCount = txRows.filter((t) => t.status === "pending").length;
    totalRevenue = txRows.filter((t) => t.status === "paid").reduce((sum, t) => sum + (t.amount || 0), 0);

    // Recent 5 transactions
    recentTransactions = txRows
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Revenue last 7 days
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayRevenue = txRows
        .filter((t) => t.status === "paid" && t.created_at.startsWith(dateStr))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      revenueLast7Days.push({ date: dateStr, revenue: dayRevenue });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Manage and update your portfolio website content from here.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code> with your actual Supabase URL and Keys to enable CRUD operations.
        </div>
      )}

      {isSupabaseConfigured && (
        <>
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 shadow-sm">
            <div className="relative z-10 max-w-xl space-y-4">
              <h2 className="text-2xl font-bold">Hello, Farhan!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You can easily add new projects, skills, certificates, and modify your home page greeting from the sidebar. Your changes will be reflected instantly across your portfolio.
              </p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block bg-gradient-to-l from-primary/30 to-transparent pointer-events-none" />
          </div>

          {/* Transaction Summary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Ringkasan Transaksi</h2>
              <Link href="/admin/transactions" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(totalRevenue)}</div>
                  <CardDescription>Dari {paidCount} transaksi berhasil</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                  <ReceiptText className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <CardDescription>Semua status transaksi</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
                  <CardDescription>Menunggu pembayaran</CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Berhasil</CardTitle>
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{paidCount}</div>
                  <CardDescription>Pembayaran sukses</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Revenue Mini Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue 7 Hari Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueMiniChart data={revenueLast7Days} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
              <Link href="/admin/transactions" className="text-sm text-primary hover:underline font-medium">
                Lihat Semua
              </Link>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada transaksi</p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{t.customer_name}</span>
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyles[t.status] || ""}`}>
                            {statusLabels[t.status] || t.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.product_name} · {t.merchant_order_id}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold">{formatRupiah(t.amount)}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDateTime(t.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Management */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Kelola Konten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Home Section</CardTitle>
                  <Home className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">{hasHomeContent ? "Configured" : "Not Set"}</div>
                  <CardDescription>Hero text & profile picture</CardDescription>
                  <Link href="/admin/home" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium pt-2">
                    Edit Home <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                  <User className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">{skillsCount}</div>
                  <CardDescription>Tech stack & tool skills</CardDescription>
                  <Link href="/admin/about" className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline font-medium pt-2">
                    Manage About <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FolderOpen className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">{projectsCount}</div>
                  <CardDescription>Showcased applications</CardDescription>
                  <Link href="/admin/portofolio" className="inline-flex items-center gap-1 text-sm text-green-500 hover:underline font-medium pt-2">
                    Manage Portfolio <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                  <Award className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">{certificationsCount}</div>
                  <CardDescription>Verified achievements</CardDescription>
                  <Link href="/admin/certification" className="inline-flex items-center gap-1 text-sm text-yellow-500 hover:underline font-medium pt-2">
                    Manage Certs <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
