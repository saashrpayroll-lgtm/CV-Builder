"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            router.push("/portal-admin-panal");
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl shadow-indigo-500/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Console</h1>
                    <p className="text-slate-400 mt-1 text-sm">Restricted access — Authorized personnel only</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/60 shadow-2xl p-8">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 border border-red-500/20 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="admin-email" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Admin Email</Label>
                            <Input
                                id="admin-email"
                                type="email"
                                placeholder="admin@yourdomain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 rounded-xl bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="admin-password" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Password</Label>
                            <div className="relative">
                                <Input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 rounded-xl bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500 pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 text-sm transition-all hover:shadow-indigo-500/40"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Authenticating...</>
                            ) : (
                                <><Shield className="w-4 h-4 mr-2" /> Access Admin Panel</>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-800">
                        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            🔒 Only accounts with ADMIN role can access this portal.
                            Contact the system administrator if you need access.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
