"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addSkill } from "@/app/actions/crud";
import { Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/toast";

export function AddSkillForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addSkill(formData);
      showToast("Skill berhasil ditambahkan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Skill
        </CardTitle>
        <CardDescription>Add a new technology or tool to your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="skill-name" className="text-sm font-medium">Skill Name</label>
            <Input id="skill-name" name="name" placeholder="e.g. Next.js, Figma" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="skill-category" className="text-sm font-medium">Category</label>
            <select id="skill-category" name="category" className="w-full bg-background text-foreground border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
              <option value="tech">Tech Stack (Programming Languages, Frameworks)</option>
              <option value="tool">Tools (Design tools, Editors, Platforms)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="skill-level" className="text-sm font-medium">Level / Proficiency</label>
            <Input id="skill-level" name="level" placeholder="e.g. Intermediate, Advanced" required />
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label htmlFor="skill-icon-file" className="text-sm font-medium">Icon (Upload File)</label>
            <Input id="skill-icon-file" name="icon_file" type="file" accept="image/*" className="cursor-pointer" />
            <span className="text-xs text-muted-foreground">Select a custom SVG/PNG icon.</span>
          </div>

          <div className="space-y-2">
            <label htmlFor="skill-icon-url" className="text-sm font-medium">Or Paste Icon URL</label>
            <Input id="skill-icon-url" name="icon_url" placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/..." />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Skill
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
