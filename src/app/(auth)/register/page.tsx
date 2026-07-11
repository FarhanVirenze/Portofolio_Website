"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Loader2, UserPlus, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setMessage("Register berhasil. Silakan cek email untuk konfirmasi lalu login.");
      setIsLoading(false);
      return;
    }

    const profileResponse = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, phone, address }),
    });

    if (!profileResponse.ok) {
      const data = await profileResponse.json().catch(() => null);
      setMessage(data?.message ?? "Akun dibuat, tapi profil belum tersimpan.");
      setIsLoading(false);
      return;
    }

    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-background">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-2xl bg-card/60 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="flex flex-col items-start mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Buat</span>{" "}
                <span className="text-foreground">Akun</span>
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Daftar untuk memulai menggunakan layanan kami.
              </p>
            </div>

            <form className="space-y-4" onSubmit={register}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <User className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nama lengkap kamu"
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@contoh.com"
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nomor Telepon</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Phone className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Alamat</label>
                <div className="relative group">
                  <div className="absolute top-3 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <MapPin className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Alamat lengkap kamu"
                    required
                    className="pl-12 min-h-[80px] bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Lock className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {message && (
                <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  Register
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-primary/5" />

        <div className="absolute top-[15%] right-[10%] w-[28rem] h-[28rem] bg-indigo-500/15 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[15%] left-[10%] w-[24rem] h-[24rem] bg-primary/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-violet-500/8 rounded-full blur-[60px] animate-float" style={{ animationDelay: "2s" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-12"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-500 via-primary to-violet-500 bg-clip-text text-transparent">
              Mulai Sekarang
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Buat akun baru dan nikmati semua fitur yang tersedia.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="backdrop-blur-sm bg-card/40 border border-border/30 rounded-2xl p-4 animate-float" style={{ animationDelay: "0s" }}>
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-card/40 border border-border/30 rounded-2xl p-4 animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-card/40 border border-border/30 rounded-2xl p-4 animate-float" style={{ animationDelay: "1s" }}>
              <div className="w-10 h-10 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
