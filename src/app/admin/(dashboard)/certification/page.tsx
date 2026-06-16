import { getServiceSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addCertification, deleteCertification } from "@/app/actions/crud";
import { Plus, Trash2, ExternalLink, Calendar, Award } from "lucide-react";
import { EditCertificationModal } from "@/components/admin/edit-certification-modal";

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
          <Card className="border border-border xl:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Certification
              </CardTitle>
              <CardDescription>Upload certificate images and credential details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addCertification} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Certificate Title</label>
                  <Input name="title" placeholder="e.g. AWS Certified Solutions Architect" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issuer / Authority</label>
                  <Input name="issuer" placeholder="e.g. Amazon Web Services (AWS), Google" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issued Date</label>
                  <Input name="issued_date" type="date" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Credential Verification Link</label>
                  <Input name="credential_url" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea name="description" placeholder="Brief summary of skills verified by this certification..." rows={2} className="resize-none" />
                </div>

                <div className="space-y-2 border-t pt-2 border-border">
                  <label className="text-sm font-medium">Certificate Image (Upload File)</label>
                  <Input name="image_file" type="file" accept="image/*" className="cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Or Paste Image URL</label>
                  <Input name="image_url" placeholder="https://..." />
                </div>

                <Button type="submit" className="w-full mt-2">
                  Add Certificate
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Certifications Grid */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Current Certifications ({certifications.length})
            </h2>
            
            {certifications.length === 0 ? (
              <Card className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Award className="w-12 h-12 stroke-[1] mb-2 text-muted-foreground/60" />
                <p className="text-sm font-medium">No certifications added yet.</p>
                <p className="text-xs">Use the form to upload your first professional certification.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certifications.map(cert => {
                  const dateObj = cert.issued_date ? new Date(cert.issued_date) : null;
                  const formattedDate = dateObj 
                    ? dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long" }) 
                    : "";

                  return (
                    <Card key={cert.id} className="overflow-hidden border border-border/80 flex flex-col hover:border-primary/30 transition-all duration-300">
                      <div className="h-40 w-full relative bg-muted flex items-center justify-center overflow-hidden border-b border-border">
                        {cert.image_url ? (
                          <img 
                            src={cert.image_url.startsWith('http') ? cert.image_url : `/img/${cert.image_url}`} 
                            alt={cert.title} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                          />
                        ) : (
                          <Award className="w-12 h-12 text-muted-foreground/30" />
                        )}
                      </div>
                      
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-bold line-clamp-2 h-10 leading-snug">{cert.title}</CardTitle>
                        <CardDescription className="text-xs font-semibold text-primary mt-1">
                          Issued by: {cert.issuer}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2 mt-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </p>
                          {cert.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {cert.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-3 border-t border-border/60">
                          {cert.credential_url ? (
                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold">
                              <ExternalLink className="w-3.5 h-3.5" />
                              Verify Credential
                            </a>
                          ) : (
                            <div />
                          )}

                          <div className="flex gap-2">
                            <EditCertificationModal cert={cert} />
                            <form action={deleteCertification.bind(null, cert.id)}>
                              <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-semibold px-3 py-1.5 rounded-lg h-auto flex items-center gap-1.5">
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </Button>
                            </form>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
