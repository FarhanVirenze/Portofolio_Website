import Link from "next/link";
import { getServiceSupabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, User, FolderOpen, Award, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let skillsCount = 0;
  let projectsCount = 0;
  let certificationsCount = 0;
  let hasHomeContent = false;

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const [s, p, c, h] = await Promise.all([
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("certifications").select("id", { count: "exact", head: true }),
      supabase.from("home_content").select("id").limit(1),
    ]);
    skillsCount = s.count || 0;
    projectsCount = p.count || 0;
    certificationsCount = c.count || 0;
    hasHomeContent = (h.data && h.data.length > 0) || false;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Manage and update your portfolio website content from here.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code> with your actual Supabase URL and Keys to enable CRUD operations.
        </div>
      )}

      {isSupabaseConfigured && (
        <>
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 shadow-sm">
            <div className="relative z-10 max-w-xl space-y-4">
              <h2 className="text-2xl font-bold">Hello, Farhan!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You can easily add new projects, skills, certificates, and modify your home page greeting from the sidebar. Your changes will be reflected instantly across your portfolio.
              </p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block bg-gradient-to-l from-primary/30 to-transparent pointer-events-none" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Home Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Home Section</CardTitle>
                <Home className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">
                  {hasHomeContent ? "Configured" : "Not Set"}
                </div>
                <CardDescription>Hero text & profile picture</CardDescription>
                <Link href="/admin/home" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium pt-2">
                  Edit Home <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                <User className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">{skillsCount}</div>
                <CardDescription>Tech stack & tool skills</CardDescription>
                <Link href="/admin/about" className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline font-medium pt-2">
                  Manage About <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Portfolio Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderOpen className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">{projectsCount}</div>
                <CardDescription>Showcased applications</CardDescription>
                <Link href="/admin/portofolio" className="inline-flex items-center gap-1 text-sm text-green-500 hover:underline font-medium pt-2">
                  Manage Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Certification Card */}
            <Card className="hover:border-primary/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                <Award className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold">{certificationsCount}</div>
                <CardDescription>Verified achievements</CardDescription>
                <Link href="/admin/certification" className="inline-flex items-center gap-1 text-sm text-yellow-500 hover:underline font-medium pt-2">
                  Manage Certs <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
