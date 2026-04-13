import { Sparkles, Wand2, FileCheck, Type, Target, BookOpen, Zap } from "lucide-react";
import Link from "next/link";

const aiTools = [
    { name: "AI Resume Writer", desc: "Generate a full resume from a job title", icon: Wand2, color: "from-indigo-500 to-purple-500", href: "/editor" },
    { name: "ATS Score Checker", desc: "Check your resume's ATS compatibility", icon: FileCheck, color: "from-emerald-500 to-teal-500", href: "/editor" },
    { name: "Grammar Fixer", desc: "Fix grammar and improve clarity", icon: Type, color: "from-blue-500 to-cyan-500", href: "/editor" },
    { name: "Bullet Point Generator", desc: "Create impactful job descriptions", icon: Target, color: "from-orange-500 to-red-500", href: "/editor" },
    { name: "Skill Suggester", desc: "AI-recommended skills for your industry", icon: BookOpen, color: "from-pink-500 to-rose-500", href: "/editor" },
    { name: "Resume Polish", desc: "One-click professional enhancement", icon: Zap, color: "from-amber-500 to-yellow-500", href: "/editor" },
];

export default function AIToolsPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Tools</h1>
                <p className="text-slate-500 mt-1">Powerful AI-powered tools to perfect your resume</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((tool) => (
                    <Link key={tool.name} href={tool.href}>
                        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                            <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                <tool.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{tool.name}</h3>
                            <p className="text-xs text-slate-500">{tool.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30 text-center">
                <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">All AI tools are available inside the Editor</h3>
                <p className="text-sm text-slate-500">Open any resume to access the full AI assistant with all tools above.</p>
            </div>
        </div>
    );
}
