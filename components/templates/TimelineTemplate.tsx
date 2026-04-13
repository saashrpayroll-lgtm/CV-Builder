import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function TimelineTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, theme } = data;
    const c = theme?.accentColor || '#0ea5e9';
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-6 px-8' : theme?.viewMode === 'comfortable' ? 'py-12 px-12' : 'py-8 px-10';

    return (
        <div className={cn("bg-white mx-auto text-gray-800", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-8 flex flex-col items-center border-b pb-6" style={{ borderColor: c }}>
                <h1 className="font-extrabold uppercase tracking-wider mb-2" style={{ fontSize: `${32 * fs}px`, color: c }}>{personalInfo.fullName}</h1>
                <p className="font-bold text-gray-600 tracking-widest mb-3" style={{ fontSize: `${12 * fs}px` }}>{personalInfo.jobTitle}</p>
                <div className="flex gap-4 text-gray-500 font-medium" style={{ fontSize: `${10 * fs}px` }}>
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </header>

            {summary && (
                <div className="mb-8 text-center max-w-2xl mx-auto" style={{ fontSize: `${11.5 * fs}px`, lineHeight: 1.6 }}>
                    {summary}
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    {workExperience?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="uppercase font-bold tracking-widest mb-6 flex items-center gap-3" style={{ fontSize: `${14 * fs}px`, color: c }}>
                                <span className="w-8 h-px bg-current"></span> Experience
                            </h2>
                            <div className="ml-4 border-l-2 border-gray-200 pl-6 space-y-6">
                                {workExperience.map(e => (
                                    <div key={e.id} className="relative">
                                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                                        <div className="font-bold text-gray-500 mb-1" style={{ fontSize: `${10 * fs}px` }}>{e.startDate} - {e.current ? 'Present' : e.endDate}</div>
                                        <h3 className="font-bold" style={{ fontSize: `${13 * fs}px` }}>{e.position}</h3>
                                        <div className="font-medium text-gray-600 mb-2" style={{ fontSize: `${11 * fs}px` }}>{e.company}</div>
                                        <p style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.5 }}>{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-4 space-y-8">
                    {education?.length > 0 && (
                        <div>
                            <h2 className="uppercase font-bold tracking-widest mb-4 flex items-center gap-3" style={{ fontSize: `${12 * fs}px`, color: c }}>
                                <span className="w-4 h-px bg-current"></span> Education
                            </h2>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <h3 className="font-bold leading-tight" style={{ fontSize: `${11 * fs}px` }}>{e.degree}</h3>
                                        <div className="text-gray-500 mb-1" style={{ fontSize: `${10 * fs}px` }}>{e.school}</div>
                                        <div className="text-gray-400 font-medium" style={{ fontSize: `${9 * fs}px` }}>{e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills?.length > 0 && (
                        <div>
                            <h2 className="uppercase font-bold tracking-widest mb-4 flex items-center gap-3" style={{ fontSize: `${12 * fs}px`, color: c }}>
                                <span className="w-4 h-px bg-current"></span> Skills
                            </h2>
                            <div className="flex flex-col gap-3">
                                {skills.map(s => (
                                    <div key={s.id}>
                                        <div className="flex justify-between mb-1" style={{ fontSize: `${10 * fs}px` }}>
                                            <span className="font-bold">{s.name}</span>
                                        </div>
                                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${s.percentage || 70}%`, backgroundColor: c }} />
                                        </div>
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
