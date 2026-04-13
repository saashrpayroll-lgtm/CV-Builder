"use client"

import { useResumeStore } from "@/store/useResumeStore";
import { Search, Check, Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TEMPLATES_LIBRARY, CATEGORIES, TemplateMetadata } from "@/lib/templates";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";

const TemplateMiniOutline = ({ template }: { template: TemplateMetadata }) => {
    const { primary, secondary, bg } = template.previewColors;

    // Different wireframe layouts based on template.layout type
    switch (template.layout) {
        case 'single':
            return (
                <div className="w-full h-full flex flex-col p-2 gap-1.5" style={{ backgroundColor: bg }}>
                    <div className="w-full h-4 rounded-sm mb-1 flex items-center justify-center flex-col gap-0.5">
                        {template.hasPhoto && <div className="w-3 h-3 rounded-full bg-slate-300" />}
                        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: primary }} />
                        <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: secondary }} />
                    </div>
                    {/* Sections */}
                    <div className="w-10 h-0.5 rounded-full mt-1" style={{ backgroundColor: primary }} />
                    <div className="w-full h-8 rounded-sm bg-slate-100 flex flex-col gap-1 p-1">
                        <div className="w-full h-0.5 rounded-full bg-slate-200" />
                        <div className="w-5/6 h-0.5 rounded-full bg-slate-200" />
                        <div className="w-full h-0.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="w-10 h-0.5 rounded-full mt-1" style={{ backgroundColor: primary }} />
                    <div className="w-full h-6 rounded-sm bg-slate-100 flex flex-col gap-1 p-1">
                        <div className="w-3/4 h-0.5 rounded-full bg-slate-200" />
                        <div className="w-1/2 h-0.5 rounded-full bg-slate-200" />
                    </div>
                </div>
            );
        case 'split-left':
            return (
                <div className="w-full h-full flex" style={{ backgroundColor: bg }}>
                    <div className="w-1/3 h-full p-1.5 flex flex-col gap-1.5 items-center" style={{ backgroundColor: primary }}>
                        {template.hasPhoto && <div className="w-4 h-4 rounded-full bg-white/40 mt-1" />}
                        <div className="w-full h-0.5 rounded-full bg-white/60 mt-1" />
                        <div className="w-3/4 h-0.5 rounded-full bg-white/40" />
                        <div className="w-full h-0.5 rounded-full bg-white/20 mt-2" />
                        <div className="w-full h-0.5 rounded-full bg-white/20" />
                        <div className="w-5/6 h-0.5 rounded-full bg-white/20" />
                    </div>
                    <div className="w-2/3 h-full p-2 flex flex-col gap-1.5">
                        <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                        <div className="w-full h-6 rounded-sm bg-slate-100" />
                        <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                        <div className="w-full h-8 rounded-sm bg-slate-100" />
                    </div>
                </div>
            );
        case 'split-right':
            return (
                <div className="w-full h-full flex" style={{ backgroundColor: bg }}>
                    <div className="w-2/3 h-full p-2 flex flex-col gap-1.5">
                        <div className="w-12 h-1 rounded-full mb-1" style={{ backgroundColor: secondary }} />
                        <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: secondary }} />
                        <div className="w-full h-4 rounded-sm bg-slate-100" />
                        <div className="w-10 h-0.5 rounded-full mt-1" style={{ backgroundColor: secondary }} />
                        <div className="w-full h-8 rounded-sm bg-slate-100" />
                        <div className="w-full h-6 rounded-sm bg-slate-100" />
                    </div>
                    <div className="w-1/3 h-full p-1.5 flex flex-col gap-1.5 items-center" style={{ backgroundColor: primary }}>
                        {template.hasPhoto && <div className="w-4 h-4 rounded-xl bg-white/30 mt-1" />}
                        <div className="w-full h-0.5 rounded-full bg-white/40 mt-2" />
                        <div className="w-5/6 h-0.5 rounded-full bg-white/40" />
                    </div>
                </div>
            );
        case 'header-band':
            return (
                <div className="w-full h-full flex flex-col" style={{ backgroundColor: bg }}>
                    <div className="w-full h-6 flex items-center p-2 gap-1.5" style={{ backgroundColor: primary }}>
                        {template.hasPhoto && <div className="w-3.5 h-3.5 rounded-sm bg-white/30" />}
                        <div className="flex flex-col gap-0.5 w-full">
                            <div className="w-10 h-0.5 rounded-full bg-white/80" />
                            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: secondary }} />
                        </div>
                    </div>
                    <div className="w-full h-0.5" style={{ backgroundColor: secondary }} />
                    <div className="w-full flex-1 flex p-1.5 gap-1.5">
                        <div className="w-3/5 h-full flex flex-col gap-1">
                            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: secondary }} />
                            <div className="w-full h-4 rounded-sm bg-slate-100" />
                            <div className="w-10 h-0.5 rounded-full mt-1" style={{ backgroundColor: secondary }} />
                            <div className="w-full h-8 rounded-sm bg-slate-100" />
                        </div>
                        <div className="w-2/5 h-full flex flex-col gap-1">
                            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: secondary }} />
                            <div className="w-full h-6 rounded-sm bg-slate-100" />
                            <div className="w-6 h-0.5 rounded-full mt-1" style={{ backgroundColor: secondary }} />
                            <div className="w-full h-4 rounded-sm bg-slate-100" />
                        </div>
                    </div>
                </div>
            );
        case 'two-column':
            return (
                <div className="w-full h-full flex flex-col p-2 gap-1" style={{ backgroundColor: bg }}>
                    <div className="w-full flex items-center gap-1.5 border-b pb-1" style={{ borderColor: primary }}>
                        {template.hasPhoto && <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />}
                        <div className="flex flex-col gap-0.5">
                            <div className="w-10 h-0.5 rounded-full bg-slate-800" />
                            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                        </div>
                    </div>
                    <div className="w-full flex-1 flex gap-1.5 pt-1">
                        <div className="w-3/5 h-full flex flex-col gap-1">
                            <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-full h-4 rounded-sm bg-slate-100" />
                            <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-full h-8 rounded-sm bg-slate-100" />
                        </div>
                        <div className="w-2/5 h-full flex flex-col gap-1">
                            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-full h-6 rounded-sm bg-slate-100" />
                            <div className="w-8 h-0.5 rounded-full mt-1" style={{ backgroundColor: primary }} />
                            <div className="w-full h-6 rounded-sm bg-slate-100" />
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="w-full h-full bg-slate-100" />;
    }
};

