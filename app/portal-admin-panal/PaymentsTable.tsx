"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { handlePaymentApproval } from "./actions";
import { Check, X as XIcon, Loader2, Search, Copy, Clock, CheckCircle, XCircle } from "lucide-react";

interface Payment {
    id: string;
    user_id: string;
    amount: number;
    transaction_id: string;
    status: string;
    credits_requested: number;
    created_at: string;
    users?: { email?: string; name?: string };
}

export function PaymentsTable({ payments }: { payments: Payment[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<string>("ALL");

    const handleApproval = async (id: string, action: 'APPROVED' | 'REJECTED') => {
        setLoadingId(id);
        const res = await handlePaymentApproval(id, action);
        if (res.error) toast.error(res.error);
        else toast.success(`Payment ${action.toLowerCase()}`);
        setLoadingId(null);
    };

    const copyTxnId = (txnId: string) => {
        navigator.clipboard.writeText(txnId);
        toast.success("Transaction ID copied!");
    };

    const filtered = payments.filter(p => {
        const matchesFilter = filter === "ALL" || p.status === filter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || p.transaction_id.toLowerCase().includes(q) ||
            p.users?.email?.toLowerCase().includes(q) || p.users?.name?.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-0">
            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-800/60 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by UTR, email, or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <div className="flex gap-1.5">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                filter === f
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                            }`}
                        >
                            {f === "ALL" ? `All (${payments.length})` :
                             f === "PENDING" ? `⏳ Pending (${payments.filter(p => p.status === 'PENDING').length})` :
                             f === "APPROVED" ? `✅ Approved (${payments.filter(p => p.status === 'APPROVED').length})` :
                             `❌ Rejected (${payments.filter(p => p.status === 'REJECTED').length})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800/30 text-slate-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">User Details</th>
                            <th className="px-4 py-3">UTR / Transaction ID</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-center">Credits</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {filtered.map((p) => {
                            const isPending = p.status === 'PENDING';
                            return (
                                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-slate-600">{new Date(p.created_at).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                {(p.users?.name || p.users?.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white text-xs">{p.users?.name || 'Unknown'}</div>
                                                <div className="text-[10px] text-slate-500">{p.users?.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                                                {p.transaction_id}
                                            </code>
                                            <button onClick={() => copyTxnId(p.transaction_id)} className="text-slate-600 hover:text-slate-300 transition-colors">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-bold text-white">₹{p.amount}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg">
                                            +{p.credits_requested}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant="outline" className={`text-[10px] font-bold ${
                                            p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            p.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                        }`}>
                                            {p.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {p.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                                            {p.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {isPending ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApproval(p.id, 'APPROVED')}
                                                    disabled={loadingId === p.id}
                                                    className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                                >
                                                    {loadingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1" /> Approve</>}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApproval(p.id, 'REJECTED')}
                                                    disabled={loadingId === p.id}
                                                    className="h-7 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs"
                                                >
                                                    {loadingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><XIcon className="w-3 h-3 mr-1" /> Reject</>}
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-500 italic">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-12 text-slate-500">
                                {searchQuery || filter !== "ALL" ? "No payments match your filter" : "No payment records yet"}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filtered.length} of {payments.length} transactions</span>
                <span className="text-[10px] text-slate-600 font-mono">Payment IDs are auto-generated UUIDs</span>
            </div>
        </div>
    );
}
