import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-grow p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
