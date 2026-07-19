"use server";

import { getServiceSupabase } from "@/lib/supabase";
import { fileUploadsTotal, fileUploadSize, trackServerAction } from "@/lib/metrics";
import { validateImageFile, sanitizeError } from "@/lib/validation";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  if (!sessionCookie || !verifySessionToken(sessionCookie.value).valid) {
    throw new Error("Unauthorized Access");
  }
}

export const uploadImage = trackServerAction("uploadImage", async (formData: FormData): Promise<string> => {
  await verifyAuth();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No file provided");
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = getServiceSupabase();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    fileUploadsTotal.inc({ type: "image", status: "error" });
    throw new Error("Upload failed. Please try again.");
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  fileUploadsTotal.inc({ type: "image", status: "success" });
  fileUploadSize.observe({ type: "image" }, file.size);
  return urlData.publicUrl;
});
