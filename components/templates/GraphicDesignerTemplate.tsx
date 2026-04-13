import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function GraphicDesignerTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, theme } = data;
    const c = theme?.accentColor || '#f59e0b'; // Amber
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'p-8' : theme?.viewMode === 'comfortable' ? 'p-14' : 'p-10';

    return (
        <div className={cn("bg-zinc-900 mx-auto text-zinc-300", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Space Grotesk', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="col-span-5 relative z-10">
                    <div className="sticky top-0">
                        {personalInfo.photo && (
                            <img src={personalInfo.photo} className="w-32 h-32 rounded-full object-cover border-4 mb-6 shadow-xl" style={{ borderColor: c }} alt="Profile" />
                        )}
                        <h1 className="font-extrabold uppercase leading-none text-white mb-2" style={{ fontSize: `${48 * fs}px`, letterSpacing: '-0.05em' }}>
                            {personalInfo.fullName?.split(' ')[0]}<br/>
                            <span style={{ color: c }}>{personalInfo.fullName?.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="font-bold tracking-widest uppercase text-zinc-400 mb-8" style={{ fontSize: `${11 * fs}px` }}>{personalInfo.jobTitle}</p>
                        
                        <div className="space-y-4 mb-10 text-zinc-400" style={{ fontSize: `${11 * fs}px` }}>
                            {personalInfo.email && <div className="flex items-center gap-3"><div className="w-6 h-px" style={{backgroundColor:c}}></div>{personalInfo.email}</div>}
                            {personalInfo.phone && <div className="flex items-center gap-3"><div className="w-6 h-px" style={{backgroundColor:c}}></div>{personalInfo.phone}</div>}
                            {personalInfo.website && <div className="flex items-center gap-3"><div className="w-6 h-px" style={{backgroundColor:c}}></div>{personalInfo.website}</div>}
                            {personalInfo.location && <div className="flex items-center gap-3"><div className="w-6 h-px" style={{backgroundColor:c}}></div>{personalInfo.location}</div>}
                        </div>

                        {skills?.length > 0 && (
                            <div>
                                <h2 className="text-white font-bold uppercase tracking-widest mb-4" style={{ fontSize: `${13 * fs}px` }}>Expertise</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(s => (
                                        <span key={s.id} className="px-3 py-1 bg-white/10 text-white rounded-full" style={{ fontSize: `${10 * fs}px` }}>{s.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-7">
                    {summary && (
                        <div className="mb-10 text-zinc-400 leading-relaxed font-medium" style={{ fontSize: `${13 * fs}px` }}>
                            {summary}
                        </div>
                    )}

                    {workExperience?.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-white font-extrabold uppercase tracking-widest mb-6 border-b pb-2" style={{ fontSize: `${18 * fs}px`, borderColor: c }}>Experience</h2>
                            <div className="space-y-8">
                                {workExperience.map(e => (
                                    <div key={e.id}>
                                        <div className="flex items-end justify-between mb-2">
                                            <h3 className="font-bold text-white leading-none" style={{ fontSize: `${16 * fs}px` }}>{e.position}</h3>
                                            <span className="font-mono text-zinc-500" style={{ fontSize: `${10 * fs}px` }}>{e.startDate} — {e.current ? 'NOW' : e.endDate}</span>
                                        </div>
                                        <div className="font-bold mb-3 uppercase tracking-wider" style={{ fontSize: `${10 * fs}px`, color: c }}>{e.company}</div>
                                        <p className="text-zinc-400 leading-relaxed" style={{ fontSize: `${11 * fs}px` }}>{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education?.length > 0 && (
                        <div>
                            <h2 className="text-white font-extrabold uppercase tracking-widest mb-6 border-b pb-2" style={{ fontSize: `${18 * fs}px`, borderColor: c }}>Education</h2>
                            <div className="space-y-6">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-white" style={{ fontSize: `${14 * fs}px` }}>{e.school}</h3>
                                            <span className="font-mono text-zinc-500" style={{ fontSize: `${10 * fs}px` }}>{e.endDate}</span>
                                        </div>
                                        <div className="text-zinc-400" style={{ fontSize: `${12 * fs}px` }}>{e.degree} in {e.fieldOfStudy}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}
