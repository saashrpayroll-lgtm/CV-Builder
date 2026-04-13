import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sparkles, FileText, Shield, Zap, CheckCircle, ArrowRight,
    Star, Users, Award, Globe, Bot, Wand2, Download
} from "lucide-react";

const features = [
    { icon: Bot, title: "Dual AI Engine", desc: "Gemini for content generation + Groq for real-time assistance", color: "from-indigo-500 to-purple-500" },
    { icon: FileText, title: "20+ Premium Templates", desc: "Modern, Corporate, Creative, ATS-Optimized & Fresher categories", color: "from-cyan-500 to-blue-500" },
    { icon: Shield, title: "ATS-Optimized", desc: "AI-powered scoring to beat applicant tracking systems", color: "from-emerald-500 to-teal-500" },
    { icon: Zap, title: "Instant AI Generation", desc: "Generate full resume from just a job title in seconds", color: "from-amber-500 to-orange-500" },
    { icon: Download, title: "PDF & DOCX Export", desc: "Pixel-perfect exports ready for any application", color: "from-pink-500 to-rose-500" },
    { icon: Wand2, title: "Smart Polish", desc: "One-click grammar fix, impact boost & ATS optimization", color: "from-violet-500 to-fuchsia-500" },
];

const stats = [
    { value: "20+", label: "Templates" },
    { value: "10+", label: "AI Tools" },
    { value: "100%", label: "ATS Friendly" },
    { value: "Free", label: "To Start" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm">R</div>
                        Resume<span className="text-indigo-600">AI</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:inline">Login</Link>
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 px-6 h-10 font-bold rounded-xl text-sm">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute top-40 right-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
                </div>

                <div className="max-w-5xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-full px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Powered by Gemini + Groq AI
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
                        Build Your
                        <br />
                        <span className="text-gradient">Perfect Resume</span>
                        <br />
                        with AI
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Create stunning, ATS-optimized resumes in minutes. Dual-AI engine generates, polishes, and scores your resume for maximum impact.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-indigo-500/30 px-8 h-14 font-bold rounded-2xl text-lg gap-2">
                                Start Building Free <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="px-8 h-14 font-bold rounded-2xl text-lg border-2">
                                Login
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 sm:gap-16 flex-wrap">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl font-black text-gradient">{stat.value}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tight mb-4">Everything You Need</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Professional-grade tools powered by cutting-edge AI to make your resume stand out
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tight mb-4">How It Works</h2>
                        <p className="text-lg text-slate-500">Three simple steps to your dream resume</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Choose", desc: "Pick a template or let AI generate from your job title", icon: "🎨" },
                            { step: "02", title: "Customize", desc: "Edit sections, drag-and-drop, get AI suggestions ", icon: "✏️" },
                            { step: "03", title: "Export", desc: "Download as pixel-perfect PDF or editable DOCX", icon: "📄" },
                        ].map(({ step, title, desc, icon }) => (
                            <div key={step} className="text-center relative">
                                <div className="text-6xl mb-4">{icon}</div>
                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Step {step}</div>
                                <h3 className="text-xl font-bold mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2dyaWQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-40" />
                    <div className="relative">
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                            Ready to Land Your Dream Job?
                        </h2>
                        <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                            Join thousands of professionals who built their winning resume with ResumeAI
                        </p>
                        <Link href="/signup">
                            <Button className="bg-white text-indigo-700 hover:bg-white/90 font-bold px-8 h-14 rounded-2xl text-lg shadow-xl">
                                Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black">R</div>
                        ResumeAI
                    </div>
                    <p className="text-xs text-slate-400">© 2026 ResumeAI. Built with AI for professionals.</p>
                </div>
            </footer>
        </div>
    );
}
