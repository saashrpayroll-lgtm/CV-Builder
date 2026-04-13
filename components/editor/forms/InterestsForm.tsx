"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function InterestsForm() {
    const { data, updateSection } = useResumeStore();
    const interests = data.interests || [];

    const addInterest = () => {
        updateSection("interests", [...interests, {
            id: crypto.randomUUID(),
            name: "",
        }]);
    };

    const updateInterest = (id: string, value: string) => {
        updateSection("interests", interests.map(i =>
            i.id === id ? { ...i, name: value } : i
        ));
    };

    const removeInterest = (id: string) => {
        updateSection("interests", interests.filter(i => i.id !== id));
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
                        <input
                            value={interest.name}
                            onChange={(e) => updateInterest(interest.id, e.target.value)}
                            placeholder="Interest"
                            className="bg-transparent text-white text-xs outline-none w-20 min-w-0"
                        />
                        <button onClick={() => removeInterest(interest.id)} className="text-white/30 hover:text-red-400">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
            <Button onClick={addInterest} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Interest
            </Button>
        </div>
    );
}
