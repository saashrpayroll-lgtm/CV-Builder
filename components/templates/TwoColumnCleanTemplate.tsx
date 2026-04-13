import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function TwoColumnCleanTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility, theme } = data;

    return (
        <div className={cn("mx-auto flex bg-white text-slate-800", isPrint && "print-area")} 
             style={{ fontFamily: "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            
            {/* Left Sidebar */}
            <div className="w-1/3 bg-slate-100 p-8 flex flex-col gap-8">
                <div className="w-32 h-32 rounded-full bg-slate-300 mx-auto flex items-center justify-center text-4xl text-slate-500 font-light ring-4 ring-white">
                    {personalInfo.fullName?.charAt(0) || "U"}
                </div>
                
                <div>
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">Contact</h2>
                    <div className="text-[11px] space-y-2 text-slate-600">
                        {personalInfo.email && <div>{personalInfo.email}</div>}
                        {personalInfo.phone && <div>{personalInfo.phone}</div>}
                        {personalInfo.location && <div>{personalInfo.location}</div>}
                        {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
                    </div>
                </div>

                {sectionVisibility?.skills && skills?.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((s, i) => (
                                <span key={i} className="bg-slate-200 text-slate-700 px-2 py-1 text-[10px] rounded">{s.name}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                {sectionVisibility?.education && education?.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">Education</h2>
                        <div className="space-y-3">
                            {education.map(e => (
                                <div key={e.id}>
                                    <div className="text-[11px] font-bold text-slate-800">{e.degree}</div>
                                    <div className="text-[10px] text-slate-500">{e.school}</div>
                                    <div className="text-[9px] text-slate-400 mt-0.5">{e.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Main Content */}
            <div className="w-2/3 p-8 flex flex-col gap-6">
                <header className="mb-2">
                    <h1 className="text-4xl font-bold text-slate-900">{personalInfo.fullName}</h1>
                    <p className="text-lg text-slate-500 font-medium mt-1 uppercase tracking-wide">{personalInfo.jobTitle}</p>
                </header>

                {sectionVisibility?.summary && summary && (
                    <section>
                        <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-2">
                            <div className="w-6 h-px bg-slate-900"></div> Profile
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-slate-600">{summary}</p>
                    </section>
                )}

                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section>
                        <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-4 mt-2">
                            <div className="w-6 h-px bg-slate-900"></div> Experience
                        </h2>
                        <div className="space-y-5">
                            {workExperience.map(e => (
                                <div key={e.id} className="relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-[13.5px] font-bold text-slate-800">{e.position}</h3>
                                            <div className="text-[11.5px] font-medium text-slate-500">{e.company}</div>
                                        </div>
                                        <div className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                            {e.startDate} — {e.current ? "Present" : e.endDate}
                                        </div>
                                    </div>
                                    <p className="text-[11px] leading-relaxed mt-2 text-slate-600 whitespace-pre-wrap">{e.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
