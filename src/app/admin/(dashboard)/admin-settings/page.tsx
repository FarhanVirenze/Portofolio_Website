"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Eye, EyeOff, CheckCircle } from "lucide-react";
import { updateAdminPassword } from "@/app/actions/admin-auth";
import { showToast } from "@/components/toast";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingEmail, setIsFetchingEmail] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const response = await fetch("/api/admin/email");
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email || "");
        }
      } catch {
        setEmail("");
      } finally {
        setIsFetchingEmail(false);
      }
    }
    fetchEmail();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateAdminPassword(email, newPassword);
      setMessage("Password admin berhasil diupdate dengan hash!");
      showToast("Password berhasil diupdate");
      setNewPassword("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Kelola akun admin dan keamanan password.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Update Password Admin
          </CardTitle>
          <CardDescription>
            Ganti password admin ke versi yang sudah di-hash dengan bcrypt. Password lama yang masih plaintext juga akan otomatis di-hash.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Admin</label>
              {isFetchingEmail ? (
                <div className="flex items-center gap-2 h-10 px-3 bg-muted/50 rounded-xl">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password Baru (plaintext)</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                  placeholder="Masukkan password baru..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password ini akan di-hash bcrypt sebelum disimpan ke database.
              </p>
            </div>

            {message && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !newPassword || isFetchingEmail}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {isLoading ? "Menghash & Update..." : "Hash & Simpan Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-sm">Info Keamanan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Password disimpan dengan <strong>bcrypt hash</strong> (cost factor 10).</p>
          <p>Format hash: <code className="bg-muted px-1 rounded">$2a$10$...</code></p>
          <p>Admin login mendukung:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Password bcrypt hashed (recommended)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
