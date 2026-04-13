"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Type, Maximize2, Minimize2, AlignJustify } from "lucide-react";
import { cn } from "@/lib/utils";

const FONTS = [
    { id: "inter", name: "Modern (Inter)" },
    { id: "merriweather", name: "Classic (Serif)" },
    { id: "roboto", name: "Clean (Roboto)" },
    { id: "playfair", name: "Elegant (Playfair)" },
];

const COLORS = [
    { hex: "#4f46e5", name: "Indigo" },
    { hex: "#0ea5e9", name: "Sky" },
    { hex: "#10b981", name: "Emerald" },
    { hex: "#f59e0b", name: "Amber" },
    { hex: "#ef4444", name: "Red" },
    { hex: "#ec4899", name: "Pink" },
    { hex: "#8b5cf6", name: "Violet" },
    { hex: "#1e293b", name: "Slate" },
    { hex: "#000000", name: "Pitch Black" },
    { hex: "#0f766e", name: "Teal" },
    { hex: "#b45309", name: "Gold" },
    { hex: "#991b1b", name: "Burgundy" },
];

export function ThemeSwitcher() {
    const { data, updateTheme } = useResumeStore();
    const { theme } = data;

    const currentFont = theme?.font || 'inter';
    const currentColor = theme?.accentColor || '#4f46e5';
    const currentViewMode = theme?.viewMode || 'standard';
    const currentFontSize = theme?.fontSize || 'medium';

    return (
        <div className="space-y-7 pb-10">
            {/* BRAND COLOR */}
            <div className="space-y-3">
                <Label className="text-white/50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                    <span>Brand Color</span>
                    <span className="text-indigo-400 font-mono lowercase">{currentColor}</span>
                </Label>
                <div className="flex flex-wrap gap-2.5">
                    {COLORS.map((color) => (
                        <button
                            key={color.hex}
                            className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-125 hover:shadow-lg",
                                currentColor === color.hex ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "opacity-80"
                            )}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => updateTheme({ accentColor: color.hex })}
                            title={color.name}
                        >
                            {currentColor === color.hex && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                    ))}
                    {/* Custom Color Input Wrapper */}
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 ring-offset-slate-900 hover:scale-110 transition-all cursor-pointer">
                        <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => updateTheme({ accentColor: e.target.value })}
                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0"
                            title="Custom Color"
                        />
                        <div className="w-full h-full rainbow-bg border border-white/20" style={{ background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' }} />
                    </div>
                </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="space-y-3">
                <Label className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Typography</Label>
                <div className="grid grid-cols-2 gap-2">
                    {FONTS.map((font) => (
                        <Button
                            key={font.id}
                            variant="outline"
                            className={cn(
                                "justify-start h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all",
                                currentFont === font.id && "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50"
                            )}
                            onClick={() => updateTheme({ font: font.id })}
                        >
                            <span className={cn(
                                "text-xs",
                                font.id === 'merriweather' ? 'font-serif' :
                                    font.id === 'playfair' ? 'font-serif italic' :
                                        'font-sans'
                            )}>
                                {font.name}
                            </span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* FONT SIZE SCALING */}
            <div className="space-y-3">
                <Label className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Font Size</Label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full">
                    {[
                        { id: 'small', icon: Type, size: 14, label: 'Small' },
                        { id: 'medium', icon: Type, size: 18, label: 'Medium' },
                        { id: 'large', icon: Type, size: 22, label: 'Large' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => updateTheme({ fontSize: opt.id as 'small' | 'medium' | 'large' })}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all",
                                currentFontSize === opt.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                            title={opt.label}
                        >
                            <opt.icon size={opt.size} />
                        </button>
                    ))}
                </div>
            </div>

            {/* LAYOUT DENSITY */}
            <div className="space-y-3">
                <Label className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Layout Density</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        className={cn(
                            "flex flex-col gap-1.5 h-16 bg-white/5 border-white/10 text-white transition-all",
                            currentViewMode === 'compact' ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50" : "hover:bg-white/10"
                        )}
                        onClick={() => updateTheme({ viewMode: 'compact' })}
                    >
                        <Minimize2 className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold">Compact</span>
                    </Button>
                    <Button
                        variant="outline"
                        className={cn(
                            "flex flex-col gap-1.5 h-16 bg-white/5 border-white/10 text-white transition-all",
                            currentViewMode === 'standard' ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50" : "hover:bg-white/10"
                        )}
                        onClick={() => updateTheme({ viewMode: 'standard' })}
                    >
                        <AlignJustify className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold">Standard</span>
                    </Button>
                    <Button
                        variant="outline"
                        className={cn(
                            "flex flex-col gap-1.5 h-16 bg-white/5 border-white/10 text-white transition-all",
                            currentViewMode === 'comfortable' ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50" : "hover:bg-white/10"
                        )}
                        onClick={() => updateTheme({ viewMode: 'comfortable' })}
                    >
                        <Maximize2 className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold">Comfort</span>
                    </Button>
                </div>
            </div>

        </div>
    );
}
