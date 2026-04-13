"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { ImportResumeModal } from "@/components/dashboard/ImportResumeModal";

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
    atsScore: number;
    templateId?: string;
    isPublic?: boolean;
    slug?: string;
}

interface DashboardGridProps {
    resumes: Resume[];
}

export function DashboardGrid({ resumes }: DashboardGridProps) {
    const [showImport, setShowImport] = useState(false);

    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Create New Card */}
                <Link href="/editor" className="group">
                    <div className="h-full min-h-[220px] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-700/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-7 h-7 text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Create New Resume</span>
                        <span className="text-[10px] text-slate-400">Start from scratch or use AI</span>
                    </div>
                </Link>

                {/* Upload Card — Opens Modal */}
                <div className="group cursor-pointer" onClick={() => setShowImport(true)}>
                    <div className="h-full min-h-[220px] bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border-2 border-dashed border-cyan-200 dark:border-cyan-700/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7 text-cyan-500" />
                        </div>
                        <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Import Resume</span>
                        <span className="text-[10px] text-slate-400">Upload PDF or DOCX</span>
                    </div>
                </div>

                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
            </div>

            {resumes.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    Your created resumes will appear here
                </div>
            )}

            {/* Import Modal */}
            <ImportResumeModal isOpen={showImport} onClose={() => setShowImport(false)} />
        </>
    );
}
