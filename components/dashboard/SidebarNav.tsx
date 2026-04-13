"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, PenTool, Sparkles, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "My Resumes", href: "/dashboard", icon: FileText },
    { label: "Cover Letters", href: "/dashboard/cover-letters", icon: PenTool },
    { label: "AI Tools", href: "/dashboard/ai-tools", icon: Sparkles },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
];

interface SidebarNavProps {
    isAdmin: boolean;
}

export function SidebarNav({ isAdmin }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1 p-4 flex-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-sm transition-all",
                            isActive
                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}

            {isAdmin && (
                <Link
                    href="/portal-admin-panal"
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-sm transition-all mt-4 border-t border-slate-100 dark:border-slate-800 pt-4",
                        "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                    )}
                >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                </Link>
            )}
        </nav>
    );
}
