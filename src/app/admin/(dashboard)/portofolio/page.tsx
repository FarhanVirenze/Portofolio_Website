import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addProject } from "@/app/actions/crud";
import { Plus, Folder } from "lucide-react";
import { ProjectCardList } from "@/components/admin/project-card-list";
import { AddProjectForm } from "@/components/admin/add-project-form";

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
          <AddProjectForm />

          {/* Current Projects Grid */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              Current Projects ({projects.length})
            </h2>
            <ProjectCardList projects={projects} />
          </div>
        </div>
      )}
    </div>
  );
}
