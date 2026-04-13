import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // Get resume count
    const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // Get payment history
    const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your account, view usage stats, and payment history</p>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{resumeCount || 0}</div>
                    <div className="text-xs text-slate-500">Resumes Created</div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="text-2xl font-bold text-indigo-600">{profile?.credits || 0}</div>
                    <div className="text-xs text-slate-500">AI Credits</div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="text-2xl font-bold text-emerald-600">{profile?.export_credits || 0}</div>
                    <div className="text-xs text-slate-500">Export Credits</div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className={`text-2xl font-bold ${(profile?.status || 'ACTIVE') === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {profile?.status || 'ACTIVE'}
                    </div>
                    <div className="text-xs text-slate-500">Account Status</div>
                </div>
            </div>

            {/* Profile Form */}
            <ProfileForm profile={profile} userEmail={user.email || ''} />

            {/* Payment History */}
            {payments && payments.length > 0 && (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700/50">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">💳 Payment History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Transaction ID</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-center">Credits</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {payments.map((p: Record<string, string | number>) => (
                                    <tr key={String(p.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-4 py-3 text-xs text-slate-500">{new Date(String(p.created_at)).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400">{String(p.transaction_id)}</td>
                                        <td className="px-4 py-3 text-right font-medium">₹{p.amount}</td>
                                        <td className="px-4 py-3 text-center text-emerald-600 font-bold">+{p.credits_requested}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                p.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                                                'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                            }`}>
                                                {String(p.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
