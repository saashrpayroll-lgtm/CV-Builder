"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, CheckCircle, Loader2, IndianRupee, QrCode } from "lucide-react";
import { submitUTR } from "@/app/actions/payments";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    monetizationSettings: Record<string, string | number | boolean | null>;
}

export function PaymentModal({ isOpen, onClose, monetizationSettings }: PaymentModalProps) {
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
            if (res.autoApproved) {
                toast.success("🎉 Payment auto-approved! Export unlocked instantly!");
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setUtr("");
                    window.location.reload(); // Reload to refresh credits
                }, 2000);
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
                        <h3 className="text-xl font-bold">Verification Pending</h3>
                        <p className="text-slate-500 text-sm">Your Transaction ID `{utr}` has been securely sent to the Admin. Once verified, your export credits will be updated.</p>
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
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex gap-4 items-center border border-slate-100 dark:border-slate-700">
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
                                    1. Open any UPI app (GPay, PhonePe, Paytm).<br/>
                                    2. Scan the QR code to pay <span className="font-bold text-slate-700 dark:text-slate-300 block inline">₹{price}</span>.<br/>
                                    3. Copy the 12-digit UTR below.
                                </p>
                            </div>
                        </div>

                        {/* Direct UPI Pay Link */}
                        {monetizationSettings?.payment_gateway_key && (
                            <a
                                href={String(monetizationSettings.payment_gateway_key)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <IndianRupee className="w-4 h-4" /> Tap to Pay ₹{price} via UPI
                            </a>
                        )}

                        {/* UTR Input Form */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Submit Transaction ID (UTR)</label>
                            <Input 
                                placeholder="E.g. 301294857102"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                className="h-12 text-center text-lg tracking-widest font-mono border-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all"
                            />
                            <div className="flex items-start gap-2 mt-2 bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-snug">
                                    Your export will be unlocked as soon as the Admin verifies this ID inside the portal.
                                </p>
                            </div>
                        </div>

                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || utr.length < 8}
                            className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Submit for Verification"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
