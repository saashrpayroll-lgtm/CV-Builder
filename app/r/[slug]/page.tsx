import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import UniversalRenderer from "@/components/templates/UniversalRenderer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: resume } = await supabase
        .from("resumes")
        .select("title, content")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

    const name = resume?.content?.personalInfo?.fullName || "Professional";
    const title = resume?.content?.personalInfo?.jobTitle || "Resume";

    return {
        title: `${name} — ${title} | ResumeAI`,
        description: `View ${name}'s professional resume`,
    };
}

export default async function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: resume, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

    if (error || !resume) {
        notFound();
    }

    const resumeData = resume.content;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-[10px]">R</div>
                        <span className="font-bold text-slate-800 dark:text-white">Resume<span className="text-indigo-600">AI</span></span>
                        <span className="text-slate-300 dark:text-slate-700 mx-2">•</span>
                        <span className="text-slate-500 text-xs">Shared Resume</span>
                    </div>
                    <a href="/" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                        Create your own →
                    </a>
                </div>
            </div>

            {/* Resume */}
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="flex justify-center">
                    <div className="shadow-2xl rounded-sm">
                        <UniversalRenderer data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
