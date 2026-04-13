import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function HackerTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, theme } = data;
    const c = theme?.accentColor || '#10b981'; // Default matrix green
    
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'p-6' : theme?.viewMode === 'comfortable' ? 'p-12' : 'p-8';

    return (
        <div className={cn("bg-[#0d1117] mx-auto text-[#c9d1d9]", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Fira Code', 'Courier New', monospace", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-6 border-b border-gray-700 pb-4">
                <div className="font-bold mb-2" style={{ fontSize: `${20 * fs}px`, color: c }}>
                    <span className="text-gray-500 mr-2">~/$</span> 
                    whoami
                </div>
                <h1 className="font-bold mb-1" style={{ fontSize: `${16 * fs}px` }}>{personalInfo.fullName}</h1>
                <div className="text-gray-400 mb-2" style={{ fontSize: `${12 * fs}px` }}>{personalInfo.jobTitle}</div>
                <div className="flex flex-col gap-1 text-gray-500" style={{ fontSize: `${10 * fs}px` }}>
                    {personalInfo.email && <div>email: <span className="text-[#8b949e]">{personalInfo.email}</span></div>}
                    {personalInfo.github && <div>github: <span className="text-[#8b949e]">{personalInfo.github}</span></div>}
                    {personalInfo.linkedin && <div>linkedin: <span className="text-[#8b949e]">{personalInfo.linkedin}</span></div>}
                    {personalInfo.website && <div>website: <span className="text-[#8b949e]">{personalInfo.website}</span></div>}
                </div>
            </header>

            {summary && (
                <section className="mb-6">
                    <div className="font-bold mb-2" style={{ fontSize: `${14 * fs}px`, color: c }}>
                        <span className="text-gray-500 mr-2">~/$</span> 
                        cat readme.md
                    </div>
                    <div className="text-[#8b949e] leading-relaxed" style={{ fontSize: `${11 * fs}px` }}>
                        {summary}
                    </div>
                </section>
            )}

            {skills?.length > 0 && (
                <section className="mb-6">
                    <div className="font-bold mb-2" style={{ fontSize: `${14 * fs}px`, color: c }}>
                        <span className="text-gray-500 mr-2">~/$</span> 
                        ls -la ./skills
                    </div>
                    <div className="grid grid-cols-3 gap-2" style={{ fontSize: `${11 * fs}px` }}>
                        {skills.map(s => (
                            <div key={s.id} className="text-[#8b949e]">-rwxr-xr-x <span className="text-white ml-2">{s.name}</span></div>
                        ))}
                    </div>
                </section>
            )}

            {workExperience?.length > 0 && (
                <section className="mb-6">
                    <div className="font-bold mb-4" style={{ fontSize: `${14 * fs}px`, color: c }}>
                        <span className="text-gray-500 mr-2">~/$</span> 
                        git log --experience
                    </div>
                    <div className="space-y-6 border-l border-gray-800 ml-2 pl-4">
                        {workExperience.map(e => (
                            <div key={e.id} className="relative">
                                <div className="absolute -left-[21px] top-1.5 text-gray-600" style={{ fontSize: `${10 * fs}px` }}>*</div>
                                <div className="text-gray-500 mb-1" style={{ fontSize: `${10 * fs}px` }}>
                                    commit {e.id.substring(0, 7)}<br/>
                                    Date: {e.startDate} - {e.current ? 'HEAD' : e.endDate}
                                </div>
                                <div className="font-bold text-[#e6edf3]" style={{ fontSize: `${12 * fs}px` }}>{e.position} <span style={{ color: c }}>@ {e.company}</span></div>
                                <p className="mt-2 text-[#8b949e] whitespace-pre-wrap whitespace-normal" style={{ fontSize: `${11 * fs}px`, lineHeight: 1.5 }}>
                                    {e.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {projects?.length > 0 && (
                <section className="mb-6">
                    <div className="font-bold mb-4" style={{ fontSize: `${14 * fs}px`, color: c }}>
                        <span className="text-gray-500 mr-2">~/$</span> 
                        docker ps -a
                    </div>
                    <div className="space-y-4">
                        {projects.map(p => (
                            <div key={p.id} className="border border-gray-800 p-3 bg-[#161b22]">
                                <div className="font-bold text-[#e6edf3] mb-1" style={{ fontSize: `${12 * fs}px` }}>
                                    {p.name}
                                </div>
                                <div className="text-gray-500 mb-2" style={{ fontSize: `${10 * fs}px` }}>
                                    PORTS: {p.technologies.join(', ')}
                                </div>
                                <div className="text-[#8b949e]" style={{ fontSize: `${11 * fs}px` }}>
                                    {p.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
