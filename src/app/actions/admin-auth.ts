"use server";

import bcrypt from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function hashAdminPassword(plainPassword: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    throw new Error("Unauthorized");
  }

  const hash = await bcrypt.hash(plainPassword, 10);
  return hash;
}

export async function updateAdminPassword(email: string, newPassword: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    throw new Error("Unauthorized");
  }

  const supabase = getServiceSupabase();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from("admins")
    .update({ password: hashedPassword })
    .eq("email", email);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function seedAdminWithHash(email: string, plainPassword: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    throw new Error("Unauthorized");
  }

  const supabase = getServiceSupabase();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const { error } = await supabase
    .from("admins")
    .upsert({ email, password: hashedPassword }, { onConflict: "email" });

  if (error) throw new Error(error.message);
  return { success: true, hash: hashedPassword };
}
