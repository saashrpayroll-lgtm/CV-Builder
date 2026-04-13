"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { handlePaymentApproval } from "./actions";
import { Check, X as XIcon, Loader2 } from "lucide-react";

export function PaymentsTable({ payments }: { payments: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleApproval = async (id: string, action: 'APPROVED' | 'REJECTED') => {
        setLoadingId(id);
        const res = await handlePaymentApproval(id, action);
        if (res.error) toast.error(res.error);
        else toast.success(`Payment ${action.toLowerCase()}`);
        setLoadingId(null);
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">UTR / TXN ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Req. Credits</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payments.map((p) => {
                        const isPending = p.status === 'PENDING';
                        return (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 text-slate-500 text-xs">
                                    {new Date(p.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-slate-900 dark:text-white">{p.users?.email || 'Unknown User'}</div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded inline-block mt-2">
                                    {p.transaction_id}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-200">
                                    ₹{p.amount}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                                    +{p.credits_requested}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Badge variant="outline" className={
                                        p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                        p.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400' :
                                        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                                    }>
                                        {p.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {isPending ? (
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                size="icon" 
                                                variant="outline"
                                                onClick={() => handleApproval(p.id, 'APPROVED')}
                                                disabled={loadingId === p.id}
                                                className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                            >
                                                {loadingId === p.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="outline"
                                                onClick={() => handleApproval(p.id, 'REJECTED')}
                                                disabled={loadingId === p.id}
                                                className="h-8 w-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                            >
                                                {loadingId === p.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <XIcon className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Processed</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {payments.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-8 text-slate-500">No payment records found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
