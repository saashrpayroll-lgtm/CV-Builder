import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Users as UsersIcon, FileText, CreditCard,
    Settings, Bot, Wallet, Shield, TrendingUp,
    Activity, BarChart3, ArrowUpRight, Clock,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSettingsForm from "./AdminSettingsForm";
import { UsersTable } from "./UsersTable";
import { PaymentsTable } from "./PaymentsTable";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/portal-admin-login');

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (profile?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    // Initialize Admin Settings if not present
    let { data: adminSettings } = await supabase.from('admin_settings').select('*').eq('admin_id', user.id).single();

    if (!adminSettings) {
        const { data: newSettings } = await supabase.from('admin_settings').insert([{
            admin_id: user.id, ai_enabled: false, ai_provider: 'GEMINI', monetization_enabled: false, premium_price: 10
        }]).select().single();
        adminSettings = newSettings;
    }

    // Fetch all data
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    const { count: resumeCount } = await supabase.from('resumes').select('*', { count: 'exact', head: true });

    // Fetch payments
    const { data: paymentsRes, error: payErr } = await supabase
        .from('payments')
        .select('*, users(email, name)')
        .order('created_at', { ascending: false });
    const payments = payErr ? [] : (paymentsRes || []);

    const pendingCount = payments.filter((p: any) => p.status === 'PENDING').length;
    const approvedCount = payments.filter((p: any) => p.status === 'APPROVED').length;
    const revenue = payments.filter((p: any) => p.status === 'APPROVED').reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    // Active / Blocked / Suspended counts
    const activeUsers = (users || []).filter((u: any) => (u.status || 'ACTIVE') === 'ACTIVE').length;
    const blockedUsers = (users || []).filter((u: any) => u.status === 'BLOCKED').length;
    const suspendedUsers = (users || []).filter((u: any) => u.status === 'SUSPENDED').length;

    // Today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = (users || []).filter((u: any) => new Date(u.created_at) >= today).length;

    const stats = [
        { title: "Total Users", value: userCount || 0, change: `+${todayUsers} today`, icon: UsersIcon, color: "from-blue-500 to-cyan-500", bgGlow: "shadow-blue-500/20" },
        { title: "Total Resumes", value: resumeCount || 0, change: "All time", icon: FileText, color: "from-violet-500 to-purple-500", bgGlow: "shadow-violet-500/20" },
        { title: "Total Revenue", value: `₹${revenue.toLocaleString()}`, change: `${approvedCount} approved`, icon: CreditCard, color: "from-emerald-500 to-green-500", bgGlow: "shadow-emerald-500/20" },
        { title: "Pending UTRs", value: pendingCount, change: "Awaiting review", icon: Clock, color: "from-amber-500 to-orange-500", bgGlow: "shadow-amber-500/20" },
        { title: "AI Engine", value: adminSettings?.ai_enabled ? "Active" : "Disabled", change: adminSettings?.ai_provider || "GEMINI", icon: Bot, color: "from-pink-500 to-rose-500", bgGlow: "shadow-pink-500/20" },
        { title: "Monetization", value: adminSettings?.monetization_enabled ? "Enabled" : "Off", change: `₹${adminSettings?.export_price_1 || 49}/export`, icon: Wallet, color: "from-indigo-500 to-blue-500", bgGlow: "shadow-indigo-500/20" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Top Nav Bar */}
            <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-tight">Admin Console</h1>
                            <p className="text-[10px] text-slate-500 font-medium">Resume Builder SaaS Platform</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                            <span>{user.email}</span>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600">
                            <ArrowUpRight className="w-3 h-3" /> Dashboard
                        </Link>
                        <Link href="/auth/signout" className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40">
                            <LogOut className="w-3 h-3" /> Logout
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className={`bg-slate-900/60 border-slate-800/60 hover:border-slate-700/60 transition-all hover:-translate-y-0.5 shadow-lg ${stat.bgGlow}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.title}</p>
                                <p className="text-[10px] text-slate-600 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* User Status Summary Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-emerald-400 font-medium">{activeUsers} Active Users</span>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-amber-400 font-medium">{suspendedUsers} Suspended Users</span>
                    </div>
                    <div className="flex items-center gap-3 bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="text-sm text-rose-400 font-medium">{blockedUsers} Blocked Users</span>
                    </div>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-slate-900/60 border border-slate-800/60 p-1.5 rounded-xl flex-wrap h-auto gap-1">
                        <TabsTrigger value="users" className="rounded-lg text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 text-slate-400 px-4">
                            <UsersIcon className="w-4 h-4 mr-2" /> Users ({userCount || 0})
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="rounded-lg text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 px-4 relative">
                            <CreditCard className="w-4 h-4 mr-2" /> UTR Approvals
                            {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">{pendingCount}</span>}
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="rounded-lg text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 px-4">
                            <Bot className="w-4 h-4 mr-2" /> BYOK AI Engine
                        </TabsTrigger>
                        <TabsTrigger value="monetization" className="rounded-lg text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 px-4">
                            <Wallet className="w-4 h-4 mr-2" /> Monetization
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-lg text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 px-4">
                            <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card className="bg-slate-900/60 border-slate-800/60">
                            <CardHeader className="border-b border-slate-800/60 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white text-lg">User Management</CardTitle>
                                        <CardDescription className="text-slate-500">Full control over all registered users — status, credits, and access management.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                        <UsersIcon className="w-3.5 h-3.5" /> {userCount || 0} total
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <UsersTable users={users || []} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent value="payments">
                        <Card className="bg-slate-900/60 border-slate-800/60">
                            <CardHeader className="border-b border-slate-800/60 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white text-lg">UTR Payment Approvals</CardTitle>
                                        <CardDescription className="text-slate-500">Verify UPI transactions and approve to auto-assign export credits to users.</CardDescription>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                                            <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                            <TrendingUp className="w-3.5 h-3.5" /> ₹{revenue.toLocaleString()} Earned
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <PaymentsTable payments={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* AI Tab */}
                    <TabsContent value="ai">
                        <Card className="bg-slate-900/60 border-slate-800/60">
                            <CardHeader className="border-b border-slate-800/60 pb-4">
                                <CardTitle className="text-white text-lg">🧠 Bring Your Own Key (BYOK) AI Engine</CardTitle>
                                <CardDescription className="text-slate-500">Configure API keys to power AI resume generation, scoring, and skill suggestions for all users.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <AdminSettingsForm initialData={adminSettings} tab="ai" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Monetization Tab */}
                    <TabsContent value="monetization">
                        <Card className="bg-slate-900/60 border-slate-800/60">
                            <CardHeader className="border-b border-slate-800/60 pb-4">
                                <CardTitle className="text-white text-lg">💰 Monetization & Export Pricing</CardTitle>
                                <CardDescription className="text-slate-500">Set INR pricing for exports, upload UPI QR, and customize paywall messages.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <AdminSettingsForm initialData={adminSettings} tab="monetization" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/60 border-slate-800/60">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">📊 Revenue Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Approved Payments</span>
                                            <span className="text-lg font-bold text-emerald-400">₹{revenue.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-3">
                                            <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all" style={{ width: `${payments.length > 0 ? (approvedCount / payments.length * 100) : 0}%` }} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div className="bg-slate-800/50 rounded-xl p-3">
                                                <div className="text-lg font-bold text-emerald-400">{approvedCount}</div>
                                                <div className="text-[10px] text-slate-500">Approved</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-3">
                                                <div className="text-lg font-bold text-amber-400">{pendingCount}</div>
                                                <div className="text-[10px] text-slate-500">Pending</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-xl p-3">
                                                <div className="text-lg font-bold text-rose-400">{payments.filter((p: any) => p.status === 'REJECTED').length}</div>
                                                <div className="text-[10px] text-slate-500">Rejected</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800/60">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">👥 User Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                    <span className="text-sm text-slate-300">Active</span>
                                                </div>
                                                <span className="font-bold text-white">{activeUsers}</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-2.5">
                                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(userCount || 0) > 0 ? (activeUsers / (userCount || 1) * 100) : 0}%` }} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                    <span className="text-sm text-slate-300">Suspended</span>
                                                </div>
                                                <span className="font-bold text-white">{suspendedUsers}</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-2.5">
                                                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(userCount || 0) > 0 ? (suspendedUsers / (userCount || 1) * 100) : 0}%` }} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                                    <span className="text-sm text-slate-300">Blocked</span>
                                                </div>
                                                <span className="font-bold text-white">{blockedUsers}</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-2.5">
                                                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${(userCount || 0) > 0 ? (blockedUsers / (userCount || 1) * 100) : 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800/60 lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">🕐 Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 max-h-80 overflow-auto">
                                        {(users || []).slice(0, 10).map((u: any) => (
                                            <div key={u.id} className="flex items-center justify-between bg-slate-800/30 rounded-xl px-4 py-3 border border-slate-800/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {(u.name || u.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{u.name || 'Unnamed User'}</div>
                                                        <div className="text-[11px] text-slate-500">{u.email}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        (u.status || 'ACTIVE') === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        u.status === 'SUSPENDED' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                                    }`}>
                                                        {u.status || 'ACTIVE'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 mt-0.5">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
