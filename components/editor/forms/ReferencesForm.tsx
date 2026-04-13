"use client";
import { useResumeStore, Reference } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function ReferencesForm() {
    const { data, updateSection } = useResumeStore();
    const items = data.references || [];

    const add = () => {
        updateSection("references", [...items, {
            id: crypto.randomUUID(), name: "", position: "", company: "", email: "", phone: ""
        }]);
    };

    const update = (id: string, field: keyof Reference, value: string) => {
        updateSection("references", items.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const remove = (id: string) => {
        updateSection("references", items.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-4">
            {items.map((a, i) => (
                <div key={a.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Reference {i + 1}</span>
                        <button onClick={() => remove(a.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Reference Name" value={a.name}
                            onChange={(e) => update(a.id, "name", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="Company" value={a.company}
                            onChange={(e) => update(a.id, "company", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <Input placeholder="Position / Title" value={a.position}
                        onChange={(e) => update(a.id, "position", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Email Address" value={a.email || ""}
                            onChange={(e) => update(a.id, "email", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" type="email" />
                        <Input placeholder="Phone Number" value={a.phone || ""}
                            onChange={(e) => update(a.id, "phone", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" type="tel" />
                    </div>
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Reference
            </Button>
        </div>
    );
}
