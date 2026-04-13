
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generateSummaryAction } from "@/app/actions/ai";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function SummaryForm() {
    const { data, updateSection } = useResumeStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [jobRole, setJobRole] = useState("");
    const [experience, setExperience] = useState("");
    const [open, setOpen] = useState(false);

    const handleGenerateSummary = async () => {
        if (!jobRole || !experience) {
            toast.error("Please fill in Job Role and Experience");
            return;
        }

        setIsGenerating(true);
        const result = await generateSummaryAction(jobRole, experience, data.summary);
        setIsGenerating(false);

        if (result.success && result.data) {
            updateSection('summary', result.data);
            setOpen(false);
            toast.success("Summary generated successfully!");
        } else {
            toast.error("Failed to generate summary");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="summary">Professional Summary</Label>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50">
                            <Sparkles className="h-3 w-3" />
                            AI Write
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>AI Summary Generator</DialogTitle>
                            <DialogDescription>
                                Let AI craft a compelling summary for you.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Target Job Role</Label>
                                <Input
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Years of Experience</Label>
                                <Input
                                    placeholder="e.g. 5"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleGenerateSummary} disabled={isGenerating}>
                                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Textarea
                id="summary"
                value={data.summary}
                onChange={(e) => updateSection('summary', e.target.value)}
                placeholder="Write a brief overview of your professional background and key achievements..."
                className="h-40 bg-white/5 border-white/10 text-white placeholder:text-white/20"
            />
        </div>
    );
}
