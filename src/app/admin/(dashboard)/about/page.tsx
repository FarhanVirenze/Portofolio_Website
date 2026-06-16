import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addSkill, deleteSkill, updateAboutContent } from "@/app/actions/crud";
import { Plus, Trash2, Award, Zap, Hammer } from "lucide-react";
import { EditSkillModal } from "@/components/admin/edit-skill-modal";
import { ImageCropperInput } from "@/components/admin/image-cropper-input";

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
                      <label className="text-sm font-semibold">Biography Paragraphs</label>
                      <Textarea 
                        name="paragraphs" 
                        defaultValue={aboutContent.paragraphs?.join("\n\n") || ""} 
                        placeholder="Write your biography here. Separate paragraphs with a blank line (press Enter twice)." 
                        rows={10} 
                        required 
                      />
                      <span className="text-xs text-muted-foreground">Separate paragraphs with an empty line.</span>
                    </div>

                    <div className="space-y-3 md:col-span-2 border-t pt-4 border-border">
                      <label className="text-sm font-semibold">Profile Photo</label>
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
          <Card className="border border-border lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Skill
              </CardTitle>
              <CardDescription>Add a new technology or tool to your portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addSkill} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Name</label>
                  <Input name="name" placeholder="e.g. Next.js, Figma" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full bg-background text-foreground border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                    <option value="tech">Tech Stack (Programming Languages, Frameworks)</option>
                    <option value="tool">Tools (Design tools, Editors, Platforms)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level / Proficiency</label>
                  <Input name="level" placeholder="e.g. Intermediate, Advanced" required />
                </div>

                <div className="space-y-2 border-t pt-2 border-border">
                  <label className="text-sm font-medium">Icon (Upload File)</label>
                  <Input name="icon_file" type="file" accept="image/*" className="cursor-pointer" />
                  <span className="text-xs text-muted-foreground">Select a custom SVG/PNG icon.</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Or Paste Icon URL</label>
                  <Input name="icon_url" placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/..." />
                </div>

                <Button type="submit" className="w-full mt-2">
                  Add Skill
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Skills List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tech Stack List */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-500">
                  <Zap className="w-5 h-5" />
                  Tech Stack ({techStack.length})
                </CardTitle>
                <CardDescription>Core programming languages and web frameworks.</CardDescription>
              </CardHeader>
              <CardContent>
                {techStack.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No tech stack skills added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {techStack.map(skill => (
                      <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/60 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center p-1.5 overflow-hidden shrink-0 border border-border">
                            {skill.icon_url ? (
                              <img src={skill.icon_url} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Zap className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{skill.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Award className="w-3 h-3 text-blue-400" />
                              {skill.level}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <EditSkillModal skill={skill} />
                          <form action={deleteSkill.bind(null, skill.id)}>
                            <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-8 h-8 rounded-full">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tools List */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-green-500">
                  <Hammer className="w-5 h-5" />
                  Tools ({tools.length})
                </CardTitle>
                <CardDescription>Productivity software, design utilities, and developer services.</CardDescription>
              </CardHeader>
              <CardContent>
                {tools.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No tool skills added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tools.map(skill => (
                      <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/60 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center p-1.5 overflow-hidden shrink-0 border border-border">
                            {skill.icon_url ? (
                              <img src={skill.icon_url} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Hammer className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{skill.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Award className="w-3 h-3 text-green-400" />
                              {skill.level}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <EditSkillModal skill={skill} />
                          <form action={deleteSkill.bind(null, skill.id)}>
                            <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-8 h-8 rounded-full">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
