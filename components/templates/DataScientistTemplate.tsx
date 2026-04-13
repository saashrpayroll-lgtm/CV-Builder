import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function DataScientistTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, sectionVisibility } = data;

    return (
        <div className={cn("mx-auto bg-white text-slate-800 border-8 border-slate-100", isPrint && "print-area border-none")} 
             style={{ fontFamily: "'Fira Code', 'Roboto Mono', monospace", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px" }}>
            
            <header className="mb-8 border-b-2 border-dashed border-slate-300 pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{personalInfo.fullName}</h1>
                        <p className="text-lg bg-slate-900 text-white inline-block px-2 py-1 mt-2">{personalInfo.jobTitle}</p>
                    </div>
                    <div className="text-right text-[11px] space-y-1">
                        {personalInfo.email && <div><span className="text-slate-400">email:</span> {personalInfo.email}</div>}
                        {personalInfo.phone && <div><span className="text-slate-400">phone:</span> {personalInfo.phone}</div>}
                        {personalInfo.github && <div><span className="text-slate-400">github:</span> {personalInfo.github}</div>}
                    </div>
                </div>
            </header>

            {sectionVisibility?.summary && summary && (
                <section className="mb-6">
                    <h2 className="text-[12px] font-bold text-slate-400 uppercase mb-2">{'// Summary'}</h2>
                    <p className="text-[12px] leading-relaxed text-slate-700 bg-slate-50 p-4 border-l-4 border-slate-900">{summary}</p>
                </section>
            )}

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[12px] font-bold text-slate-400 uppercase mb-4">{'// Experience'}</h2>
                            <div className="space-y-6">
                                {workExperience.map(e => (
                                    <div key={e.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-[14px] font-bold text-slate-900">
                                                {e.position} <span className="text-slate-400 font-normal">@ {e.company}</span>
                                            </h3>
                                        </div>
                                        <div className="text-[10px] bg-slate-200 text-slate-700 inline-block px-1.5 py-0.5 rounded mb-2">
                                            {e.startDate} - {e.current ? "Present" : e.endDate}
                                        </div>
                                        <div className="text-[11px] leading-relaxed text-slate-600 space-y-1 whitespace-pre-wrap pl-3 border-l px-2 border-slate-200">
                                            {e.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.projects && projects?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-[12px] font-bold text-slate-400 uppercase mb-4">{'// Projects'}</h2>
                            <div className="space-y-4">
                                {projects.map(p => (
                                    <div key={p.id} className="border border-slate-200 p-3 rounded">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-[12px] text-slate-900">{p.name}</span>
                                        </div>
                                        {p.technologies?.length > 0 && (
                                            <div className="text-[10px] text-slate-500 mt-1 mb-2">
                                                Stack: [{p.technologies.join(", ")}]
                                            </div>
                                        )}
                                        <p className="text-[11px] text-slate-600 leading-relaxed">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 space-y-6">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold text-slate-400 uppercase mb-3">{'// Skills_Matrix'}</h2>
                            <div className="flex flex-col gap-1.5 font-bold">
                                {skills.map(s => (
                                    <div key={s.id} className="text-[11px] text-slate-700 bg-slate-100 p-1.5 border border-slate-200">
                                        {">"} {s.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-bold text-slate-400 uppercase mb-3">{'// Education'}</h2>
                            <div className="space-y-3">
                                {education.map(e => (
                                    <div key={e.id} className="bg-slate-50 p-2 border border-slate-200">
                                        <div className="text-[12px] font-bold text-slate-900">{e.degree}</div>
                                        <div className="text-[11px] text-slate-600">{e.fieldOfStudy}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">{e.school}</div>
                                        <div className="text-[10px] bg-slate-200 inline-block px-1 mt-1">{e.startDate}-{e.endDate}</div>
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
