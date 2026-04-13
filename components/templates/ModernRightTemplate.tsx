import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ModernRightTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    const c = theme?.accentColor || '#3b82f6';
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'p-0' : theme?.viewMode === 'comfortable' ? 'p-0' : 'p-0'; // Outer div handles grid

    return (
        <div className={cn("bg-white mx-auto text-gray-800 grid grid-cols-12", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            {/* LEFT MAIN CONTENT */}
            <div className="col-span-8 p-10 pt-16 space-y-10">
                {summary && (
                    <section>
                        <h2 className="uppercase font-bold tracking-widest text-gray-400 mb-4" style={{ fontSize: `${11 * fs}px` }}>Profile</h2>
                        <div className="font-medium text-gray-700 leading-relaxed" style={{ fontSize: `${11.5 * fs}px` }}>
                            {summary}
                        </div>
                    </section>
                )}

                {workExperience?.length > 0 && (
                    <section>
                        <h2 className="uppercase font-bold tracking-widest text-gray-400 mb-6" style={{ fontSize: `${11 * fs}px` }}>Experience</h2>
                        <div className="space-y-6">
                            {workExperience.map(e => (
                                <div key={e.id}>
                                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: `${14 * fs}px` }}>{e.position}</h3>
                                    <div className="flex items-center gap-2 mb-3" style={{ fontSize: `${11 * fs}px` }}>
                                        <span className="font-bold" style={{ color: c }}>{e.company}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-gray-500 font-medium">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${10.5 * fs}px` }}>{e.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects?.length > 0 && (
                    <section>
                        <h2 className="uppercase font-bold tracking-widest text-gray-400 mb-6" style={{ fontSize: `${11 * fs}px` }}>Projects</h2>
                        <div className="space-y-6">
                            {projects.map(p => (
                                <div key={p.id}>
                                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: `${12 * fs}px` }}>{p.name}</h3>
                                    <div className="font-medium text-gray-500 mb-2" style={{ fontSize: `${10 * fs}px` }}>{p.technologies.join(', ')}</div>
                                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${10.5 * fs}px` }}>{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="col-span-4 bg-slate-50 border-l border-gray-100 p-8 pt-16 space-y-10">
                
                {/* Header built into sidebar */}
                <div>
                    {personalInfo.photo && (
                        <img src={personalInfo.photo} className="w-24 h-24 rounded-full object-cover mb-6 shadow-md" alt="" />
                    )}
                    <h1 className="font-black uppercase leading-tight mb-2 text-gray-900" style={{ fontSize: `${28 * fs}px` }}>{personalInfo.fullName}</h1>
                    <p className="font-bold tracking-widest text-gray-500 uppercase mb-6" style={{ fontSize: `${10 * fs}px`, color: c }}>{personalInfo.jobTitle}</p>
                    
                    <div className="space-y-3 font-medium text-gray-600" style={{ fontSize: `${10 * fs}px` }}>
                        {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
                        {personalInfo.phone && <div>{personalInfo.phone}</div>}
                        {personalInfo.location && <div>{personalInfo.location}</div>}
                        {personalInfo.linkedin && <div className="break-all">{personalInfo.linkedin}</div>}
                    </div>
                </div>

                {education?.length > 0 && (
                    <section>
                        <h2 className="uppercase font-bold tracking-widest text-gray-400 mb-4" style={{ fontSize: `${10 * fs}px` }}>Education</h2>
                        <div className="space-y-4">
                            {education.map(e => (
                                <div key={e.id}>
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: `${11 * fs}px` }}>{e.degree}</h3>
                                    <div className="text-gray-500" style={{ fontSize: `${10 * fs}px` }}>{e.school}</div>
                                    <div className="text-gray-400 mt-1" style={{ fontSize: `${9 * fs}px` }}>{e.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {skills?.length > 0 && (
                    <section>
                        <h2 className="uppercase font-bold tracking-widest text-gray-400 mb-4" style={{ fontSize: `${10 * fs}px` }}>Skills</h2>
                        <div className="flex flex-col gap-2">
                            {skills.map(s => (
                                <div key={s.id} className="bg-white border border-gray-200 px-3 py-2 rounded-lg font-medium text-gray-700 shadow-sm" style={{ fontSize: `${10 * fs}px` }}>
                                    {s.name}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            
        </div>
    );
}
