"use client";

import { useResumeStore, Project } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, GripVertical, Link as LinkIcon } from "lucide-react";
import { Reorder } from "framer-motion";

export function ProjectsForm() {
    const { data, updateSection } = useResumeStore();
    const projects = data.projects || [];

    const handleAdd = () => {
        const newProj: Project = {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            link: "",
            technologies: [],
        };
        updateSection("projects", [...projects, newProj]);
    };

    const handleDelete = (index: number) => {
        const updated = projects.filter((_, i) => i !== index);
        updateSection("projects", updated);
    };

    const handleChange = (index: number, field: keyof Project, value: any) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        updateSection("projects", updated);
    };

    const handleTechChange = (index: number, techString: string) => {
        const technologies = techString.split(",").map(t => t.trim()).filter(t => t !== "");
        handleChange(index, "technologies", technologies);
    };

    return (
        <div className="space-y-6 pb-20">
            <Reorder.Group axis="y" values={projects} onReorder={(newOrder) => updateSection("projects", newOrder)} className="space-y-4">
                {projects.map((proj, index) => (
                    <Reorder.Item
                        key={proj.id}
                        value={proj}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 relative group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Project {index + 1}</h4>
                            <div className="flex-1" />
                            <button onClick={() => handleDelete(index)} className="text-white/20 hover:text-red-400 transition-colors">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-white/70">Project Name</Label>
                                <Input
                                    value={proj.name}
                                    onChange={(e) => handleChange(index, "name", e.target.value)}
                                    placeholder="e.g. AI Resume Studio"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Link (Optional)</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                    <Input
                                        value={proj.link}
                                        onChange={(e) => handleChange(index, "link", e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="bg-white/5 border-white/10 text-white pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Technologies (comma separated)</Label>
                                <Input
                                    value={proj.technologies.join(", ")}
                                    onChange={(e) => handleTechChange(index, e.target.value)}
                                    placeholder="React, Next.js, Tailwind..."
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white/70">Description</Label>
                                <Textarea
                                    value={proj.description}
                                    onChange={(e) => handleChange(index, "description", e.target.value)}
                                    placeholder="What did you build and which problems did you solve?"
                                    className="min-h-[100px] bg-white/5 border-white/10 text-white text-sm"
                                />
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <Button onClick={handleAdd} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
        </div>
    );
}
