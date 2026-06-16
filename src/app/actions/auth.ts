"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let isValidUser = false;

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    // In a real app we'd use Supabase Auth or hash passwords, but for this simple setup:
    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();
    
    if (data) {
      isValidUser = true;
    }
  } else {
    // Fallback to .env.local
    const validEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const validPassword = process.env.ADMIN_PASSWORD || "adminpassword";
    if (email === validEmail && password === validPassword) {
      isValidUser = true;
    }
  }

  if (isValidUser) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    redirect("/admin/dashboard");
  } else {
    return { error: "Invalid email or password" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/");
}
