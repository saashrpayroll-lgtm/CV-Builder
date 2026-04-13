import { createClient } from "@/lib/supabase/server";
import { Plus, FileText, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch resumes
    const { data: resumes } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });

    const resumeCount = resumes?.length || 0;
    const avgScore = resumes?.length
        ? Math.round((resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0)) / resumes.length)
        : 0;

    // Transform resumes for client component
    const resumeCards = (resumes || []).map((resume) => ({
        id: resume.id,
        title: resume.title,
        updatedAt: resume.updated_at,
        atsScore: resume.ats_score || 0,
        templateId: resume.template_id,
        isPublic: resume.is_public,
        slug: resume.slug,
    }));

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Resumes</h1>
                    <p className="text-slate-500 mt-1">Manage and create beautiful AI-powered resumes</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/editor">
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 font-bold gap-2 h-11 px-6 rounded-xl">
                            <Plus className="w-5 h-5" /> New Resume
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{resumeCount}</div>
                        <div className="text-xs text-slate-500 font-medium">Total Resumes</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{avgScore}</div>
                        <div className="text-xs text-slate-500 font-medium">Avg ATS Score</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">AI</div>
                        <div className="text-xs text-slate-500 font-medium">Dual AI Engine</div>
                    </div>
                </div>
            </div>

            {/* Resume Grid + Import Modal */}
            <DashboardGrid resumes={resumeCards} />
        </div>
    );
}
