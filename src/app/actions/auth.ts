"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase";
import { authAttemptsTotal, serverActionDuration, serverActionTotal } from "@/lib/metrics";
import { createSessionToken, SESSION_MAX_AGE } from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { sanitizeError } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: any, formData: FormData) {
  const endTimer = serverActionDuration.startTimer({ action: "loginAction" });
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const rateLimitKey = `login:${email}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      authAttemptsTotal.inc({ status: "rate_limited" });
      serverActionTotal.inc({ action: "loginAction", status: "rate_limited" });
      endTimer();
      return { error: `Too many login attempts. Please try again in ${rateLimit.resetIn} seconds.` };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

    if (!isSupabaseConfigured) {
      return { error: "Authentication system is not configured. Please contact administrator." };
    }

    let isValidUser = false;

    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (data) {
      isValidUser = await bcrypt.compare(password, data.password);
    }

    if (isValidUser) {
      resetRateLimit(rateLimitKey);
      authAttemptsTotal.inc({ status: "success" });

      const sessionToken = createSessionToken(email);
      const cookieStore = await cookies();
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE,
        path: "/",
      });

      serverActionTotal.inc({ action: "loginAction", status: "success" });
      endTimer();
      redirect("/admin/dashboard");
    } else {
      authAttemptsTotal.inc({ status: "failure" });
      serverActionTotal.inc({ action: "loginAction", status: "failure" });
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
