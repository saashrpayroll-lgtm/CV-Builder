import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function StartupTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    const c = theme?.accentColor || '#8b5cf6'; // Violet 500
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-8 px-10' : theme?.viewMode === 'comfortable' ? 'py-14 px-16' : 'py-10 px-14';

    return (
        <div className={cn("bg-white mx-auto text-gray-900 border-t-[16px]", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Outfit', 'Inter', sans-serif", borderColor: c, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: `${36 * fs}px` }}>{personalInfo.fullName}</h1>
                    <h2 className="font-semibold text-gray-500" style={{ fontSize: `${14 * fs}px`, color: c }}>{personalInfo.jobTitle}</h2>
                </div>
                <div className="text-right font-medium text-gray-500 space-y-1" style={{ fontSize: `${10.5 * fs}px` }}>
                    {personalInfo.email && <div>{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.website && <div>{personalInfo.website}</div>}
                </div>
            </header>

            {summary && (
                <section className="mb-10">
                    <p className="text-xl font-medium leading-relaxed text-gray-800" style={{ fontSize: `${14 * fs}px` }}>
                        {summary}
                    </p>
                </section>
            )}

            {workExperience?.length > 0 && (
                <section className="mb-10">
                    <h3 className="uppercase font-bold tracking-widest text-gray-400 mb-6" style={{ fontSize: `${11 * fs}px` }}>Work Experience</h3>
                    <div className="space-y-8">
                        {workExperience.map(e => (
                            <div key={e.id} className="grid grid-cols-12 gap-6">
                                <div className="col-span-3">
                                    <div className="font-bold text-gray-900" style={{ fontSize: `${12 * fs}px` }}>{e.startDate}</div>
                                    <div className="font-medium text-gray-400 mb-1" style={{ fontSize: `${10 * fs}px` }}>to {e.current ? 'Present' : e.endDate}</div>
                                </div>
                                <div className="col-span-9">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <h4 className="font-bold text-gray-900" style={{ fontSize: `${16 * fs}px` }}>{e.position}</h4>
                                        <span className="text-gray-300">—</span>
                                        <span className="font-semibold" style={{ fontSize: `${14 * fs}px`, color: c }}>{e.company}</span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${11.5 * fs}px` }}>{e.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-10">
                {projects?.length > 0 && (
                    <section>
                        <h3 className="uppercase font-bold tracking-widest text-gray-400 mb-6" style={{ fontSize: `${11 * fs}px` }}>Key Projects</h3>
                        <div className="space-y-6">
                            {projects.map(p => (
                                <div key={p.id}>
                                    <h4 className="font-bold text-gray-900 mb-1" style={{ fontSize: `${14 * fs}px` }}>{p.name}</h4>
                                    <p className="text-gray-600 leading-relaxed mb-2" style={{ fontSize: `${11 * fs}px` }}>{p.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.technologies.map((t, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium" style={{ fontSize: `${9 * fs}px` }}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div>
                    {education?.length > 0 && (
                        <section className="mb-10">
                            <h3 className="uppercase font-bold tracking-widest text-gray-400 mb-6" style={{ fontSize: `${11 * fs}px` }}>Education</h3>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <h4 className="font-bold text-gray-900 mb-0.5" style={{ fontSize: `${13 * fs}px` }}>{e.school}</h4>
                                        <div className="text-gray-600" style={{ fontSize: `${11.5 * fs}px` }}>{e.degree}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section>
                            <h3 className="uppercase font-bold tracking-widest text-gray-400 mb-5" style={{ fontSize: `${11 * fs}px` }}>Core Capabilities</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                    <div key={s.id} className="border-2 rounded-lg px-3 py-1.5 font-bold" style={{ fontSize: `${11 * fs}px`, borderColor: `${c}30`, color: c }}>
                                        {s.name}
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
