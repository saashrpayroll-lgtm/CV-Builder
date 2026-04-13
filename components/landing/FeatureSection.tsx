"use client";

import { motion } from "framer-motion";
import { Bot, Palette, Layout, Zap, ArrowRight, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Bot,
        title: "AI Writing Assistant",
        description: "Generate professional summaries and bullet points instantly with our specialized AI models.",
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
        icon: Palette,
        title: "Premium Templates",
        description: "Stand out with data-driven templates designed by recruiters and top designers.",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
        icon: Zap,
        title: "Real-time ATS Score",
        description: "Get instant feedback on your resume's parseability and keyword matching.",
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
        icon: Layout,
        title: "Live Preview",
        description: "See changes instantly as you type with our split-screen editor technology.",
        color: "text-pink-500",
        bg: "bg-pink-50 dark:bg-pink-900/20"
    }
];

export function FeatureSection() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-slate-950 relative">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to get hired</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Stop struggling with Word documents. Our tools help you build a better resume, faster.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
