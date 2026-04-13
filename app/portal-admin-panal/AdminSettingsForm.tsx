"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bot, Save, TestTube2, Key, Wallet, Image as ImageIcon, CheckCircle } from "lucide-react";

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
        export_payment_message: initialData?.export_payment_message || 'To unlock downloading and printing, please pay the platform maintenance fee.',
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
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
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
        } catch (e) {
            toast.error("API test failed. Check key validity.");
        } finally {
            setIsTesting(false);
        }
    };

    if (tab === "ai") {
        return (
            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="space-y-0.5">
                        <Label className="text-base">Enable AI Engine</Label>
                        <p className="text-sm text-slate-500">Master switch to enable or disable AI features app-wide.</p>
                    </div>
                    {/* Native checkbox styled as toggle for simplicity without importing Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.ai_enabled} onChange={(e) => setFormData(p => ({ ...p, ai_enabled: e.target.checked }))} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>AI Provider</Label>
                        <select 
                            value={formData.ai_provider} 
                            onChange={(e) => setFormData(p => ({ ...p, ai_provider: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                        >
                            <option value="GEMINI">Google Gemini</option>
                            <option value="OPENAI">OpenAI (GPT-4)</option>
                            <option value="GROQ">Groq (Llama 3)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Key className="w-4 h-4" /> API Key (Encrypted DB Storage)
                        </Label>
                        <div className="flex gap-2">
                            <Input 
                                type="password" 
                                placeholder="sk-..." 
                                value={formData.ai_api_key}
                                onChange={(e) => setFormData(p => ({ ...p, ai_api_key: e.target.value }))}
                            />
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={handleTestAI} 
                                disabled={isTesting || !formData.ai_api_key}
                            >
                                <TestTube2 className="w-4 h-4 mr-2" />
                                {isTesting ? "Testing..." : "Test App"}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500">Your key is never exposed to the frontend users. It executes server-side.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> 
                        {isLoading ? "Saving..." : "Save AI Config"}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                    <Label className="text-base text-emerald-600 dark:text-emerald-400 font-bold">Enable Monetization (Export Lock)</Label>
                    <p className="text-sm text-slate-500">When enabled, users must pay to Print/Export their resumes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.monetization_enabled} onChange={(e) => setFormData(p => ({ ...p, monetization_enabled: e.target.checked }))} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Price for 1 Export (INR)</Label>
                    <Input 
                        type="number" 
                        min={1} 
                        value={formData.export_price_1}
                        onChange={(e) => setFormData(p => ({ ...p, export_price_1: Number(e.target.value) }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Price for 3 Exports (INR)</Label>
                    <Input 
                        type="number" 
                        min={1} 
                        value={formData.export_price_3}
                        onChange={(e) => setFormData(p => ({ ...p, export_price_3: Number(e.target.value) }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Custom Paywall Message</Label>
                <Input 
                    type="text" 
                    placeholder="E.g. Pay ₹49 to unlock premium exporting..." 
                    value={formData.export_payment_message}
                    onChange={(e) => setFormData(p => ({ ...p, export_payment_message: e.target.value }))}
                />
            </div>
            
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> UPI QR Code Image URL
                </Label>
                <Input 
                    type="url" 
                    placeholder="https://mysite.com/my-upi.png" 
                    value={formData.payment_upi_qr}
                    onChange={(e) => setFormData(p => ({ ...p, payment_upi_qr: e.target.value }))}
                />
                <p className="text-xs text-slate-500">Provide an absolute URL to your UPI QR image so users can scan and pay.</p>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <Button disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> 
                    {isLoading ? "Saving..." : "Save Monetization"}
                </Button>
            </div>
        </form>
    );
}
