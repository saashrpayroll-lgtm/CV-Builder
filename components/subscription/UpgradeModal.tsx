"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to start checkout");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 bg-white dark:bg-slate-900 shadow-2xl">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-20" />
                    <div className="relative z-10">
                        <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-1">Upgrade to Pro</DialogTitle>
                        <DialogDescription className="text-indigo-100 dark:text-indigo-100">
                            Unlock the full potential of your career.
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">Unlimited AI Resume Enhancements</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">Access to ALL Premium Templates</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">Unlimited PDF Downloads</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">Priority Support</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 text-center border border-slate-100 dark:border-slate-700">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            $19<span className="text-sm font-medium text-slate-500">/mo</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Cancel anytime. No questions asked.</p>
                    </div>

                    <Button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 font-semibold"
                    >
                        {loading && <Zap className="w-4 h-4 mr-2 animate-pulse" />}
                        {loading ? "Processing..." : "Upgrade Now"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
