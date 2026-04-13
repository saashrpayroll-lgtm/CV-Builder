"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X, Circle, Square, RectangleHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PersonalInfoForm() {
    const { data, updateSection } = useResumeStore();
    const { personalInfo } = data;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateSection('personalInfo', { ...personalInfo, [name]: value });
    };

    const handlePhotoUpload = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            updateSection('personalInfo', { ...personalInfo, photo: result });
            toast.success("Photo added!");
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handlePhotoUpload(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handlePhotoUpload(file);
    };

    const removePhoto = () => {
        updateSection('personalInfo', { ...personalInfo, photo: undefined });
        toast.success("Photo removed");
    };

    const setPhotoShape = (shape: 'circle' | 'square' | 'rounded') => {
        updateSection('personalInfo', { ...personalInfo, photoShape: shape });
    };

    return (
        <div className="space-y-5">
            {/* Photo Upload */}
            <div className="space-y-3">
                <Label className="text-white/70 text-xs font-bold uppercase tracking-wider">Profile Photo <span className="text-white/30">(Optional)</span></Label>

                {personalInfo.photo ? (
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <img
                                src={personalInfo.photo}
                                alt="Profile"
                                className={cn(
                                    "w-20 h-20 object-cover border-2 border-indigo-500/50 shadow-lg",
                                    personalInfo.photoShape === 'circle' ? "rounded-full" :
                                        personalInfo.photoShape === 'rounded' ? "rounded-xl" : "rounded-none"
                                )}
                            />
                            <button
                                onClick={removePhoto}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] text-white/40">Shape:</p>
                            <div className="flex gap-1.5">
                                {([
                                    { shape: 'circle' as const, icon: Circle, label: 'Circle' },
                                    { shape: 'square' as const, icon: Square, label: 'Square' },
                                    { shape: 'rounded' as const, icon: RectangleHorizontal, label: 'Rounded' },
                                ] as const).map(({ shape, icon: Icon, label }) => (
                                    <button
                                        key={shape}
                                        onClick={() => setPhotoShape(shape)}
                                        className={cn(
                                            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                                            personalInfo.photoShape === shape
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        <Icon className="w-3 h-3" /> {label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                Change photo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                            isDragOver
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            isDragOver ? "bg-indigo-500/20 text-indigo-400" : "bg-white/10 text-white/30"
                        )}>
                            <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-medium text-white/60">Drop photo here or <span className="text-indigo-400">browse</span></p>
                            <p className="text-[10px] text-white/30 mt-0.5">JPG, PNG • Max 2MB</p>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Name & Title */}
            <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={personalInfo.fullName} onChange={handleChange} placeholder="John Doe" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" value={personalInfo.jobTitle} onChange={handleChange} placeholder="Software Engineer" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handleChange} placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={personalInfo.phone} onChange={handleChange} placeholder="+1 234 567 890" className="bg-white/5 border-white/10 text-white" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={personalInfo.location} onChange={handleChange} placeholder="New York, NY" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={personalInfo.website || ""} onChange={handleChange} placeholder="yoursite.com" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" value={personalInfo.linkedin || ""} onChange={handleChange} placeholder="linkedin.com/in/johndoe" className="bg-white/5 border-white/10 text-white" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" name="github" value={personalInfo.github || ""} onChange={handleChange} placeholder="github.com/johndoe" className="bg-white/5 border-white/10 text-white" />
            </div>
        </div>
    );
}
