"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ImportResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ImportResumeModal({ isOpen, onClose }: ImportResumeModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/resume/upload", { method: "POST", body: formData });
            const result = await res.json();

            if (result.success && result.resume?.id) {
                toast.success("Resume imported & parsed with AI!");
                onClose();
                setFile(null);
                router.push(`/editor?id=${result.resume.id}`);
            } else {
                setError(result.error || "Failed to parse resume. Please try a different file.");
            }
        } catch (err: any) {
            setError("Upload failed. Please check your connection and try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File size must be under 10MB");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setFile(null); setError(null); } }}>
            <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
                        <Upload className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Import Resume</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Upload a PDF or DOCX file — AI will auto-parse it into editable sections
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-100 dark:border-red-500/20 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Drop zone */}
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5 transition-all group">
                        <input
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                        {file ? (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{file.name}</p>
                                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB • Click to change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3 group-hover:text-cyan-500 transition-colors" />
                                <p className="text-sm text-slate-500 font-medium">Drop your resume here or click to browse</p>
                                <p className="text-xs text-slate-400 mt-1.5">Supports PDF and DOCX (max 10MB)</p>
                            </div>
                        )}
                    </label>

                    {/* Upload button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 h-11 font-bold rounded-xl disabled:opacity-40 text-white shadow-lg shadow-cyan-500/20"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Parsing with AI...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Import & Edit Resume
                            </>
                        )}
                    </Button>

                    {/* Info */}
                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                        AI will extract your name, experience, education, skills and more into structured sections you can edit.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
