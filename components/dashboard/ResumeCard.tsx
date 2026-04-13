"use client";

import { MoreHorizontal, Edit, Copy, Trash2, ExternalLink, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ResumeCardProps {
    resume: {
        id: string;
        title: string;
        updatedAt: string;
        atsScore: number;
        templateId?: string;
        isPublic?: boolean;
        slug?: string;
    };
}

export function ResumeCard({ resume }: ResumeCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const router = useRouter();

    const scoreColor = resume.atsScore >= 70 ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" :
        resume.atsScore >= 40 ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10" :
            "text-red-500 bg-red-50 dark:bg-red-500/10";

    const handleDuplicate = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu(false);
        setIsDuplicating(true);
        try {
            const res = await fetch("/api/resume/duplicate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId: resume.id }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Resume duplicated!");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to duplicate");
            }
        } catch {
            toast.error("Duplication failed");
        }
        setIsDuplicating(false);
    }, [resume.id, router]);

    const handleDelete = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu(false);

        // Use setTimeout to ensure menu closes before confirm dialog
        setTimeout(async () => {
            if (!confirm("Are you sure you want to delete this resume?")) return;
            setIsDeleting(true);
            try {
                const res = await fetch(`/api/resume/${resume.id}`, { method: "DELETE" });
                const result = await res.json();
                if (result.success) {
                    toast.success("Resume deleted");
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to delete");
                }
            } catch {
                toast.error("Deletion failed");
            }
            setIsDeleting(false);
        }, 50);
    }, [resume.id, router]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu(false);
        router.push(`/editor?id=${resume.id}`);
    }, [resume.id, router]);

    return (
        <div className={cn(
            "group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            {/* Preview Area */}
            <Link href={`/editor?id=${resume.id}`}>
                <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden rounded-t-2xl">
                    <div className="w-24 h-32 bg-white dark:bg-slate-700 shadow-sm rounded border border-slate-200 dark:border-slate-600 p-2">
                        <div className="w-full h-2 bg-indigo-100 dark:bg-indigo-800/30 rounded-full mb-1.5" />
                        <div className="w-3/4 h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full mb-1" />
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-600 rounded-full mb-0.5" />
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-600 rounded-full mb-0.5" />
                        <div className="w-2/3 h-1 bg-slate-100 dark:bg-slate-600 rounded-full mb-2" />
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-600 rounded-full mb-0.5" />
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-600 rounded-full mb-0.5" />
                        <div className="w-4/5 h-1 bg-slate-100 dark:bg-slate-600 rounded-full" />
                    </div>

                    {/* ATS Badge */}
                    <div className={cn("absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold", scoreColor)}>
                        <TrendingUp className="w-3 h-3" />
                        {resume.atsScore}
                    </div>

                    {/* Public badge */}
                    {resume.isPublic && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                            <Globe className="w-3 h-3" /> Public
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <Link href={`/editor?id=${resume.id}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate hover:text-indigo-600 transition-colors">{resume.title}</h3>
                    </Link>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                    </p>
                </div>

                {/* Menu Trigger */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowMenu(!showMenu);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu - rendered as overlay */}
            {showMenu && (
                <>
                    {/* Backdrop to capture clicks outside */}
                    <div
                        className="fixed inset-0 z-[99]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                        }}
                    />
                    {/* Menu */}
                    <div
                        className="absolute right-4 bottom-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 w-44 z-[100] animate-scale-in"
                    >
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 w-full text-left text-slate-700 dark:text-slate-300 transition-colors"
                        >
                            <Edit className="w-4 h-4 text-indigo-500" /> Edit
                        </button>
                        <button
                            type="button"
                            onClick={handleDuplicate}
                            disabled={isDuplicating}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 w-full text-left text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
                        >
                            <Copy className="w-4 h-4 text-blue-500" /> {isDuplicating ? "Duplicating..." : "Duplicate"}
                        </button>
                        {resume.isPublic && resume.slug && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowMenu(false);
                                    window.open(`/r/${resume.slug}`, "_blank");
                                }}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 w-full text-left text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-green-500" /> View Public
                            </button>
                        )}
                        <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 w-full text-left transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
