"use client";
import { useResumeStore, Publication } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function PublicationsForm() {
    const { data, updateSection } = useResumeStore();
    const items = data.publications || [];

    const add = () => {
        updateSection("publications", [...items, {
            id: crypto.randomUUID(), title: "", publisher: "", date: "", link: "", description: ""
        }]);
    };

    const update = (id: string, field: keyof Publication, value: string) => {
        updateSection("publications", items.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const remove = (id: string) => {
        updateSection("publications", items.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-4">
            {items.map((p, i) => (
                <div key={p.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Publication {i + 1}</span>
                        <button onClick={() => remove(p.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Title" value={p.title}
                        onChange={(e) => update(p.id, "title", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Publisher / Journal" value={p.publisher}
                            onChange={(e) => update(p.id, "publisher", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="Date" value={p.date}
                            onChange={(e) => update(p.id, "date", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <Input placeholder="URL (optional)" value={p.link || ""}
                        onChange={(e) => update(p.id, "link", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <Textarea placeholder="Brief description" value={p.description || ""}
                        onChange={(e) => update(p.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm min-h-[50px] resize-none" />
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Publication
            </Button>
        </div>
    );
}
