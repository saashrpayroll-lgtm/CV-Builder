"use client";
import { useResumeStore, Coursework } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function CourseworkForm() {
    const { data, updateSection } = useResumeStore();
    const items = data.coursework || [];

    const add = () => {
        updateSection("coursework", [...items, {
            id: crypto.randomUUID(), course: "", institution: "", date: "", skills: ""
        }]);
    };

    const update = (id: string, field: keyof Coursework, value: string) => {
        updateSection("coursework", items.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const remove = (id: string) => {
        updateSection("coursework", items.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-4">
            {items.map((a, i) => (
                <div key={a.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Course {i + 1}</span>
                        <button onClick={() => remove(a.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Course / Training Name" value={a.course}
                        onChange={(e) => update(a.id, "course", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <Input placeholder="Institution / Provider" value={a.institution}
                        onChange={(e) => update(a.id, "institution", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Date (e.g., 2023)" value={a.date || ""}
                            onChange={(e) => update(a.id, "date", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="Key Skills Acquired" value={a.skills || ""}
                            onChange={(e) => update(a.id, "skills", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Course
            </Button>
        </div>
    );
}
