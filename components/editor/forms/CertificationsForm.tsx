"use client";
import { useResumeStore, Certification } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award, ExternalLink } from "lucide-react";

export function CertificationsForm() {
    const { data, updateSection } = useResumeStore();
    const certs = data.certifications || [];

    const addCert = () => {
        updateSection("certifications", [...certs, {
            id: crypto.randomUUID(),
            name: "",
            issuer: "",
            date: "",
            expiryDate: "",
            link: "",
            credentialId: "",
        }]);
    };

    const updateCert = (id: string, field: keyof Certification, value: string) => {
        updateSection("certifications", certs.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    const removeCert = (id: string) => {
        updateSection("certifications", certs.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-4">
            {certs.map((cert, index) => (
                <div key={cert.id} className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase">Certification {index + 1}</span>
                        <button onClick={() => removeCert(cert.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <Input placeholder="Certification Name" value={cert.name}
                        onChange={(e) => updateCert(cert.id, "name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <Input placeholder="Issuing Organization" value={cert.issuer}
                        onChange={(e) => updateCert(cert.id, "issuer", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Date Issued" value={cert.date}
                            onChange={(e) => updateCert(cert.id, "date", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                        <Input placeholder="Credential ID" value={cert.credentialId || ""}
                            onChange={(e) => updateCert(cert.id, "credentialId", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm h-9" />
                    </div>
                    <Input placeholder="Verification URL (optional)" value={cert.link || ""}
                        onChange={(e) => updateCert(cert.id, "link", e.target.value)}
                        className="bg-white/5 border-white/10 text-white text-sm h-9" />
                </div>
            ))}
            <Button onClick={addCert} variant="ghost" className="w-full border border-dashed border-white/10 text-white/50 hover:text-white hover:bg-white/5 gap-2 h-10">
                <Plus className="w-4 h-4" /> Add Certification
            </Button>
        </div>
    );
}
