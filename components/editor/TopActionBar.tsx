"use client"

import { Button } from "@/components/ui/button";
import {
    Download, Printer, Save, ChevronRight, FileText,
    Loader2, Check, ChevronDown, Lock
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { PaymentModal } from "./PaymentModal";

interface TopActionBarProps {
    onPrint?: () => void;
    resumeId?: string;
    exportCredits?: number;
    monetizationSettings?: any;
}

export function TopActionBar({ onPrint, resumeId, exportCredits = 0, monetizationSettings }: TopActionBarProps) {
    const { data, isSaving, setIsSaving, markSaved, lastSaved } = useResumeStore();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const isMonetized = monetizationSettings?.monetization_enabled;
    const isLocked = isMonetized && exportCredits <= 0;

    const handleSave = useCallback(async (silent = false) => {
        if (!resumeId || isSaving) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/resume/${resumeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    content: data,
                    templateId: data.templateId,
                }),
            });
            const result = await res.json();
            if (result.success) {
                markSaved();
                if (!silent) toast.success("Resume saved!");
            } else {
                throw new Error(result.error);
            }
        } catch {
            if (!silent) toast.error("Failed to save");
            setIsSaving(false);
        }
    }, [resumeId, data, isSaving, setIsSaving, markSaved]);

    // Auto-save every 30 seconds
    useEffect(() => {
        if (!resumeId) return;
        const timer = setInterval(() => {
            handleSave(true);
        }, 30000);
        return () => clearInterval(timer);
    }, [resumeId, handleSave]);

    const enforcePaywall = (action: () => void) => {
        setShowExportMenu(false);
        if (isLocked) {
            setShowPayment(true);
            return;
        }

        if (isMonetized) {
            toast.success(`Export authorized! Remaining credits after this: ${exportCredits - 1}`);
        }
        action();
    };

    const handleDownloadDocx = async () => {
        enforcePaywall(() => {
            toast.info("Preparing DOCX download...");
            setTimeout(() => toast.error("DOCX export coming soon!"), 1000);
        });
    };

    const handleDownloadPdf = () => {
        enforcePaywall(() => {
            onPrint?.();
        });
    };

    const handlePrint = () => {
        enforcePaywall(() => {
            onPrint?.();
        });
    };

    const timeSinceSave = lastSaved
        ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
        : "Not saved yet";

    return (
        <>
            <header className="h-14 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                        <span className="font-bold text-lg tracking-tight hidden lg:block">Resume<span className="text-indigo-600">AI</span></span>
                    </Link>
                    <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Link href="/dashboard" className="hover:text-slate-600 hidden sm:inline">My Resumes</Link>
                        <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[150px]">
                            {data.personalInfo?.fullName || data.title || "Untitled"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status UI */}
                    {isMonetized && (
                        <div className="hidden md:flex items-center tracking-widest gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold uppercase mr-2 border border-amber-200 dark:border-amber-900/50">
                            {exportCredits > 0 ? `${exportCredits} Exports Left` : <><Lock className="w-3 h-3"/> Locked</>}
                        </div>
                    )}

                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
                        {isSaving ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                        ) : (
                            <><Check className="w-3 h-3 text-green-500" /> {timeSinceSave}</>
                        )}
                    </div>

                    {/* Print Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className={`h-8 text-xs font-bold gap-1.5 ${isLocked ? 'text-amber-600 border-amber-300 hover:bg-amber-50' : ''}`}
                    >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Printer className="w-3.5 h-3.5 text-slate-500" />}
                        Print
                    </Button>

                    {/* Export dropdown */}
                    <div className="relative">
                        <Button
                            variant={isLocked ? "default" : "outline"} size="sm"
                            className={`h-8 text-xs font-bold gap-1.5 transition-all ${isLocked ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : ''}`}
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            {isLocked ? <Lock className="w-3.5 h-3.5"/> : <Download className="w-3.5 h-3.5 text-indigo-500" />}
                            Export
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border rounded-xl shadow-xl p-1 w-44 z-50 animate-scale-in origin-top-right">
                                <button onClick={handleDownloadPdf}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-rose-500" /> PDF</span>
                                    {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
                                </button>
                                <button onClick={handleDownloadDocx}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 mt-1">
                                    <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> DOCX</span>
                                    {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
                                </button>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white px-5 font-bold h-8 text-xs rounded-lg"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                        Save
                    </Button>
                </div>
            </header>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                monetizationSettings={monetizationSettings}
            />
        </>
    );
}
