"use client";

import { useState } from "react";
import { useResumeStore, WorkExperience } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash, GripVertical, Sparkles, Wand2, CheckSquare, Search, Loader2 } from "lucide-react";
import { Reorder } from "framer-motion";
import { improveText } from "@/app/actions/granular_ai";
import { toast } from "sonner";
import { AIImprovementModal } from "../AIImprovementModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkExperienceForm() {
    const { data, updateSection } = useResumeStore();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [aiModal, setAiModal] = useState<{ isOpen: boolean; original: string; improved: string; fieldId: string; index: number } | null>(null);

    const handleAdd = () => {
        const newExperience: WorkExperience = {
            id: crypto.randomUUID(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            location: "",
            description: "",
            current: false,
        };
        updateSection("workExperience", [...(data.workExperience || []), newExperience]);
    };

    const handleChange = (index: number, field: keyof WorkExperience, value: any) => {
        const updated = [...(data.workExperience || [])];
        updated[index] = { ...updated[index], [field]: value };
        updateSection("workExperience", updated);
    };

    const handleDelete = (index: number) => {
        const updated = [...(data.workExperience || [])].filter((_, i) => i !== index);
        updateSection("workExperience", updated);
    };

    const handleAIEnhance = async (index: number, currentText: string, type: "grammar" | "professional" | "ats" | "shorter") => {
        if (!currentText || currentText.length < 10) {
            toast.error("Please enter some text first (at least 10 chars)");
            return;
        }

        setLoadingId(`${index}-${type}`);
        try {
            const result = await improveText(currentText, type);
            if (result) {
                setAiModal({
                    isOpen: true,
                    original: currentText,
                    improved: result,
                    fieldId: "description",
                    index: index
                });
            } else {
                toast.error("AI returned empty result");
            }
        } catch (error) {
            console.error(error);
            toast.error("AI enhancement failed");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <Reorder.Group axis="y" values={data.workExperience || []} onReorder={(newOrder) => updateSection("workExperience", newOrder)} className="space-y-4">
                {data.workExperience?.map((exp, index) => (
                    <Reorder.Item
                        key={exp.id}
                        value={exp}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 relative group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Position {index + 1}</h4>
                            <div className="flex-1" />
                            <button onClick={() => handleDelete(index)} className="text-white/20 hover:text-red-400 transition-colors">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-white/70">Company</Label>
                                <Input
                                    value={exp.company}
                                    onChange={(e) => handleChange(index, "company", e.target.value)}
                                    placeholder="e.g. Google"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Job Title</Label>
                                <Input
                                    value={exp.position}
                                    onChange={(e) => handleChange(index, "position", e.target.value)}
                                    placeholder="e.g. Senior Frontend Developer"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-white/70">Start Date</Label>
                                    <Input
                                        value={exp.startDate}
                                        onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                        placeholder="Jan 2020"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-white/70">End Date</Label>
                                    <Input
                                        value={exp.endDate}
                                        onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                        placeholder="Present"
                                        disabled={exp.current}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-white/70">Description</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 text-indigo-400 hover:text-indigo-300 hover:bg-white/5 p-0 px-2 text-[10px] font-bold uppercase tracking-wider">
                                                <Sparkles className="w-3 h-3 mr-1" /> AI Improve
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                                            <DropdownMenuItem onClick={() => handleAIEnhance(index, exp.description, "professional")} className="hover:bg-white/10">
                                                Professional Rewrite
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAIEnhance(index, exp.description, "ats")} className="hover:bg-white/10">
                                                Optimize for ATS
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => handleChange(index, "description", e.target.value)}
                                        placeholder="Describe your achievements..."
                                        className="min-h-[100px] bg-white/5 border-white/10 text-white text-sm"
                                    />
                                    {loadingId?.startsWith(`${index}-`) && (
                                        <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center backdrop-blur-[2px] rounded-md">
                                            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <Button onClick={handleAdd} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>

            {aiModal && (
                <AIImprovementModal
                    isOpen={aiModal.isOpen}
                    onClose={() => setAiModal(null)}
                    originalText={aiModal.original}
                    improvedText={aiModal.improved}
                    onAccept={() => {
                        handleChange(aiModal.index, aiModal.fieldId as any, aiModal.improved);
                        setAiModal(null);
                        toast.success("Changes applied!");
                    }}
                />
            )}
        </div>
    );
}
