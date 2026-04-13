"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import LivePreview from "./LivePreview";
import {
    ZoomIn, ZoomOut, Maximize2, Monitor, Layout,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { TopActionBar } from "./TopActionBar";
import { TemplateSidebar } from "./TemplateSidebar";
import { ControlSidebar } from "./ControlSidebar";
import { FloatingAIAssistant } from "./FloatingAIAssistant";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
    resumeId?: string;
    exportCredits?: number;
    monetizationSettings?: any;
}

export default function EditorLayout({ resumeId, exportCredits, monetizationSettings }: EditorLayoutProps) {
    const [zoom, setZoom] = useState(80);
    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);
    const [isTheftAttempt, setIsTheftAttempt] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "My_Resume",
    });

    // Anti-theft mechanism to prevent Ctrl+P and Right-Click
    useEffect(() => {
        if (!monetizationSettings?.monetization_enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                setIsTheftAttempt(true);
                setTimeout(() => setIsTheftAttempt(false), 3000);
            }
        };
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setIsTheftAttempt(true);
            setTimeout(() => setIsTheftAttempt(false), 3000);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [monetizationSettings]);

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
            <TopActionBar 
                onPrint={handlePrint} 
                resumeId={resumeId}
                exportCredits={exportCredits}
                monetizationSettings={monetizationSettings}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* LEFT: Templates */}
                <aside
                    className={cn(
                        "transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden z-20",
                        leftPanelVisible ? "w-72 lg:w-80" : "w-0 border-none"
                    )}
                >
                    <div className="w-80 h-full">
                        <TemplateSidebar />
                    </div>
                </aside>

                {/* LEFT TOGGLE */}
                <button
                    onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-1 rounded-r-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
                        leftPanelVisible ? "left-72 lg:left-80" : "left-0"
                    )}
                >
                    {leftPanelVisible ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* CENTER: Preview */}
                <main className="flex-1 relative flex flex-col bg-slate-100 dark:bg-slate-900/80 overflow-hidden">
                    <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center justify-between px-4 shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                                <Button variant="ghost" size="icon" className="h-6 w-6 bg-white dark:bg-slate-700 shadow-sm"><Monitor className="w-3 h-3" /></Button>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">A4 Canvas</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg h-7 px-1.5">
                                <button onClick={() => setZoom(Math.max(40, zoom - 10))} className="p-0.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500"><ZoomOut className="w-3 h-3" /></button>
                                <span className="text-[10px] font-bold w-9 text-center">{zoom}%</span>
                                <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-0.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500"><ZoomIn className="w-3 h-3" /></button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setZoom(80)} className="h-7 text-[10px] font-bold text-slate-400">
                                <Maximize2 className="w-3 h-3 mr-1" /> Fit
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6 lg:p-10 flex justify-center custom-scrollbar relative">
                        <div
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            className={cn(
                                "shadow-[0_20px_50px_rgba(0,0,0,0.08)] h-fit mb-20 rounded-sm ring-1 ring-black/5 transition-all duration-300",
                                isTheftAttempt && "blur-md scale-95"
                            )}
                        >
                            <LivePreview ref={componentRef} />
                        </div>
                        
                        {/* Theft Attempt Overlay */}
                        {isTheftAttempt && (
                            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
                                <div className="bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                        <Monitor className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">Premium Feature Locked</h3>
                                    <p className="text-sm text-rose-100">Screenshots and direct printing are disabled. Please use the Export menu.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* RIGHT TOGGLE */}
                <button
                    onClick={() => setRightPanelVisible(!rightPanelVisible)}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-1 rounded-l-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
                        rightPanelVisible ? "right-96" : "right-0"
                    )}
                >
                    {rightPanelVisible ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* RIGHT: Controls */}
                <aside
                    className={cn(
                        "transition-all duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden z-20",
                        rightPanelVisible ? "w-96" : "w-0 border-none"
                    )}
                >
                    <div className="w-96 h-full">
                        <ControlSidebar />
                    </div>
                </aside>
            </div>

            {/* Floating AI Assistant */}
            <FloatingAIAssistant />
        </div>
    );
}
