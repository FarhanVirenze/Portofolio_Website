"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addProject } from "@/app/actions/crud";
import { Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/toast";

export function AddProjectForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addProject(formData);
      showToast("Project berhasil ditambahkan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border xl:col-span-1 h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Project
        </CardTitle>
        <CardDescription>Upload a new project screenshot and details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project-title" className="text-sm font-medium">Project Title</label>
            <Input id="project-title" name="title" autoComplete="off" placeholder="e.g. E-Commerce Platform" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium">Description</label>
            <Textarea id="project-description" name="description" autoComplete="off" placeholder="Short description about the project..." rows={3} className="resize-none" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-tech-stack" className="text-sm font-medium">Tech Stack (comma separated)</label>
            <Input id="project-tech-stack" name="tech_stack" autoComplete="off" placeholder="e.g. React, Node.js, PostgreSQL" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="project-github-url" className="text-sm font-medium">GitHub URL</label>
              <Input id="project-github-url" name="github_url" autoComplete="off" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-demo-url" className="text-sm font-medium">Demo URL</label>
              <Input id="project-demo-url" name="demo_url" autoComplete="off" placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2 border-t pt-2 border-border">
            <label htmlFor="project-image-file" className="text-sm font-medium">Project Image</label>
            <Input id="project-image-file" name="image_file" type="file" accept="image/*" autoComplete="off" className="cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-image-url" className="text-sm font-medium">Or Paste Image URL</label>
            <Input id="project-image-url" name="image_url" autoComplete="off" placeholder="https://..." />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
