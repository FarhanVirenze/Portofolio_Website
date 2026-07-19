"use server";

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { trackServerAction, contentUpdatesTotal, fileUploadsTotal, fileUploadSize } from "@/lib/metrics";
import { verifySessionToken } from "@/lib/session";
import {
  validateString,
  validateRequired,
  validateUrl,
  validateNumber,
  validateArray,
  validateImageFile,
  sanitizeError,
} from "@/lib/validation";

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  if (!sessionCookie || !verifySessionToken(sessionCookie.value).valid) {
    throw new Error("Unauthorized Access");
  }
}

async function uploadFileToStorage(file: File): Promise<string> {
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
    .upload(filePath, file, { cacheControl: "3600", upsert: false, contentType: file.type });

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
}

async function uploadBase64ToStorage(base64DataUrl: string): Promise<string> {
  const supabase = getServiceSupabase();
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 data URL");

  const mimeType = matches[1];
  const base64Data = matches[2];

  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedMimes.includes(mimeType)) {
    throw new Error("File type not allowed");
  }

  const ext = mimeType.split("/")[1] || "jpeg";
  const buffer = Buffer.from(base64Data, "base64");

  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("File size exceeds maximum of 5MB");
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: mimeType,
    });

  if (error) {
    fileUploadsTotal.inc({ type: "image", status: "error" });
    throw new Error("Upload failed. Please try again.");
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  fileUploadsTotal.inc({ type: "image", status: "success" });
  fileUploadSize.observe({ type: "image" }, buffer.length);
  return urlData.publicUrl;
}

// HOME CONTENT
export const updateHomeContent = trackServerAction("updateHomeContent", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const roles = validateArray(formData.get("roles"), "roles");
  const cv_url = validateUrl(formData.get("cv_url"), "cv_url");
  const greeting = validateString(formData.get("greeting"), "greeting");
  const description = validateString(formData.get("description"), "description", 5000);

  const resumeFile = formData.get("resume_file") as File;
  let finalCvUrl = cv_url;
  if (resumeFile && resumeFile.size > 0) {
    finalCvUrl = await uploadFileToStorage(resumeFile);
  }

  const base64Image = formData.get("profile_image_base64") as string;
  const existingUrl = formData.get("existing_profile_image_url") as string;
  let finalImageUrl: string | undefined;

  if (base64Image) {
    finalImageUrl = await uploadBase64ToStorage(base64Image);
  } else if (existingUrl) {
    finalImageUrl = existingUrl.split("?pos=")[0];
  }

  const updateData: any = { roles, cv_url: finalCvUrl, greeting, description };
  if (finalImageUrl) updateData.profile_image_url = finalImageUrl;

  const { error } = await supabase.from("home_content").update(updateData).eq("id", id);
  if (error) throw new Error("Failed to update home content");

  contentUpdatesTotal.inc({ content_type: "home", operation: "update" });
  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/dashboard");
});

// ABOUT CONTENT
export const updateAboutContent = trackServerAction("updateAboutContent", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const rawParagraphs = validateString(formData.get("paragraphs"), "paragraphs", 10000);
  const paragraphs = rawParagraphs.split(/\n\n+/).map((p) => p.trim()).filter((p) => p.length > 0);

  for (const p of paragraphs) {
    if (p.length > 2000) {
      throw new Error("Each paragraph must not exceed 2000 characters");
    }
  }

  const base64Image = formData.get("profile_image_base64") as string;
  const existingUrl = formData.get("existing_profile_image_url") as string;
  let finalImageUrl: string | undefined;

  if (base64Image) {
    finalImageUrl = await uploadBase64ToStorage(base64Image);
  } else if (existingUrl) {
    finalImageUrl = existingUrl.split("?pos=")[0];
  }

  const updateData: any = { paragraphs };
  if (finalImageUrl) updateData.profile_image_url = finalImageUrl;

  const { error } = await supabase.from("about_content").update(updateData).eq("id", id);
  if (error) throw new Error("Failed to update about content");

  contentUpdatesTotal.inc({ content_type: "about", operation: "update" });
  revalidatePath("/about");
  revalidatePath("/admin/about");
});

// SKILLS
export const addSkill = trackServerAction("addSkill", async (formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const name = validateRequired(formData.get("name"), "name");
  const category = validateRequired(formData.get("category"), "category");
  const level = validateRequired(formData.get("level"), "level");

  let icon_url = validateUrl(formData.get("icon_url"), "icon_url");
  const iconFile = formData.get("icon_file") as File;
  if (iconFile && iconFile.size > 0) {
    icon_url = await uploadFileToStorage(iconFile);
  }

  const { error } = await supabase.from("skills").insert([{ name, category, level, icon_url }]);
  if (error) throw new Error("Failed to add skill");

  contentUpdatesTotal.inc({ content_type: "skill", operation: "create" });
  revalidatePath("/about");
  revalidatePath("/admin/about");
});

export const updateSkill = trackServerAction("updateSkill", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const name = validateRequired(formData.get("name"), "name");
  const category = validateRequired(formData.get("category"), "category");
  const level = validateRequired(formData.get("level"), "level");

  const updateData: any = { name, category, level };

  let icon_url = validateUrl(formData.get("icon_url"), "icon_url");
  const iconFile = formData.get("icon_file") as File;
  if (iconFile && iconFile.size > 0) {
    updateData.icon_url = await uploadFileToStorage(iconFile);
  } else if (icon_url) {
    updateData.icon_url = icon_url;
  }

  const { error } = await supabase.from("skills").update(updateData).eq("id", id);
  if (error) throw new Error("Failed to update skill");

  contentUpdatesTotal.inc({ content_type: "skill", operation: "update" });
  revalidatePath("/about");
  revalidatePath("/admin/about");
});

