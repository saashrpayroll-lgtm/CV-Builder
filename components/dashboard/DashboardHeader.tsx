"use client";

import { useState } from "react";
import { Plus, Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { ImportResumeModal } from "./ImportResumeModal";

interface DashboardHeaderProps {
    isPro?: boolean;
}

export function DashboardHeader({ isPro = false }: DashboardHeaderProps) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showImport, setShowImport] = useState(false);

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
                <p className="text-slate-500">Manage your CVs and cover letters</p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => setShowImport(true)}
                    className="hidden sm:flex"
                >
                    <Upload className="w-4 h-4 mr-2" /> Import PDF
                </Button>
                {!isPro && (
                    <Button
                        variant="ghost"
                        onClick={() => setShowUpgrade(true)}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                        <Sparkles className="w-4 h-4 mr-2" /> Upgrade to Pro
                    </Button>
                )}

                <Link href="/dashboard/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </Link>
            </div>

            <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
            <ImportResumeModal isOpen={showImport} onClose={() => setShowImport(false)} />
        </div>
    );
}
