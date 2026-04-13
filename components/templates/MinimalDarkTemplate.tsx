import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function MinimalDarkTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility, theme } = data;
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif" };

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-white text-slate-900" : "bg-[#111] text-[#eee]")} 
             style={{ fontFamily: fontMap[theme?.font] || "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px" }}>
            
            <header className="flex justify-between items-end mb-10 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-light tracking-tight">{personalInfo.fullName}</h1>
                    <p className="text-sm opacity-60 mt-2">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-[10px] opacity-60 space-y-1">
                    <div>{personalInfo.email}</div>
                    <div>{personalInfo.phone}</div>
                    <div>{personalInfo.location}</div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3 space-y-8 border-r border-[#333] pr-6">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section>
                            <h2 className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Skills</h2>
                            <ul className="space-y-1">
                                {skills.map(s => <li key={s.id} className="text-[11px]">{s.name}</li>)}
                            </ul>
                        </section>
                    )}
                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <h2 className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Education</h2>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <div className="text-[11px] font-medium">{e.degree}</div>
                                        <div className="text-[10px] opacity-60">{e.school}</div>
                                        <div className="text-[9px] opacity-40">{e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-9 space-y-8">
                    {sectionVisibility?.summary && summary && (
                        <section>
                            <h2 className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Profile</h2>
                            <p className="text-[12px] leading-relaxed opacity-80">{summary}</p>
                        </section>
                    )}

                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section>
                            <h2 className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Experience</h2>
                            <div className="space-y-6">
                                {workExperience.map(e => (
                                    <div key={e.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-[13px] font-medium">{e.position} <span className="opacity-40 font-normal">at {e.company}</span></h3>
                                            <span className="text-[10px] opacity-40">{e.startDate} — {e.current ? "Present" : e.endDate}</span>
                                        </div>
                                        <p className="text-[11px] leading-relaxed opacity-70 whitespace-pre-wrap">{e.description}</p>
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
