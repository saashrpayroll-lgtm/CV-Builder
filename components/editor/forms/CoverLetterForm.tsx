"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CoverLetterForm() {
    const { data, updateSection } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateCoverLetter = async () => {
        if (!companyName || !jobDescription) {
            toast.error("Please enter company name and job description");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: data,
                    jobDescription,
                    companyName,
                }),
            });
            const result = await res.json();
            if (result.success) {
                updateSection("coverLetter", result.coverLetter);
                toast.success("Cover letter generated!");
            } else {
                toast.error(result.error || "Generation failed");
            }
        } catch {
            toast.error("Failed to generate cover letter");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-3">
            <Input placeholder="Company Name" value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm h-9" />
            <Textarea placeholder="Paste job description here..." value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm min-h-[80px] resize-none" />
            <Button onClick={generateCoverLetter} disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white gap-2 h-10 font-semibold">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? "Generating..." : "AI Generate Cover Letter"}
            </Button>
            <Textarea
                placeholder="Your cover letter will appear here... You can also write manually."
                value={data.coverLetter || ""}
                onChange={(e) => updateSection("coverLetter", e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm min-h-[200px] resize-none"
            />
        </div>
    );
}
