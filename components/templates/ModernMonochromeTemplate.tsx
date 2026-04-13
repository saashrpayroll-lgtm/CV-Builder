import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ModernMonochromeTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility, theme } = data;

    return (
        <div className={cn("mx-auto bg-white text-black", isPrint && "print-area")} 
             style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "1in" }}>
            
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-black uppercase tracking-tighter w-full border-y-[6px] border-black py-4 mb-4">{personalInfo.fullName}</h1>
                <p className="text-xl uppercase tracking-widest font-bold">{personalInfo.jobTitle}</p>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-[12px] mt-4 font-medium">
                    {personalInfo.email && <span className="border-b-2 border-black">{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="border-b-2 border-black">{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </header>

            <div className="space-y-10">
                {sectionVisibility?.summary && summary && (
                    <section>
                        <h2 className="text-[14px] font-bold uppercase tracking-wider mb-3 bg-black text-white inline-block px-3 py-1">Profile</h2>
                        <p className="text-[13px] leading-[1.8] font-medium text-justify">{summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-8 space-y-10">
                        {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                            <section>
                                <h2 className="text-[14px] font-bold uppercase tracking-wider mb-5 bg-black text-white inline-block px-3 py-1">Experience</h2>
                                <div className="space-y-8">
                                    {workExperience.map((e, i) => (
                                        <div key={e.id}>
                                            <div className="flex justify-between items-baseline border-b-2 border-black pb-1 mb-2">
                                                <h3 className="text-[16px] font-bold uppercase">{e.position} <span className="text-gray-500 font-medium">| {e.company}</span></h3>
                                                <span className="text-[11px] font-bold uppercase">{e.startDate} — {e.current ? "Present" : e.endDate}</span>
                                            </div>
                                            <p className="text-[12px] leading-relaxed font-medium mt-2 whitespace-pre-wrap">{e.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-4 space-y-10 border-l-2 border-black pl-8">
                        {sectionVisibility?.education && education?.length > 0 && (
                            <section>
                                <h2 className="text-[14px] font-bold uppercase tracking-wider mb-5 bg-black text-white inline-block px-3 py-1">Education</h2>
                                <div className="space-y-6">
                                    {education.map(e => (
                                        <div key={e.id}>
                                            <div className="text-[14px] font-bold uppercase leading-tight">{e.degree}</div>
                                            <div className="text-[12px] mt-1 font-medium text-gray-600">{e.school}</div>
                                            <div className="text-[10px] mt-1 font-bold">{e.startDate} - {e.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {sectionVisibility?.skills && skills?.length > 0 && (
                            <section>
                                <h2 className="text-[14px] font-bold uppercase tracking-wider mb-5 bg-black text-white inline-block px-3 py-1">Skills</h2>
                                <ul className="space-y-2">
                                    {skills.map(s => (
                                        <li key={s.id} className="text-[12px] font-bold uppercase flex items-center before:content-[''] before:w-2 before:h-2 before:bg-black before:mr-2">
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
