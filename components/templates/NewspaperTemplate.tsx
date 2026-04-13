import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function NewspaperTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, theme } = data;
    const c = theme?.accentColor || '#1c1917'; // Stone 900
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-6 px-10' : theme?.viewMode === 'comfortable' ? 'py-12 px-16' : 'py-10 px-12';

    return (
        <div className={cn("bg-[#fafaf9] mx-auto text-[#292524]", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Playfair Display', serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="text-center mb-8 pb-6 border-b-4 border-double border-[#292524]">
                <h1 className="font-black uppercase tracking-tighter mb-2" style={{ fontSize: `${48 * fs}px`, color: c }}>{personalInfo.fullName}</h1>
                <p className="font-bold italic uppercase tracking-widest" style={{ fontSize: `${12 * fs}px` }}>{personalInfo.jobTitle}</p>
                <div className="flex justify-center gap-6 mt-4 font-sans uppercase tracking-widest text-gray-500" style={{ fontSize: `${9 * fs}px` }}>
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* main content */}
                <div className="col-span-8">
                    {summary && (
                        <p className="text-justify mb-8 leading-relaxed font-medium drop-cap" style={{ fontSize: `${12 * fs}px` }}>
                            {summary}
                        </p>
                    )}

                    {workExperience?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-black uppercase tracking-widest border-b border-gray-400 mb-6 pb-2" style={{ fontSize: `${16 * fs}px` }}>Professional Experience</h2>
                            <div className="space-y-8">
                                {workExperience.map(e => (
                                    <div key={e.id}>
                                        <h3 className="font-bold mb-1" style={{ fontSize: `${14 * fs}px` }}>{e.position}</h3>
                                        <div className="font-sans font-bold text-gray-500 uppercase tracking-wider mb-3" style={{ fontSize: `${9 * fs}px` }}>
                                            {e.company} / {e.startDate} - {e.current ? 'PRESENT' : e.endDate}
                                        </div>
                                        <p className="text-justify leading-relaxed" style={{ fontSize: `${11 * fs}px` }}>
                                            {e.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* sidebar content */}
                <div className="col-span-4 border-l border-gray-300 pl-8">
                    {education?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-black uppercase tracking-widest border-b border-gray-400 mb-4 pb-2" style={{ fontSize: `${12 * fs}px` }}>Education</h2>
                            <div className="space-y-5">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <h3 className="font-bold drop-shadow-sm mb-1" style={{ fontSize: `${11 * fs}px` }}>{e.school}</h3>
                                        <div className="italic text-gray-600 mb-1" style={{ fontSize: `${10 * fs}px` }}>{e.degree} in {e.fieldOfStudy}</div>
                                        <div className="font-sans font-bold text-gray-400 uppercase tracking-wider" style={{ fontSize: `${8 * fs}px` }}>Class of {e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills?.length > 0 && (
                        <div>
                            <h2 className="font-black uppercase tracking-widest border-b border-gray-400 mb-4 pb-2" style={{ fontSize: `${12 * fs}px` }}>Core Skills</h2>
                            <ul className="space-y-2 list-none m-0 p-0 font-sans font-medium uppercase tracking-wider text-gray-600" style={{ fontSize: `${9 * fs}px` }}>
                                {skills.map(s => (
                                    <li key={s.id} className="border-b border-dotted border-gray-300 pb-1 flex justify-between">
                                        <span>{s.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}
