"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIImprovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalText: string;
    improvedText: string;
    onAccept: () => void;
}

export function AIImprovementModal({ isOpen, onClose, originalText, improvedText, onAccept }: AIImprovementModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold">AI Suggestion</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Original</h4>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm leading-relaxed opacity-80 h-64 overflow-y-auto">
                            {originalText}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-indigo-500 uppercase tracking-wider flex items-center gap-2">
                            Improved
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        </h4>
                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto">
                            {/* A simple diff highlighter could act nicely here, for now just text */}
                            {improvedText}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6 flex justify-between sm:justify-between items-center w-full">
                    <div className="text-xs text-slate-400">
                        *Review changes carefully before accepting.
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-700">
                            <X className="w-4 h-4 mr-2" /> Discard
                        </Button>
                        <Button onClick={onAccept} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <Check className="w-4 h-4 mr-2" /> Accept Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
