"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2, User, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ProfileFormProps {
    profile: Record<string, string | number | boolean | null> | null;
    userEmail: string;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: (profile?.name as string) || '',
        phone: (profile?.phone as string) || '',
        location: (profile?.location as string) || '',
        bio: (profile?.bio as string) || '',
        linkedin_url: (profile?.linkedin_url as string) || '',
        website_url: (profile?.website_url as string) || '',
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to update profile");
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full h-10 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm";

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
                    {(formData.name || userEmail)[0].toUpperCase()}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name || 'Unnamed User'}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {userEmail}</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <User className="w-3 h-3" /> Full Name
                        </Label>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone Number
                        </Label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                    </Label>
                    <input
                        type="text"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                        className={inputClass}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bio</Label>
                    <textarea
                        rows={3}
                        placeholder="A short bio about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn URL
                        </Label>
                        <input
                            type="url"
                            placeholder="https://linkedin.com/in/yourname"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData(p => ({ ...p, linkedin_url: e.target.value }))}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Website / Portfolio
                        </Label>
                        <input
                            type="url"
                            placeholder="https://yourportfolio.com"
                            value={formData.website_url}
                            onChange={(e) => setFormData(p => ({ ...p, website_url: e.target.value }))}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {isLoading ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
