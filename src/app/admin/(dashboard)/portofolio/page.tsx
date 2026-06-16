import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addProject, deleteProject } from "@/app/actions/crud";
import { Plus, Trash2, ExternalLink, Folder } from "lucide-react";
import { EditProjectModal } from "@/components/admin/edit-project-modal";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.6c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

export default async function AdminPortfolioPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let projects: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const p = await supabase.from("projects").select("*").order("sort_order");
    projects = p.data || [];
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Portfolio Projects</h1>
        <p className="text-muted-foreground mt-2">Create, list, and delete project showcases displayed in the Portfolio section.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code>.
        </div>
      )}

      {isSupabaseConfigured && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Add Project Card */}
          <Card className="border border-border xl:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Project
              </CardTitle>
              <CardDescription>Upload a new project screenshot and details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input name="title" placeholder="e.g. E-Commerce Platform" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea name="description" placeholder="Short description about the project objectives and solutions..." rows={3} className="resize-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tech Stack (comma separated)</label>
                  <Input name="tech_stack" placeholder="e.g. React, Node.js, PostgreSQL" required />
                  <span className="text-xs text-muted-foreground">Separate items with commas.</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input name="github_url" placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live Demo URL</label>
                    <Input name="demo_url" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2 border-t pt-2 border-border">
                  <label className="text-sm font-medium">Project Image (Upload File)</label>
                  <Input name="image_file" type="file" accept="image/*" className="cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Or Paste Image URL</label>
                  <Input name="image_url" placeholder="https://..." />
                </div>

                <Button type="submit" className="w-full mt-2">
                  Add Project
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Projects Grid */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              Current Projects ({projects.length})
            </h2>
            
            {projects.length === 0 ? (
              <Card className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Folder className="w-12 h-12 stroke-[1] mb-2 text-muted-foreground/60" />
                <p className="text-sm font-medium">No projects added yet.</p>
                <p className="text-xs">Use the form to create your first portfolio project showcase.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map(project => (
                  <Card key={project.id} className="overflow-hidden border border-border/80 flex flex-col hover:border-primary/30 transition-all duration-300">
                    <div className="h-44 w-full relative bg-muted flex items-center justify-center overflow-hidden border-b border-border">
                      {project.image_url ? (
                        <img 
                          src={project.image_url.startsWith('http') ? project.image_url : `/img/portfolio-${project.image_url}.png`} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        />
                      ) : (
                        <Folder className="w-12 h-12 text-muted-foreground/30" />
                      )}
                    </div>
                    
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-bold truncate">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs h-8 leading-relaxed mt-1">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between space-y-4">
                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tech_stack?.map((tech: string, idx: number) => (
                          <span key={idx} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-between items-center pt-3 border-t border-border/60">
                        <div className="flex gap-2">
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <EditProjectModal project={project} />
                          <form action={deleteProject.bind(null, project.id)}>
                            <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-semibold px-3 py-1.5 rounded-lg h-auto flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