export function TemplateSidebar() {
    const { data, updateSection, updateTheme, isPro } = useResumeStore();
    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("All");
    const [showUpgrade, setShowUpgrade] = useState(false);

    const handleSelectTemplate = (template: TemplateMetadata) => {
        if (template.premium && !isPro) {
            setShowUpgrade(true);
            return;
        }
        updateSection('templateId', template.id);
        if (template.defaultAccent) {
            updateTheme({ accentColor: template.defaultAccent });
        }
    };

    const filtered = TEMPLATES_LIBRARY.filter(t =>
        (selectedCat === "All" || t.category === selectedCat) &&
        (t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
    );

    return (
        <div className="w-80 border-r bg-slate-900 text-white flex flex-col h-full overflow-hidden shadow-xl">
            {/* SEARCH */}
            <div className="p-4 space-y-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-sm tracking-tight text-white">Templates</h3>
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{TEMPLATES_LIBRARY.length} Layouts</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-9 bg-white/5 border-white/10 text-white h-10 rounded-xl focus:ring-indigo-500/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <button
                        onClick={() => setSelectedCat("All")}
                        className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-lg transition-all border",
                            selectedCat === "All"
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                        )}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCat(cat)}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-lg transition-all border",
                                selectedCat === cat
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                    : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* TEMPLATES GRID */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3 pb-20">
                    {filtered.map(template => {
                        const isSelected = data.templateId === template.id;
                        return (
                            <div
                                key={template.id}
                                className={cn(
                                    "group relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 flex flex-col",
                                    isSelected ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/10" : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                )}
                                onClick={() => handleSelectTemplate(template)}
                            >
                                {/* Mini Preview Wireframe */}
                                <div className="aspect-[3/4] w-full border-b border-white/10 overflow-hidden bg-slate-900 pointer-events-none p-2">
                                    <div className="w-full h-full shadow-sm shadow-black/50 overflow-hidden rounded-sm ring-1 ring-white/10">
                                        <TemplateMiniOutline template={template} />
                                    </div>
                                </div>

                                {/* Template Info */}
                                <div className="p-2.5 relative">
                                    <p className="font-bold text-[11px] text-white leading-tight mb-0.5 pr-4">{template.name}</p>
                                    <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">{template.category}</p>
                                    
                                    {isSelected && (
                                        <div className="absolute top-2.5 right-2 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                {template.premium && isPro && !isSelected && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500/90 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg">
                                        <Sparkles className="w-2.5 h-2.5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* INFO PANEL */}
            <div className="p-4 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
                <div className="flex gap-3 items-start p-3 bg-white/5 rounded-xl border border-white/5">
                    <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-white/40 leading-relaxed">
                        Selecting a template automatically updates its default accent color. You can override it in the Design tab.
                    </p>
                </div>
            </div>

            <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
        </div>
    );
}
