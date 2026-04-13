import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ExecutiveSuiteTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility, theme } = data;

    return (
        <div className={cn("mx-auto bg-[#f9f9f9] text-[#2c3e50]", isPrint && "print-area")} 
             style={{ fontFamily: "'Playfair Display', serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "1in" }}>
            
            <header className="border-t-4 border-b-4 border-[#2c3e50] py-8 text-center mb-8 relative">
                <div className="absolute top-1 bottom-1 left-0 right-0 border-t border-b border-[#2c3e50] opacity-30"></div>
                
                <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-[#1a252f] mb-3 relative z-10">{personalInfo.fullName}</h1>
                <p className="text-xl italic font-serif text-[#7f8c8d] mt-2 relative z-10">{personalInfo.jobTitle}</p>
                
                <div className="flex justify-center gap-6 text-[11px] mt-6 tracking-widest uppercase font-sans text-[#34495e] relative z-10">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </header>

            {sectionVisibility?.summary && summary && (
                <section className="mb-10 text-center px-12">
                    <p className="text-[14px] leading-relaxed italic text-[#34495e] before:content-['“'] after:content-['”'] before:text-4xl after:text-4xl before:text-[#bdc3c7] after:text-[#bdc3c7] before:align-bottom after:align-top">{summary}</p>
                </section>
            )}

            <div className="max-w-4xl mx-auto space-y-10">
                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section>
                        <h2 className="text-center text-2xl uppercase tracking-[0.15em] border-b border-[#bdc3c7] pb-4 mb-8 font-black">Professional Experience</h2>
                        <div className="space-y-8">
                            {workExperience.map((e, i) => (
                                <div key={e.id} className="relative">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-[18px] font-bold text-[#2c3e50]">{e.position} <span className="font-normal italic text-[#7f8c8d]">at {e.company}</span></h3>
                                        <span className="text-[12px] uppercase tracking-wider font-sans text-[#7f8c8d]">{e.startDate} - {e.current ? "Present" : e.endDate}</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed font-sans text-[#555] whitespace-pre-wrap">{e.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-12 mt-10">
                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <h2 className="text-center text-xl uppercase tracking-[0.1em] border-b border-[#bdc3c7] pb-2 mb-6 font-bold">Education</h2>
                            <div className="space-y-5">
                                {education.map(e => (
                                    <div key={e.id} className="text-center">
                                        <div className="text-[15px] font-bold">{e.degree} {e.fieldOfStudy}</div>
                                        <div className="text-[13px] italic text-[#7f8c8d] mt-1">{e.school}</div>
                                        <div className="text-[11px] font-sans tracking-widest uppercase mt-2 text-[#95a5a6]">{e.startDate} - {e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section>
                            <h2 className="text-center text-xl uppercase tracking-[0.1em] border-b border-[#bdc3c7] pb-2 mb-6 font-bold">Core Competencies</h2>
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                {skills.map(s => (
                                    <div key={s.id} className="text-[13px] font-sans text-[#34495e] tracking-wide relative before:content-['•'] before:absolute before:-left-3.5 before:text-[#bdc3c7]">
                                        {s.name}
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
