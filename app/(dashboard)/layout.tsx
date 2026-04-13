import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, PenTool, LogOut, Shield, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: userData } = await supabase.from('users').select('name, role, credits, ai_credits_used').eq('id', user?.id).single();

    const isAdmin = userData?.role === 'ADMIN';
    const credits = Math.max(0, (userData?.credits || 5) - (userData?.ai_credits_used || 0));
    const totalCredits = userData?.credits || 5;
    const userName = userData?.name || user.email?.split('@')[0] || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:flex lg:flex-col">
                <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
                    <Link className="flex items-center gap-2.5 font-bold text-lg" href="/dashboard">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                        <span className="tracking-tight">Resume<span className="text-indigo-600">AI</span></span>
                    </Link>
                </div>

                <SidebarNav isAdmin={isAdmin} />

                {/* Credits Box */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">AI Credits</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{credits}</div>
                        <p className="text-[10px] text-slate-500 mt-1">of {totalCredits} remaining</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                        <span className="font-bold">Resume<span className="text-indigo-600">AI</span></span>
                    </div>

                    <div className="hidden lg:block" />

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full pl-3 pr-1 py-1">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {userName}
                            </span>
                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {userInitial}
                            </div>
                        </div>
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </header>
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
