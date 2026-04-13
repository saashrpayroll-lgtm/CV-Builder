"use client";
import { useResumeStore, Achievement } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function AchievementsForm() {
    const { data, updateSection } = useResumeStore();
    const achievements = data.achievements || [];

    const add = () => {
        updateSection("achievements", [...achievements, {
            id: crypto.randomUUID(), title: "", description: "", date: ""
        }]);
    };

    const update = (id: string, field: keyof Achievement, value: string) => {
        updateSection("achievements", achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const remove = (id: string) => {
        updateSection("achievements", achievements.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-4">
            {achievements.map((a, i) => (
                <div key={a.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Achievement {i + 1}</span>
                        <button onClick={() => remove(a.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Achievement Title" value={a.title}
                        onChange={(e) => update(a.id, "title", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-1 gap-2">
                        <Input placeholder="Date (optional)" value={a.date || ""}
                            onChange={(e) => update(a.id, "date", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <Textarea placeholder="Description" value={a.description}
                        onChange={(e) => update(a.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm min-h-[60px] resize-none" />
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Achievement
            </Button>
        </div>
    );
}
