"use client";

import { Button } from "@/components/ui/button";
import { Award, Zap, Hammer } from "lucide-react";
import { EditSkillModal } from "@/components/admin/edit-skill-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteSkill } from "@/app/actions/crud";
import { showToast } from "@/components/toast";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon_url: string | null;
  sort_order: number;
}

export function SkillList({ skills, category }: { skills: Skill[]; category: "tech" | "tool" }) {
  const Icon = category === "tech" ? Zap : Hammer;
  const color = category === "tech" ? "text-blue-500" : "text-green-500";
  const label = category === "tech" ? "Tech Stack" : "Tools";

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    showToast("Skill berhasil dihapus");
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-semibold flex items-center gap-2 ${color}`}>
        <Icon className="w-4 h-4" />
        {label} ({skills.length})
      </h3>
      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Belum ada skill.</p>
      ) : (
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/60 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center p-1.5 overflow-hidden shrink-0 border border-border">
                  {skill.icon_url ? (
                    <img src={skill.icon_url} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{skill.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Award className={`w-3 h-3 ${category === "tech" ? "text-blue-400" : "text-green-400"}`} />
                    {skill.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <EditSkillModal skill={skill} />
                <ConfirmDialog
                  title="Hapus Skill"
                  description={`Yakin ingin menghapus skill "${skill.name}"?`}
                  onConfirm={() => handleDelete(skill.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
