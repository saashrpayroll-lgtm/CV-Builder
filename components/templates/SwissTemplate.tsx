import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function SwissTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    const c = theme?.accentColor || '#e60000'; // Classic Swiss Red

    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-6 px-8' : theme?.viewMode === 'comfortable' ? 'py-12 px-14' : 'py-10 px-12';

    return (
        <div className={cn("bg-[#f4f4f0] mx-auto text-black tracking-tight", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-12 grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    {personalInfo.photo && (
                        <div className="w-full aspect-[3/4] mb-4 bg-gray-300">
                            <img src={personalInfo.photo} className="w-full h-full object-cover grayscale mix-blend-multiply" alt="" />
                        </div>
                    )}
                    <div className="w-12 h-2 mb-4" style={{ backgroundColor: c }} />
                    <h1 className="font-black uppercase leading-none" style={{ fontSize: `${42 * fs}px` }}>{personalInfo.fullName?.split(' ')[0]}<br/>{personalInfo.fullName?.split(' ').slice(1).join(' ')}</h1>
                </div>
                <div className="col-span-8 flex flex-col justify-end">
                    <p className="font-bold text-gray-500 uppercase tracking-widest mb-4" style={{ fontSize: `${12 * fs}px` }}>{personalInfo.jobTitle}</p>
                    <div className="grid grid-cols-2 gap-2 text-gray-800 font-medium" style={{ fontSize: `${10.5 * fs}px` }}>
                        {personalInfo.email && <div>{personalInfo.email}</div>}
                        {personalInfo.phone && <div>{personalInfo.phone}</div>}
                        {personalInfo.location && <div>{personalInfo.location}</div>}
                        {personalInfo.website && <div>{personalInfo.website}</div>}
                    </div>
                </div>
            </header>

            {summary && (
                <div className="grid grid-cols-12 gap-4 mb-8">
                    <div className="col-span-4 font-bold uppercase tracking-widest text-gray-400" style={{ fontSize: `${10 * fs}px` }}>Profile</div>
                    <div className="col-span-8 font-medium leading-relaxed" style={{ fontSize: `${12 * fs}px` }}>{summary}</div>
                </div>
            )}

            {workExperience?.length > 0 && (
                <div className="grid grid-cols-12 gap-4 mb-8">
                    <div className="col-span-4 font-bold uppercase tracking-widest" style={{ fontSize: `${10 * fs}px`, color: c }}>Experience</div>
                    <div className="col-span-8 space-y-6">
                        {workExperience.map(e => (
                            <div key={e.id} className="relative">
                                <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold uppercase" style={{ fontSize: `${12 * fs}px` }}>{e.company}</h3>
                                    <span className="font-medium text-gray-400" style={{ fontSize: `${10 * fs}px` }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                                </div>
                                <div className="font-medium mb-2 text-gray-600" style={{ fontSize: `${11 * fs}px` }}>{e.position} {e.location && `| ${e.location}`}</div>
                                <p className="leading-relaxed" style={{ fontSize: `${10.5 * fs}px` }}>{e.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {education?.length > 0 && (
                <div className="grid grid-cols-12 gap-4 mb-8">
                    <div className="col-span-4 font-bold uppercase tracking-widest text-gray-400" style={{ fontSize: `${10 * fs}px` }}>Education</div>
                    <div className="col-span-8 space-y-4">
                        {education.map(e => (
                            <div key={e.id}>
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-bold uppercase" style={{ fontSize: `${11 * fs}px` }}>{e.school}</h3>
                                    <span className="text-gray-400" style={{ fontSize: `${10 * fs}px` }}>{e.endDate}</span>
                                </div>
                                <div className="font-medium text-gray-600" style={{ fontSize: `${11 * fs}px` }}>{e.degree} in {e.fieldOfStudy}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {skills?.length > 0 && (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4 font-bold uppercase tracking-widest text-gray-400" style={{ fontSize: `${10 * fs}px` }}>Skills</div>
                    <div className="col-span-8">
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span key={s.id} className="border border-black px-2 py-1 font-bold uppercase" style={{ fontSize: `${9 * fs}px` }}>{s.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
