import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isValidRedirectPath(path: string): boolean {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  if (path.includes("javascript:")) return false;
  if (path.includes("data:")) return false;
  return true;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  const redirectPath = isValidRedirectPath(next) ? next : "/";

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const serviceSupabase = getServiceSupabase();
      await serviceSupabase.from("user_profiles").upsert(
        {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || null,
        },
        { onConflict: "id" }
      );
    }
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
