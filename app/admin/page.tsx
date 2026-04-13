import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Users,
    FileText,
    TrendingUp,
    CreditCard,
    CheckCircle,
    AlertCircle,
    LayoutDashboard,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if admin (simple check for now)
    const { data: profile } = await supabase.from('users').select('role').eq('id', user?.id).single();

    if (profile?.role !== 'ADMIN' && user?.email !== 'admin@example.com') {
        // redirect('/dashboard');
    }

    // Mock/Real Analytics fetching
    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: resumeCount } = await supabase.from('users').select('*', { count: 'exact', head: true }); // Mocking resumes count from users for now if table exists

    const stats = [
        { title: "Total Users", value: userCount || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Active Resumes", value: 124, icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
        { title: "Pro Members", value: "32%", icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
        { title: "Conversion Rate", value: "8.4%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm mb-4">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                        <p className="text-slate-500">System telemetry and user management.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow transition-transform hover:-translate-y-1">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
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
                    <Card className="lg:col-span-2 border-none shadow-sm h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Recent Resumes Created
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">PDF</div>
                                            <div>
                                                <p className="font-medium text-sm">Resume_{i}.json</p>
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

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-4 h-4" /> System Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Gemini API</span>
                                    <span className="text-green-500 font-medium">Operational</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Supabase DB</span>
                                    <span className="text-green-500 font-medium">99.9%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[99.9%] bg-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Storage Usage</span>
                                    <span className="text-orange-500 font-medium">72%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[72%] bg-orange-500" />
                                </div>
                            </div>

                            <Button className="w-full mt-4" variant="outline">
                                View Full Analytics
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, variant, className }: any) {
    return <span className={`px-2 py-0.5 rounded-full ${className} ${variant === 'outline' ? 'border' : ''}`}>{children}</span>
}
