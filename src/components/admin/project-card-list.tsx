"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Folder } from "lucide-react";
import { EditProjectModal } from "@/components/admin/edit-project-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProject } from "@/app/actions/crud";
import { showToast } from "@/components/toast";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.6c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
}

export function ProjectCardList({ projects }: { projects: Project[] }) {
  const handleDelete = async (id: string) => {
    await deleteProject(id);
    showToast("Project berhasil dihapus");
  };

  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-muted-foreground">
        <Folder className="w-12 h-12 stroke-[1] mb-2 text-muted-foreground/60" />
        <p className="text-sm font-medium">Belum ada project.</p>
        <p className="text-xs">Gunakan form untuk membuat project pertama.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="overflow-hidden border border-border/80 flex flex-col hover:border-primary/30 transition-all duration-300 rounded-xl">
          <div className="h-44 w-full relative bg-muted flex items-center justify-center overflow-hidden border-b border-border">
            {project.image_url ? (
              <img
                src={project.image_url.startsWith("http") ? project.image_url : `/img/portfolio-${project.image_url}.png`}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <Folder className="w-12 h-12 text-muted-foreground/30" />
            )}
          </div>

          <div className="p-4 pb-2">
            <h3 className="text-base font-bold truncate">{project.title}</h3>
            <p className="line-clamp-2 text-xs h-8 leading-relaxed mt-1 text-muted-foreground">{project.description}</p>
          </div>

          <div className="p-4 pt-0 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.tech_stack?.map((tech: string, idx: number) => (
                <span key={idx} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                  {tech}
                </span>
              ))}
            </div>

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
                <ConfirmDialog
                  title="Hapus Project"
                  description={`Yakin ingin menghapus project "${project.title}"?`}
                  onConfirm={() => handleDelete(project.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
