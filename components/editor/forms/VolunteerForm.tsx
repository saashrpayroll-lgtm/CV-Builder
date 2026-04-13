"use client";
import { useResumeStore, VolunteerWork } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function VolunteerForm() {
    const { data, updateSection } = useResumeStore();
    const items = data.volunteerWork || [];

    const add = () => {
        updateSection("volunteerWork", [...items, {
            id: crypto.randomUUID(), organization: "", role: "", startDate: "", endDate: "", current: false, description: ""
        }]);
    };

    const update = (id: string, field: keyof VolunteerWork, value: any) => {
        updateSection("volunteerWork", items.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const remove = (id: string) => {
        updateSection("volunteerWork", items.filter(v => v.id !== id));
    };

    return (
        <div className="space-y-4">
            {items.map((v, i) => (
                <div key={v.id} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Volunteer {i + 1}</span>
                        <button onClick={() => remove(v.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Organization" value={v.organization}
                        onChange={(e) => update(v.id, "organization", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <Input placeholder="Role" value={v.role}
                        onChange={(e) => update(v.id, "role", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Start Date" value={v.startDate}
                            onChange={(e) => update(v.id, "startDate", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="End Date" value={v.endDate} disabled={v.current}
                            onChange={(e) => update(v.id, "endDate", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                        <input type="checkbox" checked={v.current}
                            onChange={(e) => update(v.id, "current", e.target.checked)}
                            className="rounded" /> Currently volunteering
                    </label>
                    <Textarea placeholder="Description" value={v.description}
                        onChange={(e) => update(v.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm min-h-[60px] resize-none" />
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Volunteer Work
            </Button>
        </div>
    );
}
