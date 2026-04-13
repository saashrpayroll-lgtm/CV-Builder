"use client";

import { useResumeStore, CustomSection, CustomSectionItem } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, GripVertical, Settings2, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { improveText } from "@/app/actions/granular_ai";
import { toast } from "sonner";
import { AIImprovementModal } from "../AIImprovementModal";

export function CustomSectionForm() {
    const { data, updateSection } = useResumeStore();
    const customSections = data.customSections || [];
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [aiModal, setAiModal] = useState<{ isOpen: boolean; original: string; improved: string; sectionIndex: number; itemIndex: number } | null>(null);

    const handleAddSection = () => {
        const newSection: CustomSection = {
            id: crypto.randomUUID(),
            title: "Certifications",
            items: [{
                id: crypto.randomUUID(),
                title: "",
                subtitle: "",
                date: "",
                description: ""
            }]
        };
        updateSection("customSections", [...customSections, newSection]);
    };

    const handleRemoveSection = (sectionIndex: number) => {
        const updated = customSections.filter((_, i) => i !== sectionIndex);
        updateSection("customSections", updated);
    };

    const handleUpdateSectionTitle = (sectionIndex: number, title: string) => {
        const updated = [...customSections];
        updated[sectionIndex] = { ...updated[sectionIndex], title };
        updateSection("customSections", updated);
    };

    const handleAddItem = (sectionIndex: number) => {
        const updated = [...customSections];
        updated[sectionIndex].items.push({
            id: crypto.randomUUID(),
            title: "",
            subtitle: "",
            date: "",
            description: ""
        });
        updateSection("customSections", updated);
    };

    const handleUpdateItem = (sectionIndex: number, itemIndex: number, field: keyof CustomSectionItem, value: string) => {
        const updated = [...customSections];
        updated[sectionIndex].items[itemIndex] = { ...updated[sectionIndex].items[itemIndex], [field]: value };
        updateSection("customSections", updated);
    };

    const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
        const updated = [...customSections];
        updated[sectionIndex].items = updated[sectionIndex].items.filter((_, i) => i !== itemIndex);
        updateSection("customSections", updated);
    };

    const handleAIEnhance = async (sectionIndex: number, itemIndex: number, currentText: string) => {
        if (!currentText || currentText.length < 10) {
            toast.error("Please enter some text first");
            return;
        }

        setLoadingId(`${sectionIndex}-${itemIndex}`);
        try {
            const result = await improveText(currentText, "professional");
            if (result) {
                setAiModal({
                    isOpen: true,
                    original: currentText,
                    improved: result,
                    sectionIndex,
                    itemIndex
                });
            }
        } catch (error) {
            toast.error("AI enhancement failed");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <AnimatePresence>
                {customSections.map((section, sIndex) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                    >
                        <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <Input
                                value={section.title}
                                onChange={(e) => handleUpdateSectionTitle(sIndex, e.target.value)}
                                className="max-w-[150px] font-bold text-sm border-none bg-transparent focus:ring-0 p-0 h-auto text-indigo-400"
                            />
                            <button onClick={() => handleRemoveSection(sIndex)} className="text-white/20 hover:text-red-400 transition-colors">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6">
                            {section.items.map((item, iIndex) => (
                                <div key={item.id} className="relative group p-4 bg-white/5 border border-white/5 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Item {iIndex + 1}</h5>
                                        <button onClick={() => handleRemoveItem(sIndex, iIndex)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="grid gap-1.5">
                                            <Label className="text-[11px] text-white/50">Title</Label>
                                            <Input
                                                value={item.title}
                                                onChange={(e) => handleUpdateItem(sIndex, iIndex, "title", e.target.value)}
                                                placeholder="e.g. AWS Certification"
                                                className="bg-white/5 border-white/10 text-white text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-1.5">
                                                <Label className="text-[11px] text-white/50">Subtitle</Label>
                                                <Input
                                                    value={item.subtitle}
                                                    onChange={(e) => handleUpdateItem(sIndex, iIndex, "subtitle", e.target.value)}
                                                    placeholder="Entity name"
                                                    className="bg-white/5 border-white/10 text-white text-sm"
                                                />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-[11px] text-white/50">Date</Label>
                                                <Input
                                                    value={item.date}
                                                    onChange={(e) => handleUpdateItem(sIndex, iIndex, "date", e.target.value)}
                                                    placeholder="2023"
                                                    className="bg-white/5 border-white/10 text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-[11px] text-white/50">Description</Label>
                                                <button
                                                    onClick={() => handleAIEnhance(sIndex, iIndex, item.description)}
                                                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1"
                                                >
                                                    <Sparkles className="w-3 h-3" /> AI
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Textarea
                                                    value={item.description}
                                                    onChange={(e) => handleUpdateItem(sIndex, iIndex, "description", e.target.value)}
                                                    className="min-h-[80px] bg-white/5 border-white/10 text-white text-sm"
                                                />
                                                {loadingId === `${sIndex}-${iIndex}` && (
                                                    <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center backdrop-blur-[1px] rounded-md">
                                                        <Wand2 className="w-4 h-4 text-indigo-500 animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="w-full bg-white/5 border-dashed border-white/10 hover:bg-white/10 hover:text-white text-white/50 h-10 text-xs"
                                onClick={() => handleAddItem(sIndex)}
                            >
                                <Plus className="w-3 h-3 mr-2" /> Add Item
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <Button onClick={handleAddSection} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" /> New Custom Section
            </Button>

            {aiModal && (
                <AIImprovementModal
                    isOpen={aiModal.isOpen}
                    onClose={() => setAiModal(null)}
                    originalText={aiModal.original}
                    improvedText={aiModal.improved}
                    onAccept={() => {
                        handleUpdateItem(aiModal.sectionIndex, aiModal.itemIndex, "description", aiModal.improved);
                        setAiModal(null);
                        toast.success("Applied!");
                    }}
                />
            )}
        </div>
    );
}
