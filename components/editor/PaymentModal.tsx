"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, CheckCircle, Loader2, IndianRupee, QrCode, Zap } from "lucide-react";
import { submitUTR } from "@/app/actions/payments";
import { useResumeStore } from "@/store/useResumeStore";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    monetizationSettings: Record<string, string | number | boolean | null>;
}

export function PaymentModal({ isOpen, onClose, monetizationSettings }: PaymentModalProps) {
    const { setExportCredits } = useResumeStore();
    const [selectedPackage, setSelectedPackage] = useState<1 | 3>(1);
    const [utr, setUtr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const price = Number(selectedPackage === 1 ? monetizationSettings?.export_price_1 : monetizationSettings?.export_price_3) || 49;

    const handleSubmit = async () => {
        if (!utr || utr.trim().length < 8) {
            toast.error("Please enter a valid UTR or Transaction ID (min 8 chars).");
            return;
        }

        setIsSubmitting(true);
        const res = await submitUTR(utr, price, selectedPackage);
        setIsSubmitting(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            setIsSuccess(true);
            if (res.autoApproved && res.credits !== undefined) {
                // Update the global store immediately
                setExportCredits(res.credits);
                toast.success("🎉 Payment auto-approved! Export unlocked instantly!");
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setUtr("");
                    // No reload needed now, UI is reactive
                }, 1500);
            } else {
                toast.success("UTR submitted! Waiting for Admin approval.");
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setUtr("");
                }, 3000);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start relative">
                    <div className="z-10">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Unlock Premium Export</h2>
                        <p className="text-sm text-slate-500 mt-1 max-w-[90%]">
                            {monetizationSettings?.export_payment_message || "Pay to unlock downloading and printing features."}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors z-10">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                    {/* Decorative element */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                </div>

                {isSuccess ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold">
                            {monetizationSettings?.auto_approve_payments ? "Instantly Unlocked!" : "Verification Pending"}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {monetizationSettings?.auto_approve_payments 
                                ? "Your payment was auto-verified. You can now use all premium features!"
                                : `Your Transaction ID \`${utr}\` has been securely sent to the Admin. Once verified, your resume will be fully unlocked.`}
                        </p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Package Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSelectedPackage(1)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${
                                    selectedPackage === 1 
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
                                }`}
                            >
                                <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <IndianRupee className="w-4 h-4 mr-0.5" />{monetizationSettings?.export_price_1 || 49}
                                </div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">1x Export</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Valid forever</div>
                            </button>

                            <button
                                onClick={() => setSelectedPackage(3)}
                                className={`text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                                    selectedPackage === 3 
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
                                }`}
                            >
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                    <IndianRupee className="w-4 h-4 mr-0.5" />{monetizationSettings?.export_price_3 || 99}
                                </div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">3x Exports</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Best value</div>
                            </button>
                        </div>

                        {/* UPI QR Display */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex gap-4 items-center border border-slate-100 dark:border-slate-700 shadow-inner">
                            {monetizationSettings?.payment_upi_qr ? (
                                <div className="w-24 h-24 shrink-0 bg-white p-1 rounded-lg border shadow-sm flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={String(monetizationSettings.payment_upi_qr)} alt="UPI QR" className="max-w-full max-h-full rounded" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                                    <QrCode className="w-8 h-8" />
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">Scan & Pay via UPI</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Scan with GPay, PhonePe, or Paytm.<br/>
                                    Pay <span className="font-bold text-slate-900 dark:text-slate-100 italic">₹{price}</span> and enter UTR below.
                                </p>
                            </div>
                        </div>

                        {/* Direct UPI Pay Link */}
                        {monetizationSettings?.payment_gateway_key && (
                            <a
                                href={String(monetizationSettings.payment_gateway_key).replace(/&am=\d+/, `&am=${price}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                <Zap className="w-4 h-4 fill-white animate-pulse" /> Tap to Pay ₹{price} (Mobile Only)
                            </a>
                        )}

                        {/* UTR Input Form */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Enter Transaction ID (UTR)</label>
                                <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">12 Digits</span>
                            </div>
                            <Input 
                                placeholder="E.g. 301294857102"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                className="h-12 text-center text-xl tracking-[0.3em] font-mono border-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all !rounded-xl"
                            />
                        </div>

                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || utr.length < 8}
                            className="w-full h-12 text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl shadow-xl transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Submit & Unlock Now"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
