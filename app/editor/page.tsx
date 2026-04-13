"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditorLayout from "@/components/editor/EditorLayout";
import { useResumeStore, initialResumeData } from "@/store/useResumeStore";
import { Loader2 } from "lucide-react";

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeId = searchParams.get("id");
    const { setResumeData, loadResume, data } = useResumeStore();
    const [isLoading, setIsLoading] = useState(!!resumeId);

    useEffect(() => {
        if (resumeId) {
            const loadExisting = async () => {
                try {
                    const res = await fetch(`/api/resume/${resumeId}`);
                    if (!res.ok) throw new Error("Failed to load");
                    const resume = await res.json();

                    loadResume({
                        ...initialResumeData,
                        ...resume.content,
                        id: resume.id,
                        title: resume.title || resume.content?.title || "Untitled Resume",
                        workExperience: resume.content?.workExperience || [],
                        education: resume.content?.education || [],
                        skills: resume.content?.skills || [],
                        projects: resume.content?.projects || [],
                        certifications: resume.content?.certifications || [],
                        languages: resume.content?.languages || [],
                        interests: resume.content?.interests || [],
                        achievements: resume.content?.achievements || [],
                        volunteerWork: resume.content?.volunteerWork || [],
                        publications: resume.content?.publications || [],
                        awards: resume.content?.awards || [],
                        socialLinks: resume.content?.socialLinks || [],
                        customSections: resume.content?.customSections || [],
                        coverLetter: resume.content?.coverLetter || "",
                    });
                } catch {
                    router.push("/dashboard");
                } finally {
                    setIsLoading(false);
                }
            };
            loadExisting();
        } else {
            const createNew = async () => {
                try {
                    const res = await fetch("/api/resume", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: "Untitled Resume",
                            content: initialResumeData,
                        }),
                    });
                    const result = await res.json();
                    if (result.success && result.resume) {
                        setResumeData({ ...initialResumeData, id: result.resume.id });
                        router.replace(`/editor?id=${result.resume.id}`);
                    } else {
                        router.push("/dashboard");
                    }
                } catch {
                    router.push("/dashboard");
                }
            };
            createNew();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeId]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-sm text-slate-500 font-medium">Loading your resume...</p>
                </div>
            </div>
        );
    }

    return <EditorLayout resumeId={resumeId || data.id} />;
}

export default function EditorPage() {
    return (
        <Suspense
            fallback={
                <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-sm text-slate-500 font-medium">Loading editor...</p>
                    </div>
                </div>
            }
        >
            <EditorContent />
        </Suspense>
    );
}
