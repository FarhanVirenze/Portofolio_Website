"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Calendar, Award } from "lucide-react";
import { EditCertificationModal } from "@/components/admin/edit-certification-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteCertification } from "@/app/actions/crud";
import { showToast } from "@/components/toast";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued_date: string | null;
  description: string | null;
  image_url: string | null;
  credential_url: string | null;
}

export function CertificationCardList({ certifications }: { certifications: Certification[] }) {
  const handleDelete = async (id: string) => {
    await deleteCertification(id);
    showToast("Sertifikasi berhasil dihapus");
  };

  if (certifications.length === 0) {
    return (
      <div className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-muted-foreground">
        <Award className="w-12 h-12 stroke-[1] mb-2 text-muted-foreground/60" />
        <p className="text-sm font-medium">Belum ada sertifikasi.</p>
        <p className="text-xs">Gunakan form untuk menambah sertifikasi pertama.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {certifications.map((cert) => {
        const dateObj = cert.issued_date ? new Date(cert.issued_date) : null;
        const formattedDate = dateObj
          ? dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long" })
          : "";

        return (
          <div key={cert.id} className="overflow-hidden border border-border/80 flex flex-col hover:border-primary/30 transition-all duration-300 rounded-xl">
            <div className="h-40 w-full relative bg-muted flex items-center justify-center overflow-hidden border-b border-border">
              {cert.image_url ? (
                <img
                  src={cert.image_url.startsWith("http") ? cert.image_url : `/img/${cert.image_url}`}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <Award className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>

            <div className="p-4 pb-2">
              <h3 className="text-sm font-bold line-clamp-2 h-10 leading-snug">{cert.title}</h3>
              <p className="text-xs font-semibold text-primary mt-1">Issued by: {cert.issuer}</p>
            </div>

            <div className="p-4 pt-0 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2 mt-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </p>
                {cert.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cert.description}</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border/60">
                {cert.credential_url ? (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify
                  </a>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <EditCertificationModal cert={cert} />
                  <ConfirmDialog
                    title="Hapus Sertifikasi"
                    description={`Yakin ingin menghapus sertifikasi "${cert.title}"?`}
                    onConfirm={() => handleDelete(cert.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
