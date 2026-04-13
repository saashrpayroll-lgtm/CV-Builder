import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

const GlitchTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[14px] font-bold uppercase tracking-widest text-cyan-400 border-l-4 border-fuchsia-500 pl-2 mb-3 mt-5 bg-slate-900/50 py-1">
        {children}
    </h2>
);

export default function CyberpunkTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility, theme } = data;
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", roboto: "'Roboto', sans-serif", monospace: "'Fira Code', monospace" };
    const font = fontMap[theme?.font] || fontMap.monospace;

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-white text-black" : "bg-slate-950 text-slate-300")} 
             style={{ fontFamily: font, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "1in" }}>
            
            <header className={cn("border-b border-cyan-500 pb-4 mb-4", isPrint ? "border-slate-300" : "")}>
                <h1 className={cn("text-4xl font-black uppercase tracking-tighter", isPrint ? "text-slate-900" : "text-fuchsia-500")}>
                    {personalInfo.fullName || "AGENT NAME"}
                </h1>
                <p className="text-sm uppercase tracking-widest text-cyan-400 mt-1 font-bold">
                    {personalInfo.jobTitle} {"//"} {personalInfo.location}
                </p>
                <div className="flex gap-4 text-[10px] mt-2 font-mono opacity-80">
                    {personalInfo.email && <span>[MSG] {personalInfo.email}</span>}
                    {personalInfo.phone && <span>[COM] {personalInfo.phone}</span>}
                    {personalInfo.github && <span>[NET] {personalInfo.github}</span>}
                </div>
            </header>

            {sectionVisibility?.summary && summary && (
                <section>
                    <GlitchTitle>SYS.SUMMARY</GlitchTitle>
                    <p className="text-[11px] leading-relaxed font-mono">{summary}</p>
                </section>
            )}

            {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                <section>
                    <GlitchTitle>OP.EXPERIENCE</GlitchTitle>
                    <div className="space-y-4">
                        {workExperience.map(e => (
                            <div key={e.id} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-cyan-500">
                                <div className="flex justify-between items-baseline">
                                    <span className={cn("font-bold text-[13px] uppercase", isPrint ? "" : "text-indigo-400")}>{e.position}</span>
                                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1">{e.startDate} - {e.current ? "ACTIVE" : e.endDate}</span>
                                </div>
                                <div className="text-[11px] mb-1 opacity-80">{e.company}</div>
                                <p className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap">{e.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex gap-8">
                <div className="flex-1">
                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <GlitchTitle>DB.EDUCATION</GlitchTitle>
                            {education.map(e => (
                                <div key={e.id} className="mb-2">
                                    <div className="text-[12px] font-bold">{e.degree} {e.fieldOfStudy}</div>
                                    <div className="text-[10px] opacity-70">{e.school} | {e.startDate}-{e.endDate}</div>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div className="flex-1">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section>
                            <GlitchTitle>MOD.SKILLS</GlitchTitle>
                            <div className="flex flex-wrap gap-1">
                                {skills.map(s => (
                                    <span key={s.id} className={cn("text-[10px] px-2 py-0.5 border font-mono", isPrint ? "border-slate-300" : "border-fuchsia-500 text-fuchsia-400")}>
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
