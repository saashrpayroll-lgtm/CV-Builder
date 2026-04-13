"use client";

import { useEffect, useRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import EditorLayout from "@/components/editor/EditorLayout";

interface ResumeEditorProps {
    initialData: any;
    isPro: boolean;
}

export default function ResumeEditor({ initialData, isPro }: ResumeEditorProps) {
    const { setResumeData, setIsPro } = useResumeStore();
    const isMounted = useRef(false);

    useEffect(() => {
        setIsPro(isPro);
    }, [isPro, setIsPro]);

    useEffect(() => {
        if (initialData.content && !isMounted.current) {
            setResumeData({
                ...initialData.content,
                id: initialData.id,
                title: initialData.title || initialData.content.title || "Untitled Resume",
                workExperience: initialData.content.workExperience || [],
                education: initialData.content.education || [],
                skills: initialData.content.skills || [],
                projects: initialData.content.projects || [],
                certifications: initialData.content.certifications || [],
                languages: initialData.content.languages || [],
                interests: initialData.content.interests || [],
                achievements: initialData.content.achievements || [],
                volunteerWork: initialData.content.volunteerWork || [],
                publications: initialData.content.publications || [],
                awards: initialData.content.awards || [],
                socialLinks: initialData.content.socialLinks || [],
                customSections: initialData.content.customSections || [],
                coverLetter: initialData.content.coverLetter || "",
            });
            isMounted.current = true;
        }
    }, [initialData, setResumeData]);

    return <EditorLayout resumeId={initialData.id} />;
}
