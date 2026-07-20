"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { updateProject } from "@/app/actions/crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditProjectModal({ project }: { project: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs font-semibold px-3 py-1.5 rounded-lg h-auto flex items-center gap-1.5" />}>
        <Edit2 className="w-3.5 h-3.5" />
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the details of your portfolio project.</DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateProject(project.id, formData);
            setOpen(false);
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <label htmlFor="edit-project-title" className="text-sm font-medium">Project Title</label>
            <Input id="edit-project-title" name="title" autoComplete="off" defaultValue={project.title} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-project-description" className="text-sm font-medium">Description</label>
            <Textarea id="edit-project-description" name="description" autoComplete="off" defaultValue={project.description} rows={3} className="resize-none" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-project-tech-stack" className="text-sm font-medium">Tech Stack (comma separated)</label>
            <Input id="edit-project-tech-stack" name="tech_stack" autoComplete="off" defaultValue={project.tech_stack?.join(", ") || ""} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-project-github-url" className="text-sm font-medium">GitHub URL</label>
              <Input id="edit-project-github-url" name="github_url" autoComplete="off" defaultValue={project.github_url || ""} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-project-demo-url" className="text-sm font-medium">Live Demo URL</label>
              <Input id="edit-project-demo-url" name="demo_url" autoComplete="off" defaultValue={project.demo_url || ""} />
            </div>
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label htmlFor="edit-project-image-file" className="text-sm font-medium">Project Image (Upload File to replace)</label>
            <Input id="edit-project-image-file" name="image_file" type="file" accept="image/*" autoComplete="off" className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-project-image-url" className="text-sm font-medium">Or Paste Image URL</label>
            <Input id="edit-project-image-url" name="image_url" autoComplete="off" defaultValue={project.image_url || ""} />
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
