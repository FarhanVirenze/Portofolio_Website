import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateHomeContent } from "@/app/actions/crud";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCropperInput } from "@/components/admin/image-cropper-input";

export default async function AdminHomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let homeContent: any = null;

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const h = await supabase.from("home_content").select("*").limit(1).single();
    homeContent = h.data;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Home Section</h1>
        <p className="text-muted-foreground mt-2">Update your greeting text, role descriptions, biography description, and resume file link.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code> to enable CRUD operations.
        </div>
      )}

      {isSupabaseConfigured && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-xl">Hero & Greeting Editor</CardTitle>
            <CardDescription>Customize your first-impression text for visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            {homeContent ? (
              <form action={updateHomeContent.bind(null, homeContent.id)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="greeting" className="text-sm font-semibold">Greeting Intro</label>
                    <Input id="greeting" name="greeting" autoComplete="off" defaultValue={homeContent.greeting || "Hey there, I'm"} placeholder="e.g. Hey there, I'm" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="cv_url" className="text-sm font-semibold">CV / Resume Link</label>
                    <Input id="cv_url" name="cv_url" autoComplete="off" defaultValue={homeContent.cv_url || ""} placeholder="e.g. /resume.pdf or Google Drive link" />
                    <span className="text-xs text-muted-foreground">Paste a URL, or upload a PDF file below to auto-fill this field.</span>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="resume_file" className="text-sm font-semibold">Upload CV / Resume (PDF)</label>
                    <Input id="resume_file" name="resume_file" type="file" accept=".pdf,application/pdf" autoComplete="off" className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                    <span className="text-xs text-muted-foreground">Upload a PDF file (max 10MB). This will override the link above.</span>
                    {homeContent.cv_url && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-primary">
                        <span>📄 Current CV:</span>
                        <a href={homeContent.cv_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary/80 truncate max-w-[250px]">
                          {homeContent.cv_url}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="roles" className="text-sm font-semibold">Roles (comma separated for typewriter effect)</label>
                    <Input id="roles" name="roles" autoComplete="off" defaultValue={homeContent.roles?.join(", ") || ""} placeholder="Web Developer, UI/UX Designer, DevOps Engineer" required />
                    <span className="text-xs text-muted-foreground">Separate roles using commas. Example: "Full Stack Developer, Flutter Engineer"</span>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="description" className="text-sm font-semibold">Short Biography Description</label>
                    <Textarea id="description" name="description" autoComplete="off" defaultValue={homeContent.description || "Welcome to my website."} placeholder="Write a short summary about yourself..." rows={4} required className="resize-none" />
                  </div>

                  <div className="space-y-3 md:col-span-2 border-t pt-4 border-border">
                    <label htmlFor="profile_image" className="text-sm font-semibold">Profile Photo</label>
                    <ImageCropperInput existingImageUrl={homeContent.profile_image_url || undefined} />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto px-8 py-2 font-medium">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No hero content row found in the database.</p>
                <p className="text-xs mt-1">Please seed or run the migration script to insert a default row in the <code>home_content</code> table.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