export const deleteSkill = trackServerAction("deleteSkill", async (id: string) => {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error("Failed to delete skill");

  contentUpdatesTotal.inc({ content_type: "skill", operation: "delete" });
  revalidatePath("/about");
  revalidatePath("/admin/about");
});

// PROJECTS
export const addProject = trackServerAction("addProject", async (formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const title = validateRequired(formData.get("title"), "title");
  const description = validateString(formData.get("description"), "description");
  const tech_stack = validateArray(formData.get("tech_stack"), "tech_stack");
  const github_url = validateUrl(formData.get("github_url"), "github_url");
  const demo_url = validateUrl(formData.get("demo_url"), "demo_url");

  let image_url = validateUrl(formData.get("image_url"), "image_url") || "";
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadFileToStorage(imageFile);
  }

  const { error } = await supabase.from("projects").insert([{ title, description, image_url, tech_stack, github_url, demo_url }]);
  if (error) throw new Error("Failed to add project");

  contentUpdatesTotal.inc({ content_type: "project", operation: "create" });
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
});

export const updateProject = trackServerAction("updateProject", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const title = validateRequired(formData.get("title"), "title");
  const description = validateString(formData.get("description"), "description");
  const tech_stack = validateArray(formData.get("tech_stack"), "tech_stack");
  const github_url = validateUrl(formData.get("github_url"), "github_url");
  const demo_url = validateUrl(formData.get("demo_url"), "demo_url");

  const updateData: any = { title, description, tech_stack, github_url, demo_url };

  let image_url = validateUrl(formData.get("image_url"), "image_url");
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    updateData.image_url = await uploadFileToStorage(imageFile);
  } else if (image_url) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase.from("projects").update(updateData).eq("id", id);
  if (error) throw new Error("Failed to update project");

  contentUpdatesTotal.inc({ content_type: "project", operation: "update" });
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
});

export const deleteProject = trackServerAction("deleteProject", async (id: string) => {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error("Failed to delete project");

  contentUpdatesTotal.inc({ content_type: "project", operation: "delete" });
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
});

// CERTIFICATIONS
export const addCertification = trackServerAction("addCertification", async (formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const title = validateRequired(formData.get("title"), "title");
  const issuer = validateRequired(formData.get("issuer"), "issuer");
  const issued_date = validateString(formData.get("issued_date"), "issued_date");
  const credential_url = validateUrl(formData.get("credential_url"), "credential_url");
  const description = validateString(formData.get("description"), "description");

  let image_url = validateUrl(formData.get("image_url"), "image_url") || "";
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadFileToStorage(imageFile);
  }

  const { error } = await supabase.from("certifications").insert([{ title, issuer, issued_date, image_url, credential_url, description }]);
  if (error) throw new Error("Failed to add certification");

  contentUpdatesTotal.inc({ content_type: "certification", operation: "create" });
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
});

export const updateCertification = trackServerAction("updateCertification", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const title = validateRequired(formData.get("title"), "title");
  const issuer = validateRequired(formData.get("issuer"), "issuer");
  const issued_date = validateString(formData.get("issued_date"), "issued_date");
  const credential_url = validateUrl(formData.get("credential_url"), "credential_url");
  const description = validateString(formData.get("description"), "description");

  const updateData: any = { title, issuer, issued_date, credential_url, description };

  let image_url = validateUrl(formData.get("image_url"), "image_url");
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    updateData.image_url = await uploadFileToStorage(imageFile);
  } else if (image_url) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase.from("certifications").update(updateData).eq("id", id);
  if (error) throw new Error("Failed to update certification");

  contentUpdatesTotal.inc({ content_type: "certification", operation: "update" });
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
});

export const deleteCertification = trackServerAction("deleteCertification", async (id: string) => {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error("Failed to delete certification");

  contentUpdatesTotal.inc({ content_type: "certification", operation: "delete" });
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
});

// PRODUCTS
export const addProduct = trackServerAction("addProduct", async (formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const name = validateRequired(formData.get("name"), "name");
  const short_name = validateRequired(formData.get("short_name"), "short_name");
  const description = validateString(formData.get("description"), "description");
  const price = validateNumber(formData.get("price"), "price", { min: 0 });
  const timeline = validateString(formData.get("timeline"), "timeline");
  const includes = validateArray(formData.get("includes"), "includes");

  const { error } = await supabase.from("products").insert([{ name, short_name, description, price, timeline, includes }]);
  if (error) throw new Error("Failed to add product");

  contentUpdatesTotal.inc({ content_type: "product", operation: "create" });
  revalidatePath("/");
  revalidatePath("/admin/products");
});

export const updateProduct = trackServerAction("updateProduct", async (id: string, formData: FormData) => {
  await verifyAuth();
  const supabase = getServiceSupabase();

  const name = validateRequired(formData.get("name"), "name");
  const short_name = validateRequired(formData.get("short_name"), "short_name");
  const description = validateString(formData.get("description"), "description");
  const price = validateNumber(formData.get("price"), "price", { min: 0 });
  const timeline = validateString(formData.get("timeline"), "timeline");
  const includes = validateArray(formData.get("includes"), "includes");

  const { error } = await supabase.from("products").update({ name, short_name, description, price, timeline, includes }).eq("id", id);
  if (error) throw new Error("Failed to update product");

  contentUpdatesTotal.inc({ content_type: "product", operation: "update" });
  revalidatePath("/");
  revalidatePath("/admin/products");
});

export const deleteProduct = trackServerAction("deleteProduct", async (id: string) => {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error("Failed to delete product");

  contentUpdatesTotal.inc({ content_type: "product", operation: "delete" });
  revalidatePath("/");
  revalidatePath("/admin/products");
});
