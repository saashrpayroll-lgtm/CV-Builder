import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function CompactTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    const c = theme?.accentColor || '#6366f1';
    
    // Scale everything down to fit massive amounts of data
    const fs = theme?.fontSize === 'small' ? 0.8 : theme?.fontSize === 'large' ? 1.0 : 0.9;
    const spacing = theme?.viewMode === 'compact' ? 'py-4 px-4' : theme?.viewMode === 'comfortable' ? 'py-8 px-8' : 'py-6 px-6';

    return (
        <div className={cn("bg-white mx-auto text-gray-900 border-t-8", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Inter', sans-serif", borderColor: c, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-4 text-center">
                <h1 className="font-black uppercase tracking-tight leading-none mb-1" style={{ fontSize: `${28 * fs}px` }}>{personalInfo.fullName}</h1>
                <h2 className="font-bold text-gray-500 tracking-widest uppercase mb-2" style={{ fontSize: `${11 * fs}px` }}>{personalInfo.jobTitle}</h2>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-medium text-gray-600" style={{ fontSize: `${10 * fs}px` }}>
                    {personalInfo.email && <div>{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                    {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
                </div>
            </header>

            {summary && (
                <p className="text-center italic text-gray-700 max-w-4xl mx-auto mb-5" style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.5 }}>
                    {summary}
                </p>
            )}

            <div className="grid grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div>
                    {workExperience?.length > 0 && (
                        <section className="mb-5">
                            <h3 className="font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ fontSize: `${11 * fs}px`, borderColor: c, color: c }}>Experience</h3>
                            <div className="space-y-4">
                                {workExperience.map(e => (
                                    <div key={e.id}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <div className="font-bold text-gray-900" style={{ fontSize: `${11.5 * fs}px` }}>{e.position}</div>
                                            <div className="font-medium text-gray-500 whitespace-nowrap" style={{ fontSize: `${9.5 * fs}px` }}>{e.startDate} - {e.current ? 'Present' : e.endDate}</div>
                                        </div>
                                        <div className="font-semibold text-gray-600 mb-1.5" style={{ fontSize: `${10.5 * fs}px` }}>{e.company}</div>
                                        <p className="text-gray-700" style={{ fontSize: `${10 * fs}px`, lineHeight: 1.4 }}>{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div>
                    {education?.length > 0 && (
                        <section className="mb-5">
                            <h3 className="font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ fontSize: `${11 * fs}px`, borderColor: c, color: c }}>Education</h3>
                            <div className="space-y-3">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <div className="font-bold text-gray-900" style={{ fontSize: `${11.5 * fs}px` }}>{e.school}</div>
                                            <div className="font-medium text-gray-500" style={{ fontSize: `${9.5 * fs}px` }}>{e.endDate}</div>
                                        </div>
                                        <div className="text-gray-700" style={{ fontSize: `${10.5 * fs}px` }}>{e.degree} in {e.fieldOfStudy}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section className="mb-5">
                            <h3 className="font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ fontSize: `${11 * fs}px`, borderColor: c, color: c }}>Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map(s => (
                                    <span key={s.id} className="bg-gray-100 text-gray-800 px-2 py-0.5 font-medium rounded-sm" style={{ fontSize: `${9.5 * fs}px` }}>
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section className="mb-5">
                            <h3 className="font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ fontSize: `${11 * fs}px`, borderColor: c, color: c }}>Projects</h3>
                            <div className="space-y-3">
                                {projects.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-gray-900 mb-0.5" style={{ fontSize: `${11.5 * fs}px` }}>{p.name}</div>
                                        <div className="text-gray-500 font-medium mb-1" style={{ fontSize: `${9.5 * fs}px` }}>{p.technologies.join(', ')}</div>
                                        <p className="text-gray-700" style={{ fontSize: `${10 * fs}px`, lineHeight: 1.4 }}>{p.description}</p>
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
