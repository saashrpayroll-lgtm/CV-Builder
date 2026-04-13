import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function RetroTerminalTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, sectionVisibility } = data;

    return (
        <div className={cn("mx-auto", isPrint ? "print-area bg-white text-black" : "bg-black text-[#66ff66]")} 
             style={{ fontFamily: "'Fira Code', 'Courier New', monospace", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: "40px" }}>
            
            <header className="mb-6 border-b border-dashed border-current pb-4">
                <div className="text-[12px] opacity-60 mb-2">admin@sys:~$ whoami</div>
                <h1 className="text-3xl font-bold tracking-tight">{personalInfo.fullName?.toLowerCase() || "root"}</h1>
                <p className="text-sm mt-1">TITLE: {personalInfo.jobTitle}</p>
                <div className="flex gap-6 text-[10px] mt-3 opacity-80">
                    {personalInfo.email && <span>E: {personalInfo.email}</span>}
                    {personalInfo.phone && <span>P: {personalInfo.phone}</span>}
                    {personalInfo.location && <span>L: {personalInfo.location}</span>}
                    {personalInfo.github && <span>G: {personalInfo.github}</span>}
                </div>
            </header>

            <div className="text-[11px] space-y-6">
                {sectionVisibility?.summary && summary && (
                    <section>
                        <div className="font-bold mb-2">guest@sys:~$ cat ./profile.txt</div>
                        <p className="pl-4 border-l-2 border-current leading-relaxed whitespace-pre-wrap">{summary}</p>
                    </section>
                )}

                {sectionVisibility?.skills && skills?.length > 0 && (
                    <section>
                        <div className="font-bold mb-2">guest@sys:~$ ls ~/skills</div>
                        <div className="grid grid-cols-3 gap-2 pl-4">
                            {skills.map((s, i) => (
                                <div key={i} className="before:content-['-rwxr-xr-x_'] opacity-90">{s.name.replace(/\s+/g, '_').toLowerCase()}.sh</div>
                            ))}
                        </div>
                    </section>
                )}

                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section>
                        <div className="font-bold mb-2">guest@sys:~$ cat ./experience.log</div>
                        <div className="space-y-4 pl-4">
                            {workExperience.map(e => (
                                <div key={e.id} className="border border-dashed border-current p-3">
                                    <div className="flex justify-between font-bold border-b border-dashed border-current pb-1 mb-2">
                                        <span>[{e.company}]</span>
                                        <span>{e.startDate} - {e.current ? "now" : e.endDate}</span>
                                    </div>
                                    <div className="font-bold mb-1">ROLE: {e.position}</div>
                                    <p className="leading-relaxed opacity-90 whitespace-pre-wrap">{e.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {sectionVisibility?.education && education?.length > 0 && (
                    <section>
                        <div className="font-bold mb-2">guest@sys:~$ tail -f ./education.log</div>
                        <div className="space-y-3 pl-4">
                            {education.map(e => (
                                <div key={e.id} className="flex gap-4">
                                    <div className="w-24 shrink-0 opacity-70">[{e.startDate}-{e.endDate}]</div>
                                    <div>
                                        <span className="font-bold">{e.degree}</span> in {e.fieldOfStudy} <br/>
                                        <span className="opacity-70">@ {e.school}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                <div className="animate-pulse">guest@sys:~$ _</div>
            </div>
        </div>
    );
}
