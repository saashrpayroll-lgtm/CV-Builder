import { createClient } from "@/lib/supabase/server";
import { PenTool, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoverLettersPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cover Letters</h1>
                    <p className="text-slate-500 mt-1">Generate AI-powered cover letters tailored to job descriptions</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <PenTool className="w-10 h-10 text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Cover Letter Generator</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                    Paste a job description and let AI create a personalized, compelling cover letter that matches your resume.
                </p>
                <Link href="/editor">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 font-bold gap-2 h-11 px-6 rounded-xl">
                        <Sparkles className="w-4 h-4" /> Generate Cover Letter
                    </Button>
                </Link>
            </div>
        </div>
    );
}
