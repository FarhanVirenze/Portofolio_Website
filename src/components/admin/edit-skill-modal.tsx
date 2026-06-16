"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { updateSkill } from "@/app/actions/crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditSkillModal({ skill }: { skill: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary w-8 h-8 rounded-full" />}>
        <Edit2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
          <DialogDescription>Update the details of your skill.</DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateSkill(skill.id, formData);
            setOpen(false);
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Name</label>
            <Input name="name" defaultValue={skill.name} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select name="category" defaultValue={skill.category} className="w-full bg-background text-foreground border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
              <option value="tech">Tech Stack</option>
              <option value="tool">Tools</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level / Proficiency</label>
            <Input name="level" defaultValue={skill.level} required />
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label className="text-sm font-medium">Icon (Upload File to replace)</label>
            <Input name="icon_file" type="file" accept="image/*" className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Or Paste Icon URL</label>
            <Input name="icon_url" defaultValue={skill.icon_url || ""} />
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
