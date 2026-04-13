"use client";
import { useResumeStore, Language } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const PROFICIENCY_LEVELS: Language["proficiency"][] = ["native", "fluent", "advanced", "intermediate", "beginner"];
const PROFICIENCY_COLORS: Record<string, string> = {
    native: "bg-emerald-500",
    fluent: "bg-blue-500",
    advanced: "bg-indigo-500",
    intermediate: "bg-amber-500",
    beginner: "bg-slate-400",
};

export function LanguagesForm() {
    const { data, updateSection } = useResumeStore();
    const langs = data.languages || [];

    const addLang = () => {
        updateSection("languages", [...langs, {
            id: crypto.randomUUID(),
            name: "",
            proficiency: "intermediate" as const,
        }]);
    };

    const updateLang = (id: string, field: keyof Language, value: any) => {
        updateSection("languages", langs.map(l =>
            l.id === id ? { ...l, [field]: value } : l
        ));
    };

    const removeLang = (id: string) => {
        updateSection("languages", langs.filter(l => l.id !== id));
    };

    return (
        <div className="space-y-3">
            {langs.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                    <Input placeholder="Language" value={lang.name}
                        onChange={(e) => updateLang(lang.id, "name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9 flex-1" />
                    <select
                        value={lang.proficiency}
                        onChange={(e) => updateLang(lang.id, "proficiency", e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-xs h-9 rounded-md px-2 outline-none"
                    >
                        {PROFICIENCY_LEVELS.map(p => (
                            <option key={p} value={p} className="bg-slate-900">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                    </select>
                    <button onClick={() => removeLang(lang.id)} className="text-red-400/60 hover:text-red-400 p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <Button onClick={addLang} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Language
            </Button>
        </div>
    );
}
