"use server";

import bcrypt from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
import { sanitizeError } from "@/lib/validation";

async function verifyAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || !verifySessionToken(session.value).valid) {
    throw new Error("Unauthorized");
  }
}

export async function hashAdminPassword(plainPassword: string) {
  await verifyAuth();

  if (plainPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hash = await bcrypt.hash(plainPassword, 10);
  return hash;
}

export async function updateAdminPassword(email: string, newPassword: string) {
  await verifyAuth();

  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const supabase = getServiceSupabase();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from("admins")
    .update({ password: hashedPassword })
    .eq("email", email);

  if (error) throw new Error("Failed to update password");
  return { success: true };
}

export async function seedAdminWithHash(email: string, plainPassword: string) {
  await verifyAuth();

  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  if (plainPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const supabase = getServiceSupabase();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const { error } = await supabase
    .from("admins")
    .upsert({ email, password: hashedPassword }, { onConflict: "email" });

  if (error) throw new Error("Failed to create admin account");
  return { success: true, hash: hashedPassword };
}
