"use client";
import { useResumeStore, SocialLink } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Globe, Twitter, Linkedin, Github } from "lucide-react";

const PLATFORMS = ["LinkedIn", "GitHub", "Twitter/X", "Portfolio", "Behance", "Dribbble", "Medium", "Stack Overflow", "Other"];

export function SocialLinksForm() {
    const { data, updateSection } = useResumeStore();
    const links = data.socialLinks || [];

    const add = () => {
        updateSection("socialLinks", [...links, {
            id: crypto.randomUUID(), platform: "LinkedIn", url: ""
        }]);
    };

    const update = (id: string, field: keyof SocialLink, value: string) => {
        updateSection("socialLinks", links.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const remove = (id: string) => {
        updateSection("socialLinks", links.filter(l => l.id !== id));
    };

    return (
        <div className="space-y-3">
            {links.map((link) => (
                <div key={link.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                    <select
                        value={link.platform}
                        onChange={(e) => update(link.id, "platform", e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-xs h-9 rounded-md px-2 outline-none w-28 shrink-0"
                    >
                        {PLATFORMS.map(p => (
                            <option key={p} value={p} className="bg-slate-900">{p}</option>
                        ))}
                    </select>
                    <Input placeholder="https://..." value={link.url}
                        onChange={(e) => update(link.id, "url", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9 flex-1" />
                    <button onClick={() => remove(link.id)} className="text-red-400/60 hover:text-red-400 p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <Button onClick={add} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Social Link
            </Button>
        </div>
    );
}
