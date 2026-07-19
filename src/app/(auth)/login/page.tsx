"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Loader2, LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function isValidRedirectPath(path: string): boolean {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  if (path.includes("javascript:")) return false;
  if (path.includes("data:")) return false;
  return true;
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/";
  const redirectTo = isValidRedirectPath(rawRedirect) ? rawRedirect : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setMessage(null);

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    window.location.href = redirectTo;
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsResetLoading(true);
    setResetMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });

    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage("Link reset password sudah dikirim ke email kamu. Cek inbox atau spam.");
    }
    setIsResetLoading(false);
  };

  if (isResetMode) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[20%] w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: "1s" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md z-10"
        >
          <div className="backdrop-blur-2xl bg-card/60 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Reset Password</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Lupa Password</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
            </p>

            <form className="mt-7 space-y-4" onSubmit={resetPassword}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Mail className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email kamu"
                  required
                  className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              {resetMessage && (
                <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {resetMessage}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20"
                disabled={isResetLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                  {isResetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Kirim Link Reset
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetMessage(null);
                }}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Kembali ke Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
                <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Sign</span>{" "}
                <span className="text-foreground">In</span>
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Selamat datang kembali! Silakan masuk ke akun kamu.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-xl border-border/50 bg-background/50 hover:bg-accent/50 transition-all duration-300 group"
              onClick={loginWithGoogle}
              disabled={isLoading}
            >
              <GoogleIcon />
              <span className="ml-2 font-medium">Login dengan Google</span>
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border/50" />
              atau
              <span className="h-px flex-1 bg-border/50" />
            </div>

            <form className="space-y-4" onSubmit={loginWithEmail}>
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
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Lock className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password"
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
                    <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Register
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Lupa Password?
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Photo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src="/img/farhan.png"
            alt="Farhan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
