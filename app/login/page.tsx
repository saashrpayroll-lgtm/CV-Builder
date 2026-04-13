import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { GoogleLoginButton } from "@/components/auth/OAuthButtons";

interface LoginPageProps {
    searchParams: Promise<{ error?: string, success?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { error, success } = await searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">R</div>
                        Resume<span className="text-indigo-600">AI</span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">Welcome back</h1>
                        <p className="text-sm text-slate-500">Login to access your resumes</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-xl mb-4 border border-red-100 dark:border-red-500/20 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-xl mb-4 border border-green-100 dark:border-green-500/20 text-sm">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <p>{success}</p>
                        </div>
                    )}

                    <form className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@example.com" required
                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-indigo-600 font-medium hover:text-indigo-500">Forgot password?</Link>
                            </div>
                            <Input id="password" name="password" type="password" placeholder="Your password" required
                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500" />
                        </div>
                        <Button formAction={login} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 text-sm">
                            <LogIn className="w-4 h-4 mr-2" /> Login
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                        <span className="text-xs text-slate-400 uppercase font-medium">Or continue with</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <GoogleLoginButton />

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-500">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
