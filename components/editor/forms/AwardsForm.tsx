"use client";
import { useResumeStore, Award } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function AwardsForm() {
    const { data, updateSection } = useResumeStore();
    const items = data.awards || [];

    const add = () => {
        updateSection("awards", [...items, {
            id: crypto.randomUUID(), title: "", issuer: "", date: "", description: ""
        }]);
    };

    const update = (id: string, field: keyof Award, value: string) => {
        updateSection("awards", items.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const remove = (id: string) => {
        updateSection("awards", items.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-4">
            {items.map((a, i) => (
                <div key={a.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Award {i + 1}</span>
                        <button onClick={() => remove(a.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Award Name" value={a.title}
                        onChange={(e) => update(a.id, "title", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Issued By" value={a.issuer}
                            onChange={(e) => update(a.id, "issuer", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="Date" value={a.date}
                            onChange={(e) => update(a.id, "date", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <Textarea placeholder="Description (optional)" value={a.description || ""}
                        onChange={(e) => update(a.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm min-h-[50px] resize-none" />
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Award
            </Button>
        </div>
    );
}
