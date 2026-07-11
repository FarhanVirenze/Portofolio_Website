"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="mt-3 text-muted-foreground">
          Sepertinya halaman yang kamu cari sudah tidak ada atau dipindahkan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </section>
  );
}
