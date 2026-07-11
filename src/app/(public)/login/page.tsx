"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setMessage(null);

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
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

    window.location.href = "/";
  };

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6 py-28">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">User Login</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Masuk Akun</h1>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-7 h-11 w-full rounded-xl"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
          Login dengan Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          atau
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={loginWithEmail}>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Email
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Password
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {message && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {message}
            </p>
          )}

          <Button type="submit" size="lg" className="h-11 w-full rounded-xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Login
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary/80">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
