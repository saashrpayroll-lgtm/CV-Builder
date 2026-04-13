"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateUserStatus, updateUserCredits, deleteUser } from "./actions";
import {
    Save, Trash2, Search, ChevronDown, ChevronUp,
    Shield, UserCheck, UserX, Ban, Loader2, MoreVertical,
    Zap, Download
} from "lucide-react";

export interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    plan?: string;
    status?: string;
    credits?: number;
    export_credits?: number;
    created_at?: string;
}

export function UsersTable({ users }: { users: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<string>("created_at");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        setLoadingId(userId);
        const res = await updateUserStatus(userId, newStatus);
        if (res.error) toast.error(res.error);
        else toast.success(`User marked as ${newStatus}`);
        setLoadingId(null);
    };

    const handleCreditsUpdate = async (userId: string, ai: number, exp: number) => {
        setLoadingId(userId);
        const res = await updateUserCredits(userId, ai, exp);
        if (res.error) toast.error(res.error);
        else toast.success("Credits updated successfully");
        setLoadingId(null);
    };

    const handleDelete = async (userId: string, email: string) => {
        if (!confirm(`Are you sure you want to permanently delete user "${email}"? This cannot be undone.`)) return;
        setLoadingId(userId);
        const res = await deleteUser(userId);
        if (res.error) toast.error(res.error);
        else toast.success("User deleted permanently");
        setLoadingId(null);
    };

    // Filter & Sort
    const filtered = users
        .filter(u => {
            const q = searchQuery.toLowerCase();
            return !q || (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.id.includes(q));
        })
        .sort((a, b) => {
            const aVal = (a as any)[sortField] || "";
            const bVal = (b as any)[sortField] || "";
            const cmp = String(aVal).localeCompare(String(bVal));
            return sortDir === "asc" ? cmp : -cmp;
        });

    const SortIcon = ({ field }: { field: string }) => {
        if (sortField !== field) return null;
        return sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
    };

    const handleSort = (field: string) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("desc"); }
    };

    return (
        <div className="space-y-0">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800/60">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800/30 text-slate-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("name")}>
                                User <SortIcon field="name" />
                            </th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("status")}>
                                Status <SortIcon field="status" />
                            </th>
                            <th className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> AI</div>
                            </th>
                            <th className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1"><Download className="w-3 h-3" /> Export</div>
                            </th>
                            <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("created_at")}>
                                Joined <SortIcon field="created_at" />
                            </th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {filtered.map((u) => (
                            <UserRow
                                key={u.id}
                                user={u}
                                loading={loadingId === u.id}
                                expanded={expandedId === u.id}
                                onToggle={() => setExpandedId(expandedId === u.id ? null : u.id)}
                                onStatus={(status: string) => handleStatusUpdate(u.id, status)}
                                onCredits={(ai: number, exp: number) => handleCreditsUpdate(u.id, ai, exp)}
                                onDelete={() => handleDelete(u.id, u.email || '')}
                            />
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-12 text-slate-500">
                                {searchQuery ? "No users match your search" : "No users found"}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filtered.length} of {users.length} users</span>
                <span>Click column headers to sort</span>
            </div>
        </div>
    );
}

interface UserRowProps {
    user: User;
    loading: boolean;
    expanded: boolean;
    onToggle: () => void;
    onStatus: (status: string) => void;
    onCredits: (ai: number, exp: number) => void;
    onDelete: () => void;
}

function UserRow({ user, loading, expanded, onToggle, onStatus, onCredits, onDelete }: UserRowProps) {
    const [aiCredits, setAiCredits] = useState(user.credits || 0);
    const [exportCredits, setExportCredits] = useState(user.export_credits || 0);
    const isCreditsDirty = aiCredits !== (user.credits || 0) || exportCredits !== (user.export_credits || 0);

    const statusConfig: Record<string, { bg: string; text: string; icon: typeof UserCheck }> = {
        ACTIVE: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", icon: UserCheck },
        SUSPENDED: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", icon: Ban },
        BLOCKED: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-400", icon: UserX },
    };

    const currentStatus = user.status || 'ACTIVE';
    const config = statusConfig[currentStatus] || statusConfig.ACTIVE;
    const StatusIcon = config.icon;

    return (
        <>
            <tr className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(user.name || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[180px]">{user.name || 'Unnamed User'}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{user.email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3">
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'} className={
                        user.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                    }>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role || 'USER'}
                    </Badge>
                </td>
                <td className="px-4 py-3">
                    <select
                        value={currentStatus}
                        onChange={(e) => onStatus(e.target.value)}
                        disabled={loading}
                        className={`text-xs p-1.5 rounded-lg font-bold border focus:ring-2 focus:outline-none cursor-pointer ${config.bg} ${config.text} border-current/20`}
                    >
                        <option value="ACTIVE">✅ Active</option>
                        <option value="SUSPENDED">⚠️ Suspended</option>
                        <option value="BLOCKED">🚫 Blocked</option>
                    </select>
                </td>
                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        value={aiCredits}
                        onChange={e => setAiCredits(parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs p-1.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    />
                </td>
                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        value={exportCredits}
                        onChange={e => setExportCredits(parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs p-1.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                        {isCreditsDirty && (
                            <Button
                                size="sm"
                                onClick={() => onCredits(aiCredits, exportCredits)}
                                disabled={loading}
                                className="h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" /> Save</>}
                            </Button>
                        )}
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onToggle}
                            className="h-7 w-7 text-slate-500 hover:text-white hover:bg-slate-800"
                        >
                            <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </td>
            </tr>
            {/* Expanded Actions Row */}
            {expanded && (
                <tr>
                    <td colSpan={7} className="bg-slate-800/10 border-b border-slate-800/40 px-4 py-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2">Quick Actions:</span>
                            <Button size="sm" variant="outline" onClick={() => onStatus('ACTIVE')} disabled={loading || currentStatus === 'ACTIVE'}
                                className="h-7 text-xs bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                                <UserCheck className="w-3 h-3 mr-1" /> Activate
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onStatus('SUSPENDED')} disabled={loading || currentStatus === 'SUSPENDED'}
                                className="h-7 text-xs bg-amber-500/5 border-amber-500/20 text-amber-400 hover:bg-amber-500/10">
                                <Ban className="w-3 h-3 mr-1" /> Suspend
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onStatus('BLOCKED')} disabled={loading || currentStatus === 'BLOCKED'}
                                className="h-7 text-xs bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10">
                                <UserX className="w-3 h-3 mr-1" /> Block
                            </Button>
                            <div className="flex-1" />
                            <Button size="sm" variant="destructive" onClick={onDelete} disabled={loading}
                                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white">
                                <Trash2 className="w-3 h-3 mr-1" /> Delete User
                            </Button>
                            <div className="w-full mt-2 text-[10px] text-slate-600 font-mono">
                                User ID: {user.id}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
