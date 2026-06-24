"use server";

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  if (!sessionCookie || sessionCookie.value !== "true") {
    throw new Error("Unauthorized Access: You must be logged in as an admin to perform this action.");
  }
}

async function uploadFileToStorage(file: File): Promise<string> {
  const supabase = getServiceSupabase();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

async function uploadBase64ToStorage(base64DataUrl: string): Promise<string> {
  const supabase = getServiceSupabase();
  // Extract mime type and base64 data from data URL
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 data URL");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const ext = mimeType.split("/")[1] || "jpeg";

  // Convert base64 to Buffer
  const buffer = Buffer.from(base64Data, "base64");

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: mimeType,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// HOME CONTENT
export async function updateHomeContent(id: string, formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const roles = (formData.get("roles") as string).split(",").map(r => r.trim());
  let cv_url = formData.get("cv_url") as string;
  const greeting = formData.get("greeting") as string;
  const description = formData.get("description") as string;

  // Handle resume/CV PDF upload (overrides text URL if file provided)
  const resumeFile = formData.get("resume_file") as File;
  if (resumeFile && resumeFile.size > 0) {
    cv_url = await uploadFileToStorage(resumeFile);
  }

  // Handle cropped profile image (base64 from interactive cropper)
  const base64Image = formData.get("profile_image_base64") as string;
  const existingUrl = formData.get("existing_profile_image_url") as string;
  let finalImageUrl: string | undefined;

  if (base64Image) {
    // User cropped a new image — upload the cropped result
    finalImageUrl = await uploadBase64ToStorage(base64Image);
  } else if (existingUrl) {
    // No new crop, keep the existing image (strip any old ?pos= params)
    finalImageUrl = existingUrl.split("?pos=")[0];
  }

  const updateData: any = { roles, cv_url, greeting, description };
  if (finalImageUrl) updateData.profile_image_url = finalImageUrl;

  const { error } = await supabase.from("home_content").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/dashboard");
}

// ABOUT CONTENT
export async function updateAboutContent(id: string, formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const rawParagraphs = formData.get("paragraphs") as string;
  const paragraphs = rawParagraphs.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
  
  // Handle cropped profile image (base64 from interactive cropper)
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
  if (error) throw new Error(error.message);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

// SKILLS
export async function addSkill(formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;

  // Handle icon upload or URL
  let icon_url = formData.get("icon_url") as string;
  const iconFile = formData.get("icon_file") as File;
  if (iconFile && iconFile.size > 0) {
    icon_url = await uploadFileToStorage(iconFile);
  }

  const { error } = await supabase.from("skills").insert([{ name, category, level, icon_url }]);
  if (error) throw new Error(error.message);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function updateSkill(id: string, formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;

  const updateData: any = { name, category, level };

  let icon_url = formData.get("icon_url") as string;
  const iconFile = formData.get("icon_file") as File;
  if (iconFile && iconFile.size > 0) {
    updateData.icon_url = await uploadFileToStorage(iconFile);
  } else if (icon_url) {
    updateData.icon_url = icon_url;
  }

  const { error } = await supabase.from("skills").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function deleteSkill(id: string) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

// PROJECTS
export async function addProject(formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tech_stack = (formData.get("tech_stack") as string).split(",").map(t => t.trim());
  const github_url = formData.get("github_url") as string;
  const demo_url = formData.get("demo_url") as string;

  // Handle image upload
  let image_url = formData.get("image_url") as string || "";
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadFileToStorage(imageFile);
  }

  const { error } = await supabase.from("projects").insert([{ title, description, image_url, tech_stack, github_url, demo_url }]);
  if (error) throw new Error(error.message);
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
}

export async function updateProject(id: string, formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tech_stack = (formData.get("tech_stack") as string).split(",").map(t => t.trim());
  const github_url = formData.get("github_url") as string;
  const demo_url = formData.get("demo_url") as string;

  const updateData: any = { title, description, tech_stack, github_url, demo_url };

  let image_url = formData.get("image_url") as string;
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    updateData.image_url = await uploadFileToStorage(imageFile);
  } else if (image_url) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase.from("projects").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
}

export async function deleteProject(id: string) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/portofolio");
  revalidatePath("/admin/portofolio");
}

// CERTIFICATIONS
export async function addCertification(formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const title = formData.get("title") as string;
  const issuer = formData.get("issuer") as string;
  const issued_date = formData.get("issued_date") as string;
  const credential_url = formData.get("credential_url") as string;
  const description = formData.get("description") as string;

  // Handle image upload
  let image_url = formData.get("image_url") as string || "";
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadFileToStorage(imageFile);
  }

  const { error } = await supabase.from("certifications").insert([{ title, issuer, issued_date, image_url, credential_url, description }]);
  if (error) throw new Error(error.message);
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
}

export async function updateCertification(id: string, formData: FormData) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const title = formData.get("title") as string;
  const issuer = formData.get("issuer") as string;
  const issued_date = formData.get("issued_date") as string;
  const credential_url = formData.get("credential_url") as string;
  const description = formData.get("description") as string;

  const updateData: any = { title, issuer, issued_date, credential_url, description };

  let image_url = formData.get("image_url") as string;
  const imageFile = formData.get("image_file") as File;
  if (imageFile && imageFile.size > 0) {
    updateData.image_url = await uploadFileToStorage(imageFile);
  } else if (image_url) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase.from("certifications").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
}

export async function deleteCertification(id: string) {
  await verifyAuth();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/certification");
  revalidatePath("/admin/certification");
}
