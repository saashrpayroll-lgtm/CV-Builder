"use client";

import { useState, useMemo } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { calculateATSScore } from "@/lib/ats/score";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PieChart, ListChecks, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ATSScanner() {
    const { data } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const atsResult = useMemo(() => {
        return calculateATSScore(data, jobDescription);
    }, [data, jobDescription]);

    const scoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-600";
        if (score >= 50) return "bg-yellow-600";
        return "bg-red-600";
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <PieChart className="h-4 w-4" />
                    ATS Score: <span className={cn("font-bold", scoreColor(atsResult.score))}>{atsResult.score}</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>ATS Resume Scanner</SheetTitle>
                    <SheetDescription>
                        Optimize your resume for Applicant Tracking Systems.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    {/* Score Display */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className={cn("text-6xl font-bold", scoreColor(atsResult.score))}>
                            {atsResult.score}
                        </div>
                        <div className="text-sm font-medium text-gray-500">Overall Score</div>
                        {/* Visual Progress Bar simulating circle */}
                        <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-500", getProgressColor(atsResult.score))}
                                style={{ width: `${atsResult.score}%` }}
                            />
                        </div>
                    </div>

                    {/* Job Description Input */}
                    <div className="space-y-2">
                        <Label>Target Job Description (Optional)</Label>
                        <Textarea
                            placeholder="Paste the job description here to check keyword matching..."
                            className="h-32 text-xs"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ListChecks className="h-4 w-4" /> Scoring Breakdown
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <ScoreItem label="Keywords" value={atsResult.breakdown.keywords} max={40} />
                            <ScoreItem label="Skills" value={atsResult.breakdown.skills} max={20} />
                            <ScoreItem label="Structure" value={atsResult.breakdown.structure} max={15} />
                            <ScoreItem label="Formatting" value={atsResult.breakdown.formatting} max={10} />
                            <ScoreItem label="Impact Verbs" value={atsResult.breakdown.impact} max={10} />
                            <ScoreItem label="Grammar" value={atsResult.breakdown.grammar} max={5} />
                        </div>
                    </div>

                    {/* Missing Keywords */}
                    {atsResult.missingKeywords.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Missing Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {atsResult.missingKeywords.map(kw => (
                                    <span key={kw} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Improvements */}
                    {atsResult.improvements.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-yellow-600 flex items-center gap-2">
                                <LightbulbIcon className="h-4 w-4" /> Suggestions
                            </h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                                {atsResult.improvements.map((imp, i) => (
                                    <li key={i}>{imp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ScoreItem({ label, value, max }: { label: string, value: number, max: number }) {
    const isFull = value === max;
    return (
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>{label}</span>
            <span className={cn("font-bold", isFull ? "text-green-600" : "text-gray-600")}>
                {value}/{max}
            </span>
        </div>
    )
}

function LightbulbIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-3-2.3-5-5-5S8 6.5 8 9.5c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
        </svg>
    )
}
