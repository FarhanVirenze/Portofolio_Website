"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addCertification } from "@/app/actions/crud";
import { Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/toast";

export function AddCertificationForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addCertification(formData);
      showToast("Sertifikasi berhasil ditambahkan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border xl:col-span-1 h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add Certification
        </CardTitle>
        <CardDescription>Upload certificate images and credential details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cert-title" className="text-sm font-medium">Certificate Title</label>
            <Input name="title" id="cert-title" placeholder="e.g. AWS Certified Solutions Architect" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-issuer" className="text-sm font-medium">Issuer / Authority</label>
            <Input name="issuer" id="cert-issuer" placeholder="e.g. Amazon Web Services" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-issued-date" className="text-sm font-medium">Issued Date</label>
            <Input name="issued_date" id="cert-issued-date" type="date" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-credential-url" className="text-sm font-medium">Credential Link</label>
            <Input name="credential_url" id="cert-credential-url" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea name="description" id="cert-description" placeholder="Brief summary..." rows={2} className="resize-none" />
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label htmlFor="cert-image-file" className="text-sm font-medium">Certificate Image</label>
            <Input name="image_file" id="cert-image-file" type="file" accept="image/*" className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label htmlFor="cert-image-url" className="text-sm font-medium">Or Paste Image URL</label>
            <Input name="image_url" id="cert-image-url" placeholder="https://..." />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Certificate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
