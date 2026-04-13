import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, Medal, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function CorporateTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#b45309';
    const navy = '#1e293b';
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title, icon: Icon }: { title: string; icon?: any }) => (
        <div className="flex items-center gap-2 mb-3 pb-1.5" style={{ borderBottom: `1px solid ${navy}15` }}>
            {Icon && <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: c }}><Icon className="w-3.5 h-3.5 text-white" /></div>}
            <h2 className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: navy }}>{title}</h2>
        </div>
    );

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            {/* NAVY HEADER */}
            <div className="px-8 py-6 text-white flex items-center gap-5" style={{ backgroundColor: navy }}>
                {personalInfo.photo && (
                    <img src={personalInfo.photo} alt="" className={cn("w-20 h-20 object-cover shrink-0 border-2", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-xl" : "")} style={{ borderColor: c }} />
                )}
                <div className="flex-1">
                    <h1 className="text-[24px] font-extrabold tracking-tight">{personalInfo.fullName || "Your Name"}</h1>
                    <p className="text-[12px] font-semibold mt-0.5" style={{ color: c }}>{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-[9.5px] space-y-1 opacity-70 shrink-0">
                    {personalInfo.email && <div className="flex items-center justify-end gap-1"><span>{personalInfo.email}</span><Mail className="w-3 h-3" /></div>}
                    {personalInfo.phone && <div className="flex items-center justify-end gap-1"><span>{personalInfo.phone}</span><Phone className="w-3 h-3" /></div>}
                    {personalInfo.location && <div className="flex items-center justify-end gap-1"><span>{personalInfo.location}</span><MapPin className="w-3 h-3" /></div>}
                    {personalInfo.linkedin && <div className="flex items-center justify-end gap-1"><span>{personalInfo.linkedin}</span><Linkedin className="w-3 h-3" /></div>}
                </div>
            </div>
            <div className="h-1" style={{ backgroundColor: c }} />

            {/* Body */}
            <div className="px-8 py-6">
                {sectionVisibility?.summary && summary && (<section className="mb-5"><SH title="Executive Summary" /><p className="text-[11px] leading-relaxed text-slate-600 pl-8">{summary}</p></section>)}

                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section className="mb-5"><SH title="Professional Experience" icon={Trophy} /><div className="space-y-4 pl-8">{workExperience.map(e => (
                        <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[12px] text-slate-800">{e.position}</h3><span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: c + '15', color: c }}>{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[10.5px] font-semibold mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` | ${e.location}` : ''}</p><p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p></div>
                    ))}</div></section>
                )}

                <div className="flex gap-8">
                    <div className="flex-1">
                        {sectionVisibility?.education && education?.length > 0 && (
                            <section className="mb-5"><SH title="Education" /><div className="space-y-3">{education.map(e => (
                                <div key={e.id}><h3 className="font-bold text-[11.5px] text-slate-800">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</h3><p className="text-[10px] font-semibold" style={{ color: c }}>{e.school}</p><p className="text-[9px] text-slate-400">{e.startDate} — {e.endDate}</p></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.projects && projects?.length > 0 && (
                            <section className="mb-5"><SH title="Projects" icon={ExternalLink} /><div className="space-y-3">{projects.map(p => (
                                <div key={p.id}><h3 className="font-bold text-[11px] text-slate-800">{p.name}</h3><p className="text-[10px] text-slate-600 mt-0.5">{p.description}</p></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.volunteerWork && volunteerWork?.length > 0 && (
                            <section className="mb-5"><SH title="Community Involvement" /><div className="space-y-2">{volunteerWork.map(v => (<div key={v.id}><h3 className="font-bold text-[11px] text-slate-800">{v.role}, {v.organization}</h3><p className="text-[10px] text-slate-600 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>
                        )}
                    </div>

                    <div className="w-[200px] shrink-0">
                        {sectionVisibility?.skills && skills?.length > 0 && (
                            <section className="mb-5"><SH title="Core Competencies" /><div className="space-y-1.5">{skills.map(s => (
                                <div key={s.id} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} /><span className="text-[10px] font-medium text-slate-700">{s.name}</span></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.certifications && certifications?.length > 0 && (
                            <section className="mb-5"><SH title="Certifications" icon={Award} /><div className="space-y-2">{certifications.map(cert => (<div key={cert.id}><p className="text-[10px] font-bold text-slate-700">{cert.name}</p><p className="text-[8.5px] text-slate-400">{cert.issuer} • {cert.date}</p></div>))}</div></section>
                        )}

                        {sectionVisibility?.languages && languages?.length > 0 && (
                            <section className="mb-5"><SH title="Languages" /><div className="space-y-1">{languages.map(l => (<div key={l.id} className="flex justify-between text-[10px]"><span className="text-slate-700">{l.name}</span><span className="text-slate-400 capitalize">{l.proficiency}</span></div>))}</div></section>
                        )}

                        {sectionVisibility?.achievements && achievements?.length > 0 && (
                            <section className="mb-5"><SH title="Key Achievements" icon={Medal} /><div className="space-y-1.5">{achievements.map(a => (<p key={a.id} className="text-[9.5px] text-slate-700 font-medium">• {a.title}</p>))}</div></section>
                        )}

                        {sectionVisibility?.awards && awards?.length > 0 && (
                            <section className="mb-5"><SH title="Awards" /><div className="space-y-1.5">{awards.map(a => (<div key={a.id}><p className="text-[9.5px] font-bold text-slate-700">{a.title}</p><p className="text-[8px] text-slate-400">{a.issuer}</p></div>))}</div></section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
