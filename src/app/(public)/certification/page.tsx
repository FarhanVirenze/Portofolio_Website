import { ExternalLink, Calendar, Award, Building2 } from "lucide-react";
import type { Certification as CertificationType } from "@/lib/types";
import { getServiceSupabase } from "@/lib/supabase";
import { CertificationGrid } from "@/components/certification-grid";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// Mock data (fallback)
const mockCertificates: CertificationType[] = [];

export default async function Certification() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";
  
  let certifications = mockCertificates;
  
  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    if (data && data.length > 0) {
      certifications = data;
    }
  }

  return (
    <CertificationGrid>
      <div className="space-y-12 pb-10">
        {/* Header */}
        <ScrollReveal direction="down" distance={20}>
          <header className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Certifications</h1>
                <p className="text-sm text-muted-foreground">Professional credentials & achievements</p>
              </div>
            </div>
          </header>
        </ScrollReveal>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <CertificateCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">No certifications yet. Add some from the admin dashboard.</p>
          </div>
        )}
      </div>
    </CertificationGrid>
  );
}

function CertificateCard({ cert, index }: { cert: CertificationType; index: number }) {
  const formattedDate = new Date(cert.issued_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Resolve image URL
  const imageUrl = cert.image_url?.startsWith('http')
    ? cert.image_url
    : `/img/${cert.image_url}`;

  return (
    <article 
      className="certification-card opacity-0 group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
    >
      {/* Certificate Image */}
      <a 
        href={cert.credential_url || "#"} 
        target="_blank" 
        rel="noreferrer"
        className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30 block"
      >
        {cert.image_url ? (
          <img
            src={imageUrl}
            alt={cert.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* View credential badge */}
        {cert.credential_url && (
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center gap-1.5 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ExternalLink className="w-3 h-3" />
            View Credential
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary/80 font-medium">
            <Building2 className="w-3 h-3" />
            {cert.issuer}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
          {cert.title}
        </h2>

        {/* Description */}
        {cert.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {cert.description}
          </p>
        )}
      </div>
    </article>
  );
}
