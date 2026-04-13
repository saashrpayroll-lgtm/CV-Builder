"use client";

import { useResumeStore } from "@/store/useResumeStore";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, Wand2, ArrowRight, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
    id: number;
    type: string;
    section: string;
    title: string;
    description: string;
    before?: string;
    after?: string;
    priority?: string;
}

export function AIPolishModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { data, setResumeData } = useResumeStore();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
    const [accepted, setAccepted] = useState<Set<number>>(new Set());

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setSuggestions(null);
        setAccepted(new Set());

        try {
            const res = await fetch("/api/ai/polish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData: data }),
            });
            const result = await res.json();

            if (result.success && Array.isArray(result.suggestions)) {
                setSuggestions(result.suggestions.map((s: any, i: number) => ({ ...s, id: i + 1 })));
            } else {
                toast.error("Failed to analyze resume");
            }
        } catch {
            toast.error("AI analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleAccept = (id: number) => {
        const next = new Set(accepted);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setAccepted(next);
    };

    const handleApply = () => {
        if (!suggestions) return;
        const toApply = suggestions.filter(s => accepted.has(s.id));

        toApply.forEach(s => {
            if (s.after && s.section === "summary") {
                setResumeData({ summary: s.after });
            }
        });

        toast.success(`Applied ${toApply.length} improvement${toApply.length !== 1 ? 's' : ''}!`);
        onClose();
        setSuggestions(null);
        setAccepted(new Set());
    };

    const priorityColor: Record<string, string> = {
        high: "text-red-400 bg-red-500/10",
        medium: "text-amber-400 bg-amber-500/10",
        low: "text-blue-400 bg-blue-500/10",
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">AI Resume Polish</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Deep analysis of your resume using AI for impact, clarity, and ATS compatibility.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    {!isAnalyzing && !suggestions && (
                        <div className="text-center space-y-6 max-w-sm mx-auto py-8">
                            <div className="flex justify-center gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                                    <p className="text-[10px] uppercase font-bold mt-2 text-white/50">ATS Check</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <Zap className="w-6 h-6 text-amber-400 mx-auto" />
                                    <p className="text-[10px] uppercase font-bold mt-2 text-white/50">Impact Fix</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <Wand2 className="w-6 h-6 text-purple-400 mx-auto" />
                                    <p className="text-[10px] uppercase font-bold mt-2 text-white/50">Grammar</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300">
                                AI will scan every section and suggest high-impact improvements, ATS keyword optimization, and grammar fixes.
                            </p>
                            <Button onClick={handleAnalyze} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-12 font-bold text-lg rounded-xl">
                                Start Deep Analysis
                            </Button>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex flex-col items-center gap-4 py-16">
                            <div className="relative">
                                <Wand2 className="w-12 h-12 text-indigo-500 animate-pulse" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-3 border-2 border-dashed border-indigo-500/30 rounded-full"
                                />
                            </div>
                            <p className="text-sm font-medium animate-pulse">Analyzing with AI...</p>
                            <p className="text-xs text-slate-500">This may take 10-15 seconds</p>
                        </div>
                    )}

                    {suggestions && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1 mb-2">
                                <span className="text-xs text-slate-400">{suggestions.length} suggestions found</span>
                                <button
                                    onClick={() => setAccepted(new Set(suggestions.map(s => s.id)))}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Select All
                                </button>
                            </div>
                            {suggestions.map((s) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={s.id}
                                    className={`bg-white/5 border rounded-xl p-4 space-y-2 transition-all cursor-pointer ${
                                        accepted.has(s.id) ? "border-indigo-500/50 bg-indigo-500/10" : "border-white/10"
                                    }`}
                                    onClick={() => toggleAccept(s.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${priorityColor[s.priority || "medium"] || priorityColor.medium}`}>
                                                {s.type}
                                            </span>
                                            <h4 className="font-bold text-sm">{s.title}</h4>
                                        </div>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                            accepted.has(s.id) ? "bg-indigo-500 border-indigo-500" : "border-white/20"
                                        }`}>
                                            {accepted.has(s.id) && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                                    {s.before && s.after && (
                                        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 pt-1">
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-[10px] line-clamp-2 italic opacity-60">
                                                {s.before}
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-white/20" />
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-[10px] line-clamp-2 italic">
                                                {s.after}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {suggestions && (
                    <div className="pt-4 border-t border-white/5 flex gap-3">
                        <Button onClick={() => { setSuggestions(null); setAccepted(new Set()); }} variant="ghost" className="flex-1 h-11 text-white/60">
                            Re-analyze
                        </Button>
                        <Button onClick={handleApply} disabled={accepted.size === 0}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-11 font-bold rounded-xl disabled:opacity-40">
                            Apply {accepted.size} Selected
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
