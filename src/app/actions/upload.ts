"use server";

import { getServiceSupabase } from "@/lib/supabase";
import { fileUploadsTotal, fileUploadSize, trackServerAction } from "@/lib/metrics";

export const uploadImage = trackServerAction("uploadImage", async (formData: FormData): Promise<string> => {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No file provided");
  }

  const supabase = getServiceSupabase();

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  fileUploadsTotal.inc({ type: "image", status: "success" });
  fileUploadSize.observe({ type: "image" }, file.size);
  return urlData.publicUrl;
});
