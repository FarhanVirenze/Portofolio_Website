import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addSkill, updateAboutContent } from "@/app/actions/crud";
import { Plus } from "lucide-react";
import { ImageCropperInput } from "@/components/admin/image-cropper-input";
import { SkillList } from "@/components/admin/skill-list";
import { AddSkillForm } from "@/components/admin/add-skill-form";

export default async function AdminAboutPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let skills: any[] = [];
  let aboutContent: any = null;

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const s = await supabase.from("skills").select("*").order("sort_order");
    skills = s.data || [];

    const a = await supabase.from("about_content").select("*").limit(1).single();
    if (a.data) aboutContent = a.data;
  }

  const techStack = skills.filter(skill => skill.category === "tech");
  const tools = skills.filter(skill => skill.category === "tool");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Skills (About Page)</h1>
        <p className="text-muted-foreground mt-2">Add or delete skills that are showcased under the Tech Stack and Tools sections of your About page.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code>.
        </div>
      )}

      {isSupabaseConfigured && (
        <div className="space-y-8">
          
          {/* Edit About Content Card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl">About Me Details</CardTitle>
              <CardDescription>Customize your profile photo and biography text.</CardDescription>
            </CardHeader>
            <CardContent>
              {aboutContent ? (
                <form action={updateAboutContent.bind(null, aboutContent.id)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="paragraphs" className="text-sm font-semibold">Biography Paragraphs</label>
                      <Textarea 
                        id="paragraphs"
                        name="paragraphs" 
                        defaultValue={aboutContent.paragraphs?.join("\n\n") || ""} 
                        placeholder="Write your biography here. Separate paragraphs with a blank line (press Enter twice)." 
                        rows={10} 
                        required 
                      />
                      <span className="text-xs text-muted-foreground">Separate paragraphs with an empty line.</span>
                    </div>

                    <div className="space-y-3 md:col-span-2 border-t pt-4 border-border">
                      <label htmlFor="profile_image" className="text-sm font-semibold">Profile Photo</label>
                      <ImageCropperInput existingImageUrl={aboutContent.profile_image_url || undefined} />
                    </div>
                  </div>

                  <Button type="submit" className="px-8 py-2 font-medium">
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">No about content row found in the database.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Skill Card */}
          <AddSkillForm />

          {/* Current Skills List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tech Stack List */}
            <Card className="border border-border">
              <CardContent className="pt-6">
                <SkillList skills={techStack} category="tech" />
              </CardContent>
            </Card>

            {/* Tools List */}
            <Card className="border border-border">
              <CardContent className="pt-6">
                <SkillList skills={tools} category="tool" />
              </CardContent>
            </Card>
            
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
