import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function PastelDreamTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, sectionVisibility, theme } = data;

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-[#fcf8fa]" : "bg-[#fcf8fa]")} 
             style={{ fontFamily: "'Poppins', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px", color: "#4a4a4a" }}>
            
            <header className="text-center mb-8 bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
                <h1 className="text-4xl font-bold tracking-tight text-[#2d2d2d] mb-2">{personalInfo.fullName}</h1>
                <p className="text-[#d88c9a] font-medium tracking-wide uppercase text-sm">{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap justify-center gap-4 text-[11px] mt-4 opacity-70">
                    {personalInfo.email && <span className="bg-[#fcf8fa] px-3 py-1 rounded-full">{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="bg-[#fcf8fa] px-3 py-1 rounded-full">{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="bg-[#fcf8fa] px-3 py-1 rounded-full">{personalInfo.location}</span>}
                    {personalInfo.linkedin && <span className="bg-[#fcf8fa] px-3 py-1 rounded-full">{personalInfo.linkedin}</span>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    {sectionVisibility?.summary && summary && (
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-sm font-bold text-[#d88c9a] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#f2c6d0]"></span> Profile
                            </h2>
                            <p className="text-[12px] leading-[1.8] text-[#666]">{summary}</p>
                        </section>
                    )}

                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-sm font-bold text-[#d88c9a] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#f2c6d0]"></span> Experience
                            </h2>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#f2c6d0] before:to-transparent">
                                {workExperience.map((e, index) => (
                                    <div key={e.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-[#d88c9a] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm shrink-0 z-10"></div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-[#fcf8fa] p-4 rounded-2xl">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-[#4a4a4a] text-[13px]">{e.position}</div>
                                                <time className="font-mono text-[#d88c9a] text-[10px]">{e.startDate.substring(0, 4)} - {e.current ? "Present" : e.endDate.substring(0, 4)}</time>
                                            </div>
                                            <div className="text-[11px] text-[#888] font-medium mb-2">{e.company}</div>
                                            <div className="text-[11px] text-[#666] leading-relaxed whitespace-pre-wrap">{e.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 space-y-6">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-sm font-bold text-[#d88c9a] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#f2c6d0]"></span> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s, idx) => (
                                    <span key={idx} className="bg-[#fcf8fa] text-[#666] text-[11px] font-medium px-3 py-1.5 rounded-xl border border-pink-100/50">
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.education && education?.length > 0 && (
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-sm font-bold text-[#d88c9a] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#f2c6d0]"></span> Education
                            </h2>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id} className="relative pl-3 border-l-2 border-[#f2c6d0]">
                                        <div className="text-[12px] font-bold text-[#4a4a4a]">{e.degree}</div>
                                        <div className="text-[11px] text-[#888] font-medium my-0.5">{e.school}</div>
                                        <div className="text-[10px] text-[#d88c9a] bg-[#fcf8fa] inline-block px-2 py-0.5 rounded-md mt-1">{e.startDate} - {e.endDate}</div>
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
