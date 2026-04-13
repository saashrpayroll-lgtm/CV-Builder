import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function CreativePortfolioTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, sectionVisibility } = data;

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-white text-black" : "bg-[#fceb4f] text-[#1a1a1a]")} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px" }}>
            
            <header className="border-b-8 border-[#1a1a1a] pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-6xl font-black lowercase tracking-tighter leading-none">{personalInfo.fullName}</h1>
                    <p className="text-xl font-bold uppercase tracking-widest mt-2 bg-[#1a1a1a] text-[#fceb4f] inline-block px-2">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-[12px] font-bold uppercase space-y-1">
                    {personalInfo.email && <div>{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>
            </header>

            {sectionVisibility?.summary && summary && (
                <section className="mb-10">
                    <h2 className="text-3xl font-black lowercase mb-3 bg-[#1a1a1a] text-white inline-block px-2 py-1 transform -rotate-2">Profile</h2>
                    <p className="text-[14px] font-medium leading-relaxed mt-2 border-l-4 border-[#1a1a1a] pl-4 text-balance">{summary}</p>
                </section>
            )}

            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-8">
                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-2xl font-black lowercase mb-4 border-b-4 border-[#1a1a1a] inline-block pr-6">Experience</h2>
                            <div className="space-y-8 mt-2">
                                {workExperience.map(e => (
                                    <div key={e.id} className="relative before:content-[''] before:absolute before:-left-4 before:top-2 before:w-2 before:h-2 before:bg-[#1a1a1a]">
                                        <div className="flex flex-wrap items-end justify-between font-bold">
                                            <h3 className="text-[16px] uppercase">{e.position} <span className="lowercase text-opacity-60">@ {e.company}</span></h3>
                                            <span className="text-[11px] bg-white border-2 border-[#1a1a1a] px-2 py-0.5">{e.startDate} - {e.current ? "NOW" : e.endDate}</span>
                                        </div>
                                        <p className="text-[12px] mt-2 font-medium leading-relaxed whitespace-pre-wrap">{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.projects && projects?.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black lowercase mb-4 border-b-4 border-[#1a1a1a] inline-block pr-6">Selected Works</h2>
                            <div className="space-y-4 mt-2">
                                {projects.map(p => (
                                    <div key={p.id} className="border-4 border-[#1a1a1a] p-4 bg-white shadow-[4px_4px_0px_#1a1a1a]">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-black text-[14px] uppercase">{p.name}</span>
                                        </div>
                                        <p className="text-[12px] font-medium leading-relaxed mb-3">{p.description}</p>
                                        {p.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {p.technologies.map((t, i) => <span key={i} className="text-[9px] font-bold uppercase bg-[#fceb4f] border-2 border-[#1a1a1a] px-1">{t}</span>)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 border-l-4 border-[#1a1a1a] pl-8">
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-xl font-black lowercase mb-4">Skills_</h2>
                            <div className="flex flex-col gap-2">
                                {skills.map(s => (
                                    <div key={s.id} className="text-[13px] font-bold uppercase border-2 border-[#1a1a1a] p-1.5 text-center bg-white shadow-[2px_2px_0px_#1a1a1a]">
                                        {s.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {sectionVisibility?.education && education?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black lowercase mb-4">Edu_</h2>
                            <div className="space-y-5">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <div className="text-[14px] font-black uppercase leading-tight">{e.degree}</div>
                                        <div className="text-[12px] font-bold lowercase mt-1">{e.fieldOfStudy}</div>
                                        <div className="text-[11px] font-medium mt-2 p-1.5 border-l-4 border-[#1a1a1a] bg-white">{e.school}</div>
                                        <div className="text-[10px] font-bold mt-1 ">{e.startDate}-{e.endDate}</div>
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
