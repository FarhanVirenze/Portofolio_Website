import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfilePayload = {
  full_name?: string;
  phone?: string;
  address?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, email, phone, address, avatar_url")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return Response.json({ message: error.message }, { status: 500 });
  }

  const profile = data ?? {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    email: user.email || "",
    phone: "",
    address: "",
    avatar_url: user.user_metadata?.avatar_url || null,
  };

  return Response.json({ profile });
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ProfilePayload;
  const fullName = clean(body.full_name);
  const phone = clean(body.phone);
  const address = clean(body.address);

  if (!fullName || !phone || !address) {
    return Response.json({ message: "Nama, nomor telepon, dan alamat wajib diisi." }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        email: user.email || "",
        phone,
        address,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
      { onConflict: "id" }
    )
    .select("id, full_name, email, phone, address, avatar_url")
    .single();

  if (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  return Response.json({ profile: data });
}
