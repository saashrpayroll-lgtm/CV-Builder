"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Wand2, X, CheckCircle2, Loader2, Target, Lightbulb, PenTool, Shield, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useResumeStore } from "@/store/useResumeStore";
import { PaymentModal } from "./PaymentModal";

const AI_ACTIONS = [
    { id: "grammar", label: "Fix Grammar & Typos", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", api: "/api/ai/grammar-fix" },
    { id: "summary", label: "Rewrite Summary", icon: PenTool, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", api: "/api/resume/ai-section" },
    { id: "score", label: "ATS Score Check", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", api: "/api/ai/score" },
    { id: "errors", label: "Detect Errors", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", api: "/api/ai/detect-errors" },
    { id: "skills", label: "Suggest Skills", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", api: "/api/ai/suggest-skills" },
    { id: "cover", label: "Generate Cover Letter", icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", api: "/api/ai/cover-letter" },
];

export function FloatingAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const { data, setResumeData, updateSection, exportCredits, monetizationSettings } = useResumeStore();

    const isLocked = monetizationSettings?.monetization_enabled && exportCredits <= 0;

    const handleAction = async (action: typeof AI_ACTIONS[0]) => {
        if (isLocked) {
            setShowPayment(true);
            setIsOpen(false);
            return;
        }

        setActiveAction(action.id);
        try {
            let body: any = {};

            switch (action.id) {
                case "grammar":
                    body = { text: data.summary + "\n" + data.workExperience?.map(e => e.description).join("\n") };
                    break;
                case "summary":
                    body = { section: "summary", content: data.summary, action: "professionally rewrite" };
                    break;
                case "score":
                    body = { resumeData: data };
                    break;
                case "errors":
                    body = { resumeData: data };
                    break;
                case "skills":
                    body = { jobRole: data.personalInfo?.jobTitle || "Professional", currentSkills: data.skills?.map(s => s.name) };
                    break;
                case "cover":
                    toast.info("Open Cover Letter section to generate with job details");
                    setActiveAction(null);
                    setIsOpen(false);
                    return;
            }

            const res = await fetch(action.api, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const result = await res.json();

            if (action.id === "grammar" && result.success) {
                toast.success("Grammar fixed! Check your summary.");
                if (result.text) setResumeData({ summary: result.text });
            } else if (action.id === "summary" && result.success) {
                toast.success("Summary rewritten!");
                if (result.text) setResumeData({ summary: result.text });
            } else if (action.id === "score" && result.success) {
                toast.success(`ATS Score: ${result.totalScore}/100`);
            } else if (action.id === "errors" && result.success) {
                const errorCount = Array.isArray(result.errors) ? result.errors.length : 0;
                toast.info(`Found ${errorCount} issue(s). Check AI Polish for details.`);
            } else if (action.id === "skills" && result.success) {
                toast.success(`${Array.isArray(result.skills) ? result.skills.length : 0} skills suggested!`);
                if (Array.isArray(result.skills)) {
                    const newSkills = result.skills.slice(0, 5).map((s: any) => ({
                        id: crypto.randomUUID(),
                        name: s.name,
                        category: s.category || "General",
                        percentage: s.percentage || 80,
                    }));
                    updateSection("skills", [...(data.skills || []), ...newSkills]);
                }
            } else {
                toast.error("AI action failed");
            }
        } catch {
            toast.error("AI request failed");
        } finally {
            setActiveAction(null);
            setIsOpen(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 w-72 mb-2"
                    >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="font-bold text-sm">AI Copilot</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-1.5">
                            {AI_ACTIONS.map((action) => {
                                const Icon = action.icon;
                                const isLoading = activeAction === action.id;
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action)}
                                        disabled={!!activeAction}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all",
                                            action.bg,
                                            isLoading ? "opacity-70" : "hover:scale-[1.02]"
                                        )}
                                    >
                                        {isLoading ? <Loader2 className={cn("w-3.5 h-3.5 animate-spin", action.color)} /> : <Icon className={cn("w-3.5 h-3.5", action.color)} />}
                                        <span className="text-slate-700 dark:text-slate-200">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center transition-all duration-500 relative z-10",
                    isOpen ? "bg-slate-800 text-white rotate-180" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-110",
                    activeAction ? "animate-spin-slow" : "animate-float"
                )}
            >
                {/* AI Thinking glow */}
                {(!isOpen || activeAction) && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40 animate-pulse" />
                )}
                
                {/* Active loading ring */}
                {activeAction && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 animate-spin" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="301" strokeDashoffset="250" className="text-white/40" />
                    </svg>
                )}

                {isOpen ? <X className="w-6 h-6 transition-transform rotate-180" /> : <Sparkles className="w-6 h-6" />}
            </button>
            
            {/* Background Magic Particles when closed */}
            {!isOpen && !activeAction && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '3s' }} />
            )}

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                monetizationSettings={monetizationSettings || {}}
            />
        </div>
    );
}
