"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase";
import { authAttemptsTotal, serverActionDuration, serverActionTotal } from "@/lib/metrics";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: any, formData: FormData) {
  const endTimer = serverActionDuration.startTimer({ action: "loginAction" });
  try {
    const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let isValidUser = false;

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();
    
    if (data && await bcrypt.compare(password, data.password)) {
      isValidUser = true;
    }
  } else {
    const validEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const validPassword = process.env.ADMIN_PASSWORD || "adminpassword";
    if (email === validEmail && password === validPassword) {
      isValidUser = true;
    }
  }

  if (isValidUser) {
    authAttemptsTotal.inc({ status: "success" });
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    serverActionTotal.inc({ action: "loginAction", status: "success" });
    endTimer();
    redirect("/admin/dashboard");
  } else {
    authAttemptsTotal.inc({ status: "failure" });
    serverActionTotal.inc({ action: "loginAction", status: "success" });
    endTimer();
    return { error: "Invalid email or password" };
  }
  } catch (error) {
    serverActionTotal.inc({ action: "loginAction", status: "error" });
    endTimer();
    throw error;
  }
}

export async function logoutAction() {
  const endTimer = serverActionDuration.startTimer({ action: "logoutAction" });
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    serverActionTotal.inc({ action: "logoutAction", status: "success" });
    endTimer();
    redirect("/");
  } catch (error) {
    serverActionTotal.inc({ action: "logoutAction", status: "error" });
    endTimer();
    throw error;
  }
}
