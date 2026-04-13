"use client";

import { useState } from "react";
import { useResumeStore, Skill } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Trash, Plus, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SkillsForm() {
    const { data, updateSection } = useResumeStore();
    const skills = data.skills || [];
    const [newSkillName, setNewSkillName] = useState("");
    const [category, setCategory] = useState("Technical");

    const handleAdd = () => {
        if (!newSkillName.trim()) return;
        const newSkill: Skill = {
            id: crypto.randomUUID(),
            name: newSkillName.trim(),
            category: category,
            percentage: 80,
        };
        updateSection("skills", [...skills, newSkill]);
        setNewSkillName("");
    };

    const handleDelete = (id: string) => {
        updateSection("skills", skills.filter(s => s.id !== id));
    };

    const handleUpdate = (id: string, updates: Partial<Skill>) => {
        updateSection("skills", skills.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="grid gap-2">
                    <Label className="text-white/70">Add New Skill</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="e.g. React, Python"
                            className="bg-white/5 border-white/10 text-white flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button onClick={handleAdd} size="icon" className="bg-indigo-600 hover:bg-indigo-500 shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 relative group"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-white/20" />
                                    <span className="text-sm font-bold text-white">{skill.name}</span>
                                </div>
                                <button onClick={() => handleDelete(skill.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Proficiency</span>
                                    <span className="text-indigo-400">{skill.percentage}%</span>
                                </div>
                                <Slider
                                    value={[skill.percentage]}
                                    onValueChange={(vals: number[]) => handleUpdate(skill.id, { percentage: vals[0] })}
                                    max={100}
                                    step={1}
                                    className="z-50"
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {skills.length === 0 && (
                    <div className="text-center py-10 text-white/20 italic text-sm">
                        No skills added yet...
                    </div>
                )}
            </div>
        </div>
    );
}
