import { ExternalLink, Layers } from "lucide-react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getServiceSupabase } from "@/lib/supabase";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.6c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

// Mock data (fallback)
const mockProjects: Project[] = [];

export default async function Portfolio() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";
  
  let projects = mockProjects;
  
  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data && data.length > 0) {
      projects = data;
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Projects</h1>
            <p className="text-sm text-muted-foreground">Things I&apos;ve built and contributed to</p>
          </div>
        </div>
      </header>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">No projects yet. Add some from the admin dashboard.</p>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Resolve image URL
  const imageUrl = project.image_url?.startsWith("http")
    ? project.image_url
    : `/img/portfolio-${project.image_url}.png`;

  return (
    <div 
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
        <img
          src={imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover (Always visible on mobile) */}
        <div className="absolute inset-0 bg-gradient-to-t opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
          <div className="flex items-center gap-2 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
            {project.github_url && project.github_url !== 'null' && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {project.demo_url && project.demo_url !== 'null' && (
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tech_stack.map((tech) => (
            <Badge 
              key={tech} 
              variant="secondary" 
              className="bg-primary/5 text-primary/80 hover:bg-primary/10 border border-primary/10 text-xs font-medium rounded-full px-2.5 py-0.5"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
