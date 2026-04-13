import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Users,
    FileText,
    TrendingUp,
    CreditCard,
    CheckCircle,
    ArrowLeft,
    Settings,
    Bot,
    Wallet
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSettingsForm from "./AdminSettingsForm";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if admin
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (profile?.role !== 'ADMIN' && user.email !== 'admin@example.com') {
        redirect('/dashboard');
    }

    // Initialize Admin Settings if not present
    let { data: adminSettings } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('admin_id', user.id)
        .single();

    if (!adminSettings) {
        const { data: newSettings } = await supabase
            .from('admin_settings')
            .insert([{
                admin_id: user.id,
                ai_enabled: false,
                ai_provider: 'GEMINI',
                monetization_enabled: false,
                premium_price: 10
            }])
            .select()
            .single();
        adminSettings = newSettings;
    }

    // Mock/Real Analytics fetching
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    
    const stats = [
        { title: "Total Users", value: userCount || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { title: "Active Resumes", value: 124, icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
        { title: "Pro Members", value: "32%", icon: CreditCard, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
        { title: "Conversion Rate", value: "8.4%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-2 text-sm mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                        <p className="text-slate-500">System telemetry, AI configuration, and monetization settings.</p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Settings className="w-4 h-4 mr-2"/> Overview</TabsTrigger>
                        <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Bot className="w-4 h-4 mr-2"/> AI Settings (BYOK)</TabsTrigger>
                        <TabsTrigger value="monetization" className="rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"><Wallet className="w-4 h-4 mr-2"/> Monetization</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat) => (
                                <Card key={stat.title} className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow transition-transform hover:-translate-y-1">
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

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Recent Resumes Created
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">PDF</div>
                                                    <div>
                                                        <p className="font-medium text-sm text-slate-900 dark:text-slate-200">Resume_{i}.json</p>
                                                        <p className="text-[10px] text-slate-400">Created 2 hours ago by user_{i}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px]">Modern</Badge>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="w-4 h-4" /> System Health
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">AI Engine</span>
                                            <span className={adminSettings?.ai_enabled ? "text-green-500 font-medium" : "text-slate-500 font-medium"}>
                                                {adminSettings?.ai_enabled ? `Active (${adminSettings?.ai_provider})` : 'Disabled'}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full w-full ${adminSettings?.ai_enabled ? 'bg-green-500' : 'bg-slate-400'}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Supabase DB</span>
                                            <span className="text-green-500 font-medium">99.9%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[99.9%] bg-green-500" />
                                        </div>
                                    </div>

                                    <Button className="w-full mt-4" variant="outline">
                                        Refresh Analytics
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="ai">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Bring Your Own Key (BYOK) AI Settings</CardTitle>
                                <CardDescription>
                                    Configure your personal API keys below to enable AI-powered features across the platform. These keys are stored encrypted and are unique to your admin session.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AdminSettingsForm initialData={adminSettings} tab="ai" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monetization">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader>
                                <CardTitle>Monetization & Payments</CardTitle>
                                <CardDescription>
                                    Enable paid templates, set premium pricing, and configure your payment receiving methods (Stripe Gateway or Custom UPI QR Code).
                                </CardDescription>
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

function Badge({ children, variant, className }: any) {
    return <span className={`px-2 py-0.5 rounded-full ${className} ${variant === 'outline' ? 'border border-slate-200 dark:border-slate-700' : ''}`}>{children}</span>
}
