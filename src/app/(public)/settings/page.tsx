"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { Loader2, Save, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type UserProfile = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
};

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6 py-28">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    }>
      <SettingsPageInner />
    </Suspense>
  );
}

function SettingsPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (response.ok) {
        setProfile({
          full_name: data.profile.full_name ?? "",
          email: data.profile.email ?? user.email ?? "",
          phone: data.profile.phone ?? "",
          address: data.profile.address ?? "",
        });
      } else {
        setMessage(data?.message ?? "Profil belum bisa dimuat.");
      }

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.message ?? "Profil gagal disimpan.");
      setIsSaving(false);
      return;
    }

    setProfile({
      full_name: data.profile.full_name ?? "",
      email: data.profile.email ?? profile.email,
      phone: data.profile.phone ?? "",
      address: data.profile.address ?? "",
    });
    setMessage("Profil berhasil disimpan.");
    setIsSaving(false);

    if (redirectTo) {
      window.location.href = redirectTo;
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage("Password berhasil diubah.");
      setNewPassword("");
    }
    setIsChangingPassword(false);
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("delete_user_account" as any);
    if (!error) {
      await supabase.auth.signOut();
      window.location.href = "/";
    } else {
      setPasswordMessage("Gagal menghapus akun. Silakan hubungi admin.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-background px-6 py-28">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Profile Settings</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Data Checkout</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Data ini dipakai otomatis saat checkout, jadi pembeli tidak perlu mengisi ulang nama, email, telepon, dan alamat.
        </p>

        {isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat profil...
          </div>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={saveProfile}>
            <label className="block space-y-2 text-sm font-medium text-foreground">
              Nama Lengkap
              <Input
                value={profile.full_name}
                onChange={(event) => setProfile((current) => ({ ...current, full_name: event.target.value }))}
                required
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-foreground">
              Email
              <Input value={profile.email} disabled />
            </label>
            <label className="block space-y-2 text-sm font-medium text-foreground">
              Nomor Telepon
              <Input
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                required
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-foreground">
              Alamat
              <Textarea
                value={profile.address}
                onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))}
                required
              />
            </label>

            {message && (
              <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                {message}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" className="h-11 flex-1 rounded-xl" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan
              </Button>
              <Link
                href={redirectTo || "/#products"}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Kembali Checkout
              </Link>
            </div>
          </form>
        )}

        {!isLoading && (
          <>
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Key className="h-5 w-5" />
                Ubah Password
              </h2>
              <form className="mt-4 space-y-4" onSubmit={changePassword}>
                <label className="block space-y-2 text-sm font-medium text-foreground">
                  Password Baru
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </label>
                {passwordMessage && (
                  <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    {passwordMessage}
                  </p>
                )}
                <Button type="submit" size="lg" className="h-11 rounded-xl" disabled={isChangingPassword}>
                  {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  Ubah Password
                </Button>
              </form>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-destructive">
                <Trash2 className="h-5 w-5" />
                Hapus Akun
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Menghapus akun akan menghapus semua data kamu secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              {!showDeleteConfirm ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  className="mt-4 h-11 rounded-xl"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Akun
                </Button>
              ) : (
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    className="h-11 rounded-xl"
                    onClick={deleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Ya, Hapus Akun
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-xl"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
