import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function AcademicTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, publications, awards, customSections, references, coursework, sectionOrder, theme } = data;
    const c = theme?.accentColor || '#1e3a8a';
    
    // Convert fontSize to multipliers
    const fs = theme?.fontSize === 'small' ? 0.9 : theme?.fontSize === 'large' ? 1.1 : 1;
    const spacing = theme?.viewMode === 'compact' ? 'py-4 px-6' : theme?.viewMode === 'comfortable' ? 'py-10 px-12' : 'py-8 px-10';

    return (
        <div className={cn("bg-white mx-auto text-black", isPrint && "print-area", spacing)} 
             style={{ fontFamily: "'Merriweather', serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            <header className="mb-6 border-b-2 pb-4" style={{ borderColor: c }}>
                <h1 className="text-center font-bold tracking-tight uppercase" style={{ fontSize: `${24 * fs}px`, color: c }}>{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-center italic mt-1" style={{ fontSize: `${12 * fs}px` }}>{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap justify-center gap-3 mt-2 font-serif" style={{ fontSize: `${10 * fs}px` }}>
                    {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
                </div>
            </header>

            {/* Academic CVs prioritize Education and Publications */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>Education</h2>
                    <div className="space-y-4">
                        {education.map(e => (
                            <div key={e.id}>
                                <div className="flex justify-between font-bold" style={{ fontSize: `${12 * fs}px` }}>
                                    <span>{e.school}</span>
                                    <span>{e.startDate} - {e.endDate}</span>
                                </div>
                                <div className="font-semibold" style={{ fontSize: `${11 * fs}px` }}>{e.degree} in {e.fieldOfStudy}</div>
                                {e.grade && <div style={{ fontSize: `${10.5 * fs}px` }}>GPA: {e.grade}</div>}
                                {e.description && <p className="mt-1" style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.6 }}>{e.description}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {publications?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>Publications & Research</h2>
                    <div className="space-y-2">
                        {publications.map(p => (
                            <div key={p.id} className="pl-4" style={{ textIndent: '-1rem', fontSize: `${10.5 * fs}px`, lineHeight: 1.6 }}>
                                <strong>{personalInfo.fullName}</strong>. "{p.title}". <em>{p.publisher}</em>, {p.date}.
                                {p.description && <span className="block mt-0.5 text-gray-700">{p.description}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {workExperience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>Academic & Professional Experience</h2>
                    <div className="space-y-4">
                        {workExperience.map(e => (
                            <div key={e.id}>
                                <div className="flex justify-between font-bold" style={{ fontSize: `${12 * fs}px` }}>
                                    <span>{e.position}</span>
                                    <span>{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
                                </div>
                                <div className="italic" style={{ fontSize: `${11 * fs}px` }}>{e.company}{e.location && `, ${e.location}`}</div>
                                <p className="mt-1 whitespace-pre-wrap" style={{ fontSize: `${10.5 * fs}px`, lineHeight: 1.6 }}>{e.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {awards?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>Honors & Awards</h2>
                    <ul className="list-disc pl-5 space-y-1" style={{ fontSize: `${10.5 * fs}px` }}>
                        {awards.map(a => <li key={a.id}><strong>{a.title}</strong>, {a.issuer} ({a.date})</li>)}
                    </ul>
                </section>
            )}

            {coursework?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>Relevant Coursework</h2>
                    <ul className="list-disc pl-5 space-y-1" style={{ fontSize: `${10.5 * fs}px` }}>
                        {coursework.map(c => <li key={c.id}><strong>{c.course}</strong> — {c.institution} {c.skills && `(${c.skills})`}</li>)}
                    </ul>
                </section>
            )}

            {references?.length > 0 && (
                <section className="mb-6">
                    <h2 className="uppercase font-bold border-b border-gray-300 mb-3 pb-1 tracking-widest" style={{ fontSize: `${11 * fs}px`, color: c }}>References</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {references.map(r => (
                            <div key={r.id}>
                                <div className="font-bold" style={{ fontSize: `${11 * fs}px` }}>{r.name}</div>
                                <div style={{ fontSize: `${10.5 * fs}px` }}>{r.position}, {r.company}</div>
                                <div style={{ fontSize: `${10 * fs}px` }}>{r.email} {r.phone && `| ${r.phone}`}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
