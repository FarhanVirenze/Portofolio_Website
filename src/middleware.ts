import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Hanya jalankan middleware ini di route yang dimulai dengan /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Abaikan pengecekan untuk halaman login itu sendiri
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Cek apakah cookie admin_session ada
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie || sessionCookie.value !== "true") {
      // Jika tidak ada cookie atau value tidak valid, arahkan kembali ke halaman login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Jika aman, lanjutkan ke halaman yang dituju
  return NextResponse.next();
}

// Konfigurasi agar middleware hanya berjalan pada path tertentu (optimalisasi performa)
export const config = {
  matcher: ["/admin/:path*"],
};
