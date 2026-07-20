"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { updateCertification } from "@/app/actions/crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditCertificationModal({ cert }: { cert: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs font-semibold px-3 py-1.5 rounded-lg h-auto flex items-center gap-1.5" />}>
        <Edit2 className="w-3.5 h-3.5" />
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Certification</DialogTitle>
          <DialogDescription>Update the details of your certification or course.</DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateCertification(cert.id, formData);
            setOpen(false);
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <label htmlFor="edit-cert-title" className="text-sm font-medium">Certification Title</label>
            <Input id="edit-cert-title" name="title" autoComplete="off" defaultValue={cert.title} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cert-issuer" className="text-sm font-medium">Issuer / Organization</label>
            <Input id="edit-cert-issuer" name="issuer" autoComplete="off" defaultValue={cert.issuer} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cert-issued-date" className="text-sm font-medium">Date Issued</label>
            <Input id="edit-cert-issued-date" name="issued_date" type="date" autoComplete="off" defaultValue={cert.issued_date} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cert-description" className="text-sm font-medium">Description</label>
            <Textarea id="edit-cert-description" name="description" autoComplete="off" defaultValue={cert.description} rows={3} className="resize-none" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cert-credential-url" className="text-sm font-medium">Credential URL</label>
            <Input id="edit-cert-credential-url" name="credential_url" autoComplete="off" defaultValue={cert.credential_url || ""} />
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label htmlFor="edit-cert-image-file" className="text-sm font-medium">Certificate Image (Upload File to replace)</label>
            <Input id="edit-cert-image-file" name="image_file" type="file" accept="image/*" autoComplete="off" className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cert-image-url" className="text-sm font-medium">Or Paste Image URL</label>
            <Input id="edit-cert-image-url" name="image_url" autoComplete="off" defaultValue={cert.image_url || ""} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
