"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
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

    window.location.href = "/";
  };

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6 py-28">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">User Register</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Buat Akun</h1>

        <form className="mt-7 space-y-4" onSubmit={register}>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Nama Lengkap
            <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Email
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Nomor Telepon
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Alamat
            <Textarea value={address} onChange={(event) => setAddress(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Password
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {message && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {message}
            </p>
          )}

          <Button type="submit" size="lg" className="h-11 w-full rounded-xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Register
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
