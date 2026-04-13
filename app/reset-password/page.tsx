import { updatePassword } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle } from "lucide-react";

interface ResetPasswordPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { error } = await searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">Set New Password</h1>
                        <p className="text-sm text-slate-500">Please enter your new password below</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-xl mb-4 border border-red-100 dark:border-red-500/20 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">New Password</Label>
                            <Input id="password" name="password" type="password" placeholder="At least 6 characters" required minLength={6}
                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500" />
                        </div>
                        
                        <Button formAction={updatePassword} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 text-sm">
                            <Lock className="w-4 h-4 mr-2" /> Update Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
