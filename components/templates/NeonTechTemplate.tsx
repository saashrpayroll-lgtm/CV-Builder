import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function NeonTechTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, sectionVisibility, theme } = data;

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-white text-slate-900" : "bg-[#0b0c10] text-[#c5c6c7]")} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px" }}>
            
            <header className="mb-10 text-center relative">
                <div className={cn("absolute inset-x-0 bottom-0 h-px", isPrint ? "bg-slate-300" : "bg-gradient-to-r from-transparent via-[#66fcf1] to-transparent")}></div>
                <h1 className={cn("text-5xl font-black tracking-tight mb-2", isPrint ? "text-slate-900" : "text-white drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]")}>{personalInfo.fullName}</h1>
                <p className={cn("text-lg uppercase tracking-[0.2em] font-medium mb-4", isPrint ? "text-slate-600" : "text-[#45a29e]")}>{personalInfo.jobTitle}</p>
                <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest pb-6 opacity-80">
                    {personalInfo.email && <span>email/{personalInfo.email}</span>}
                    {personalInfo.phone && <span>tel/{personalInfo.phone}</span>}
                    {personalInfo.location && <span>loc/{personalInfo.location}</span>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {sectionVisibility?.summary && summary && (
                        <section className={cn("p-5 rounded-lg border", isPrint ? "border-slate-200 bg-slate-50" : "border-[#1f2833] bg-[#1f2833]/40 backdrop-blur-sm")}>
                            <h2 className={cn("text-sm uppercase tracking-[0.1em] font-bold mb-3 flex items-center gap-2", isPrint ? "text-slate-900" : "text-[#66fcf1]")}>
                                <div className={cn("w-1 h-4", isPrint ? "bg-slate-800" : "bg-[#66fcf1]")}></div>
                                Abstract
                            </h2>
                            <p className="text-[12px] leading-relaxed">{summary}</p>
                        </section>
                    )}

                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section>
                            <h2 className={cn("text-sm uppercase tracking-[0.1em] font-bold mb-5 flex items-center gap-2", isPrint ? "text-slate-900" : "text-[#66fcf1]")}>
                                <div className={cn("w-1 h-4", isPrint ? "bg-slate-800" : "bg-[#66fcf1]")}></div>
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {workExperience.map(e => (
                                    <div key={e.id} className={cn("pl-4 border-l-2 relative", isPrint ? "border-slate-300" : "border-[#45a29e]")}>
                                        <div className={cn("absolute -left-[5px] top-1.5 w-2 h-2 rounded-full", isPrint ? "bg-slate-500" : "bg-[#66fcf1] shadow-[0_0_5px_#66fcf1]")}></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={cn("text-[14px] font-bold", isPrint ? "text-slate-900" : "text-white")}>{e.position}</h3>
                                            <span className={cn("text-[10px] font-mono", isPrint ? "text-slate-500" : "text-[#45a29e]")}>{e.startDate} - {e.current ? "Present" : e.endDate}</span>
                                        </div>
                                        <div className="text-[12px] mb-2 opacity-80">{e.company}</div>
                                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 space-y-8">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section className={cn("p-5 rounded-lg border", isPrint ? "border-slate-200 bg-slate-50" : "border-[#1f2833] bg-[#1f2833]/40 backdrop-blur-sm")}>
                            <h2 className={cn("text-sm uppercase tracking-[0.1em] font-bold mb-4 flex items-center gap-2", isPrint ? "text-slate-900" : "text-[#66fcf1]")}>
                                <div className={cn("w-1 h-4", isPrint ? "bg-slate-800" : "bg-[#66fcf1]")}></div>
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s, i) => (
                                    <span key={i} className={cn("text-[10px] uppercase px-2 py-1 rounded border", isPrint ? "bg-white border-slate-300 text-slate-700" : "bg-transparent border-[#45a29e] text-[#c5c6c7]")}>
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <h2 className={cn("text-sm uppercase tracking-[0.1em] font-bold mb-4 flex items-center gap-2", isPrint ? "text-slate-900" : "text-[#66fcf1]")}>
                                <div className={cn("w-1 h-4", isPrint ? "bg-slate-800" : "bg-[#66fcf1]")}></div>
                                Ed.
                            </h2>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id} className={cn("p-4 rounded border", isPrint ? "border-slate-200" : "border-[#1f2833]")}>
                                        <div className={cn("text-[12px] font-bold mb-1", isPrint ? "text-slate-900" : "text-white")}>{e.degree}</div>
                                        <div className="text-[11px] opacity-80">{e.school}</div>
                                        <div className={cn("text-[10px] mt-2 font-mono", isPrint ? "text-slate-500" : "text-[#45a29e]")}>{e.startDate} - {e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
