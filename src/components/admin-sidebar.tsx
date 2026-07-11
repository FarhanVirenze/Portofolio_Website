"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Award, LayoutDashboard, LogOut, Package, BarChart3, Shield } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/admin/transactions", icon: BarChart3 },
  { label: "Home", href: "/admin/home", icon: Home },
  { label: "About", href: "/admin/about", icon: User },
  { label: "Portfolio", href: "/admin/portofolio", icon: FolderOpen },
  { label: "Certification", href: "/admin/certification", icon: Award },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Admin Settings", href: "/admin/admin-settings", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">F</span>
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage Content</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex justify-around items-center py-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isActive && <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary" />}
              </Link>
            );
          })}
          {/* Logout Button */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
