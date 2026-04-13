"use client";

import { useResumeStore, Education } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";

export function EducationForm() {
    const { data, updateSection } = useResumeStore();
    const education = data.education || [];

    const handleAdd = () => {
        const newEdu: Education = {
            id: crypto.randomUUID(),
            school: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
        };
        updateSection("education", [...education, newEdu]);
    };

    const handleDelete = (index: number) => {
        const updated = education.filter((_, i) => i !== index);
        updateSection("education", updated);
    };

    const handleChange = (index: number, field: keyof Education, value: any) => {
        const updated = [...education];
        updated[index] = { ...updated[index], [field]: value };
        updateSection("education", updated);
    };

    return (
        <div className="space-y-6 pb-20">
            <Reorder.Group axis="y" values={education} onReorder={(newOrder) => updateSection("education", newOrder)} className="space-y-4">
                {education.map((edu, index) => (
                    <Reorder.Item
                        key={edu.id}
                        value={edu}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 relative group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Education {index + 1}</h4>
                            <div className="flex-1" />
                            <button onClick={() => handleDelete(index)} className="text-white/20 hover:text-red-400 transition-colors">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-white/70">School / University</Label>
                                <Input
                                    value={edu.school}
                                    onChange={(e) => handleChange(index, "school", e.target.value)}
                                    placeholder="e.g. Stanford University"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Degree</Label>
                                <Input
                                    value={edu.degree}
                                    onChange={(e) => handleChange(index, "degree", e.target.value)}
                                    placeholder="e.g. Master of Science"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Field of Study</Label>
                                <Input
                                    value={edu.fieldOfStudy}
                                    onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                                    placeholder="e.g. Computer Science"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-white/70">Start Date</Label>
                                    <Input
                                        value={edu.startDate}
                                        onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                        placeholder="2018"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-white/70">End Date</Label>
                                    <Input
                                        value={edu.endDate}
                                        onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                        placeholder="2022"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <Button onClick={handleAdd} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
        </div>
    );
}
