import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function FAANGTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-4 px-6' : theme?.viewMode === 'comfortable' ? 'py-10 px-12' : 'py-8 px-10';

    return (
        <div className={cn("bg-white mx-auto text-black", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-4 text-center">
                <h1 className="font-bold mb-1" style={{ fontSize: `${22 * fs}px` }}>{personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-2 items-center text-gray-800" style={{ fontSize: `${10.5 * fs}px` }}>
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.location && (personalInfo.phone || personalInfo.email) && <span>|</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.phone && personalInfo.email && <span>|</span>}
                    {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a>}
                    {personalInfo.linkedin && (
                        <><span>|</span><a href={personalInfo.linkedin} className="text-blue-600 underline">LinkedIn</a></>
                    )}
                    {personalInfo.github && (
                        <><span>|</span><a href={personalInfo.github} className="text-blue-600 underline">GitHub</a></>
                    )}
                    {personalInfo.website && (
                        <><span>|</span><a href={personalInfo.website} className="text-blue-600 underline">Portfolio</a></>
                    )}
                </div>
            </header>

            {education?.length > 0 && (
                <section className="mb-4">
                    <h2 className="uppercase font-bold border-b border-black mb-2" style={{ fontSize: `${12 * fs}px` }}>Education</h2>
                    {education.map(e => (
                        <div key={e.id} className="mb-2">
                            <div className="flex justify-between font-bold" style={{ fontSize: `${11 * fs}px` }}>
                                <span>{e.school}</span>
                                <span>{e.startDate} - {e.endDate}</span>
                            </div>
                            <div className="flex justify-between" style={{ fontSize: `${11 * fs}px` }}>
                                <span>{e.degree} in {e.fieldOfStudy}</span>
                                {e.grade && <span>GPA: {e.grade}</span>}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {workExperience?.length > 0 && (
                <section className="mb-4">
                    <h2 className="uppercase font-bold border-b border-black mb-2" style={{ fontSize: `${12 * fs}px` }}>Experience</h2>
                    {workExperience.map(e => (
                        <div key={e.id} className="mb-3">
                            <div className="flex justify-between font-bold" style={{ fontSize: `${11 * fs}px` }}>
                                <span>{e.position}</span>
                                <span>{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
                            </div>
                            <div className="italic mb-1" style={{ fontSize: `${11 * fs}px` }}>{e.company}{e.location && `, ${e.location}`}</div>
                            <ul className="list-disc pl-5 m-0" style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.4 }}>
                                {e.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                    <li key={i} className="mb-0.5">{line.replace(/^[-•]\s*/, '')}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {projects?.length > 0 && (
                <section className="mb-4">
                    <h2 className="uppercase font-bold border-b border-black mb-2" style={{ fontSize: `${12 * fs}px` }}>Projects</h2>
                    {projects.map(p => (
                        <div key={p.id} className="mb-2">
                            <div className="font-bold flex items-center gap-2" style={{ fontSize: `${11 * fs}px` }}>
                                {p.name} 
                                <span className="font-normal italic text-gray-600">| {p.technologies.join(', ')}</span>
                            </div>
                            <ul className="list-disc pl-5 m-0 mt-0.5" style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.4 }}>
                                {p.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                    <li key={i} className="mb-0.5">{line.replace(/^[-•]\s*/, '')}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {skills?.length > 0 && (
                <section className="mb-4">
                    <h2 className="uppercase font-bold border-b border-black mb-2" style={{ fontSize: `${12 * fs}px` }}>Technical Skills</h2>
                    <div style={{ fontSize: `${10.5 * fs}px` }}>
                        <span className="font-bold">Languages/Tools: </span>
                        {skills.map(s => s.name).join(', ')}
                    </div>
                </section>
            )}
        </div>
    );
}
