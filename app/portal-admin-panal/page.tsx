import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Users as UsersIcon, FileText, TrendingUp, CreditCard,
    ArrowLeft, Settings, Bot, Wallet, Shield
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

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (profile?.role !== 'ADMIN' && user.email !== 'admin@example.com') {
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

    // Fetch data
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    
    // Fetch payments strictly for admin (if payments table exists, else empty fallback during migration)
    const { data: paymentsRes, error: payErr } = await supabase.from('payments').select('*, users(email, name)').order('created_at', { ascending: false });
    const payments = payErr ? [] : (paymentsRes || []);

    const pendingCount = payments.filter(p => p.status === 'PENDING').length;
    const revenue = payments.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + Number(p.amount), 0);

    const stats = [
        { title: "Total Users", value: userCount || 0, icon: UsersIcon, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { title: "Pending Approvals", value: pendingCount, icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
        { title: "Total Revenue", value: `₹${revenue}`, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { title: "AI Status", value: adminSettings?.ai_enabled ? "Active" : "Locked", icon: Bot, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-2 text-sm mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                        <p className="text-slate-500">Full system control, UTR approvals, and user management.</p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex-wrap h-auto">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Settings className="w-4 h-4 mr-2"/> Overview</TabsTrigger>
                        <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><UsersIcon className="w-4 h-4 mr-2"/> Users</TabsTrigger>
                        <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 relative">
                            <CreditCard className="w-4 h-4 mr-2"/> UTR Approvals
                            {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Bot className="w-4 h-4 mr-2"/> BYOK AI</TabsTrigger>
                        <TabsTrigger value="monetization" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Wallet className="w-4 h-4 mr-2"/> Export Pricing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <Card key={i} className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
                                            </div>
                                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>Suspend accounts or explicitly grant AI/Export credits to users.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UsersTable users={users || []} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payments">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>UTR Payment Approvals</CardTitle>
                                <CardDescription>Verify user transactions from their UPI scans and approve to unlock their Export Credits automatically.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentsTable payments={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ai">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Bring Your Own Key (BYOK) AI Settings</CardTitle>
                                <CardDescription>Configure personal API keys to enable premium AI-powered features.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AdminSettingsForm initialData={adminSettings} tab="ai" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monetization">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Monetization & Export Locks</CardTitle>
                                <CardDescription>Upload your UPI QR code, set pricing for 1 or 3 exports, and customize the paywall message users see when trying to download.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AdminSettingsForm initialData={adminSettings} tab="monetization" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
