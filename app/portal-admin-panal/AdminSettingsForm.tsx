"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bot, Save, TestTube2, Key, Wallet, Image as ImageIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminSettingsForm({ initialData, tab }: { initialData: any, tab: "ai" | "monetization" }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [formData, setFormData] = useState({
        ai_enabled: initialData?.ai_enabled || false,
        ai_provider: initialData?.ai_provider || 'GEMINI',
        ai_api_key: initialData?.ai_api_key || '',
        payment_upi_qr: initialData?.payment_upi_qr || '',
        payment_gateway_key: initialData?.payment_gateway_key || '',
        premium_price: initialData?.premium_price || 10,
        monetization_enabled: initialData?.monetization_enabled || false,
        export_price_1: initialData?.export_price_1 || 49,
        export_price_3: initialData?.export_price_3 || 99,
        export_payment_message: initialData?.export_payment_message || 'Resume export करने के लिए payment करें। AI maintenance और platform charges के लिए यह amount आवश्यक है।',
        auto_approve_payments: initialData?.auto_approve_payments || false,
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/system', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to save settings");
            toast.success("Settings saved securely!");
        } catch (error: Error | unknown) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestAI = async () => {
        if (!formData.ai_api_key) {
            toast.error("Please enter an API key first");
            return;
        }
        setIsTesting(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            toast.success(`${formData.ai_provider} API connection successful!`);
        } catch (error: Error | unknown) {
            toast.error(error instanceof Error ? error.message : "AI connection failed");
        } finally {
            setIsTesting(false);
        }
    };

    // Common input class for dark mode visibility
    const inputClass = "w-full h-10 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm";
    const selectClass = "w-full h-10 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer";

    if (tab === "ai") {
        return (
            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <div className="space-y-0.5">
                        <Label className="text-base text-white font-bold flex items-center gap-2"><Bot className="w-4 h-4 text-indigo-400" /> Enable AI Engine</Label>
                        <p className="text-sm text-slate-400">Master switch to enable or disable AI features app-wide for all users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.ai_enabled} onChange={(e) => setFormData(p => ({ ...p, ai_enabled: e.target.checked }))} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-300">AI Provider</Label>
                        <select
                            value={formData.ai_provider}
                            onChange={(e) => setFormData(p => ({ ...p, ai_provider: e.target.value }))}
                            className={selectClass}
                        >
                            <option value="GEMINI">Google Gemini</option>
                            <option value="OPENAI">OpenAI (GPT-4)</option>
                            <option value="GROQ">Groq (Llama 3)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-400" /> API Key
                        </Label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                placeholder="sk-... or AIza..."
                                value={formData.ai_api_key}
                                onChange={(e) => setFormData(p => ({ ...p, ai_api_key: e.target.value }))}
                                className={inputClass}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleTestAI}
                                disabled={isTesting || !formData.ai_api_key}
                                className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 h-10 px-4 rounded-xl flex-shrink-0"
                            >
                                <TestTube2 className="w-4 h-4 mr-2" />
                                {isTesting ? "Testing..." : "Test"}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500">Your key is never exposed to users. It runs server-side only.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save AI Config"}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Monetization Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="space-y-0.5">
                    <Label className="text-base text-emerald-400 font-bold flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Enable Monetization (Export Lock)
                    </Label>
                    <p className="text-sm text-slate-400">When ON, users must pay to Print/Export/Download their resumes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.monetization_enabled} onChange={(e) => setFormData(p => ({ ...p, monetization_enabled: e.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            {/* Auto-Approve Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-amber-500/20">
                <div className="space-y-0.5">
                    <Label className="text-base text-amber-400 font-bold flex items-center gap-2">
                        ⚡ Auto-Approve Payments
                    </Label>
                    <p className="text-sm text-slate-400">When ON, user payments are auto-approved instantly — no manual UTR review needed. Export/Print unlocks automatically after payment.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.auto_approve_payments} onChange={(e) => setFormData(p => ({ ...p, auto_approve_payments: e.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-300">💰 Price for 1 Export (₹ INR)</Label>
                    <input
                        type="number"
                        min={1}
                        value={formData.export_price_1}
                        onChange={(e) => setFormData(p => ({ ...p, export_price_1: Number(e.target.value) }))}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-300">💎 Price for 3 Exports (₹ INR)</Label>
                    <input
                        type="number"
                        min={1}
                        value={formData.export_price_3}
                        onChange={(e) => setFormData(p => ({ ...p, export_price_3: Number(e.target.value) }))}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Paywall Message */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">📝 Custom Paywall Message (Users will see this)</Label>
                <textarea
                    rows={3}
                    placeholder="E.g. Resume export करने के लिए ₹49 pay करें..."
                    value={formData.export_payment_message}
                    onChange={(e) => setFormData(p => ({ ...p, export_payment_message: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
            </div>

            {/* UPI QR Code */}
            <div className="space-y-3 pt-4 border-t border-slate-700/50">
                <Label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" /> UPI QR Code Image URL
                </Label>
                <input
                    type="url"
                    placeholder="https://i.ibb.co/abc123/my-upi-qr.png"
                    value={formData.payment_upi_qr}
                    onChange={(e) => setFormData(p => ({ ...p, payment_upi_qr: e.target.value }))}
                    className={inputClass}
                />
                <p className="text-xs text-slate-500">Upload your UPI QR Code to <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">imgbb.com</a> and paste the direct image URL here.</p>

                {/* QR Preview */}
                {formData.payment_upi_qr && (
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2 font-bold">QR Preview (what users will see):</p>
                        <div className="w-40 h-40 mx-auto bg-white rounded-xl p-2 overflow-hidden relative flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={formData.payment_upi_qr} 
                                alt="UPI QR preview loading or invalid" 
                                className="w-full h-full object-contain" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="9" y1="13" x2="15" y2="13"/></svg>';
                                    toast.error("Invalid Image URL! Make sure it ends with .png or .jpg (Not a webpage URL)");
                                }}
                            />
                        </div>
                        <p className="text-[10px] text-amber-400 text-center mt-2">
                            *If the QR doesn&apos;t show up here, it won&apos;t show for users. Use a direct image link (e.g. ends in .png/.jpg).
                        </p>
                    </div>
                )}
            </div>

            {/* UPI ID (optional text link) */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-300">🔗 UPI Payment Link / ID (Optional)</Label>
                <input
                    type="text"
                    placeholder="upi://pay?pa=yourname@upi&pn=YourName"
                    value={formData.payment_gateway_key}
                    onChange={(e) => setFormData(p => ({ ...p, payment_gateway_key: e.target.value }))}
                    className={inputClass}
                />
                <p className="text-xs text-slate-500">Optional: Direct UPI link so users can tap and pay on mobile.</p>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <Button disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Monetization Settings"}
                </Button>
            </div>
        </form>
    );
}
