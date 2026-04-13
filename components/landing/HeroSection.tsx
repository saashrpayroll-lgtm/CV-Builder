"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle, Smartphone } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse-slow" />
                <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse-slow delay-1000" />
            </div>

            <div className="container px-4 mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>v2.0 is live: AI-Powered Builder</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Build your resume.<br />
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Land the interview.</span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The world's most advanced AI resume builder. Create professional, ATS-friendly resumes in minutes with smart templates and real-time previews.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/20">
                                Create My Resume <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="ghost" size="lg" className="h-12 px-8 text-lg rounded-full">
                                View Templates
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative max-w-5xl mx-auto perspective-1000"
                >
                    <div className="relative rounded-xl bg-slate-900/5 dark:bg-slate-100/5 p-2 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
                        {/* Browser Chrome */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            <div className="h-8 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            {/* Placeholder Landing Image/Content - Creating a CSS Resume Preview */}
                            <div className="aspect-[16/9] bg-slate-50 dark:bg-slate-950 flex relative overflow-hidden">
                                {/* Left Panel - Editor */}
                                <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-6 space-y-4 hidden md:block">
                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="space-y-2">
                                        <div className="h-10 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md" />
                                        <div className="h-10 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md" />
                                    </div>
                                    <div className="h-32 w-full bg-indigo-50 dark:bg-indigo-900/10 border-dashed border-2 border-indigo-200 dark:border-indigo-800 rounded-md flex items-center justify-center">
                                        <span className="text-xs text-indigo-400">AI Improving...</span>
                                    </div>
                                </div>

                                {/* Right Panel - Preview */}
                                <div className="flex-1 p-8 bg-slate-100/50 dark:bg-slate-900/50 flex justify-center items-start">
                                    <div className="w-[210px] h-[297px] bg-white shadow-lg p-3 text-[5px] space-y-2 overflow-hidden transform scale-150 origin-top">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-indigo-600 rounded-full" />
                                            <div>
                                                <div className="w-20 h-2 bg-slate-800 rounded mb-1" />
                                                <div className="w-12 h-1 bg-slate-400 rounded" />
                                            </div>
                                        </div>
                                        <div className="w-full h-1 bg-slate-200 rounded" />
                                        <div className="space-y-1">
                                            <div className="w-10 h-1 bg-slate-800 rounded" />
                                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="w-10 h-1 bg-slate-800 rounded" />
                                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                                        </div>

                                        {/* AI Badge Overlay */}
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute top-10 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-[6px] font-bold shadow-lg"
                                        >
                                            ATS 98%
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
