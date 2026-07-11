import { getServiceSupabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { CertificationCardList } from "@/components/admin/certification-card-list";
import { AddCertificationForm } from "@/components/admin/add-certification-form";

export default async function AdminCertificationPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  let certifications: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const c = await supabase.from("certifications").select("*").order("sort_order");
    certifications = c.data || [];
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Certifications</h1>
        <p className="text-muted-foreground mt-2">Display and manage professional certificates or course completion awards.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4">
          <strong>Supabase is not configured!</strong> Please update your <code>.env.local</code>.
        </div>
      )}

      {isSupabaseConfigured && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Add Certification Card */}
          <AddCertificationForm />

          {/* Current Certifications Grid */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Current Certifications ({certifications.length})
            </h2>
            <CertificationCardList certifications={certifications} />
          </div>
        </div>
      )}
    </div>
  );
}
