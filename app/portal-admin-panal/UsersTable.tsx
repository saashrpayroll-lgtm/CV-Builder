"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateUserStatus, updateUserCredits } from "./actions";
import { Save } from "lucide-react";

export interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    plan?: string;
    status?: string;
    credits?: number;
    export_credits?: number;
}

export function UsersTable({ users }: { users: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

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

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role & Plan</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">AI Credits</th>
                        <th className="px-4 py-3 text-center">Export Credits</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                        <UserRow 
                            key={u.id} 
                            user={u} 
                            loading={loadingId === u.id}
                            onStatus={(status: string) => handleStatusUpdate(u.id, status)}
                            onCredits={(ai: number, exp: number) => handleCreditsUpdate(u.id, ai, exp)}
                        />
                    ))}
                    {users.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-8 text-slate-500">No users found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

interface UserRowProps {
    user: User;
    loading: boolean;
    onStatus: (status: string) => void;
    onCredits: (ai: number, exp: number) => void;
}

function UserRow({ user, loading, onStatus, onCredits }: UserRowProps) {
    const [aiCredits, setAiCredits] = useState(user.credits || 0);
    const [exportCredits, setExportCredits] = useState(user.export_credits || 0);

    const isCreditsDirty = aiCredits !== (user.credits || 0) || exportCredits !== (user.export_credits || 0);

    return (
        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-4 py-3">
                <div className="font-semibold text-slate-900 dark:text-white">{user.name || 'Unnamed'}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.id.substring(0,8)}...</div>
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-1.5 flex-wrap">
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'} className={user.role==='ADMIN'? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}>
                        {user.role}
                    </Badge>
                    <Badge variant="outline" className={user.plan === 'PRO' ? 'border-yellow-500 text-yellow-600' : ''}>
                        {user.plan}
                    </Badge>
                </div>
            </td>
            <td className="px-4 py-3">
                <select 
                    value={user.status || 'ACTIVE'}
                    onChange={(e) => onStatus(e.target.value)}
                    disabled={loading}
                    className={`text-xs p-1.5 rounded-lg font-medium border focus:ring-2 focus:outline-none ${
                        (user.status || 'ACTIVE') === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 w-full' 
                        : (user.status === 'SUSPENDED' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400')
                    }`}
                >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
            </td>
            <td className="px-4 py-3 text-center">
                <input 
                    type="number" 
                    value={aiCredits} 
                    onChange={e => setAiCredits(parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-xs p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
                />
            </td>
            <td className="px-4 py-3 text-center">
                <input 
                    type="number" 
                    value={exportCredits} 
                    onChange={e => setExportCredits(parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-xs p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
                />
            </td>
            <td className="px-4 py-3 text-right">
                {isCreditsDirty ? (
                    <Button 
                        size="sm" 
                        onClick={() => onCredits(aiCredits, exportCredits)}
                        disabled={loading}
                        className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Save className="w-3.5 h-3.5 mr-1" /> Save
                    </Button>
                ) : (
                    <span className="text-xs text-slate-400 px-2">Saved</span>
                )}
            </td>
        </tr>
    );
}
