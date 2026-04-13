import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, Medal, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ExecutiveTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionOrder, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#0f766e';
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title }: { title: string }) => (
        <div className="mb-3"><h2 className="text-[12px] font-black uppercase tracking-[0.2em]" style={{ color: c }}>{title}</h2><div className="h-[1px] mt-1.5" style={{ background: `linear-gradient(to right, ${c}, transparent)` }} /></div>
    );

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            {/* DARK HEADER */}
            <div className="px-8 py-7 text-white flex items-center gap-6" style={{ backgroundColor: '#1e293b' }}>
                {personalInfo.photo && (
                    <img src={personalInfo.photo} alt="" className={cn("w-24 h-24 object-cover border-3 border-white/20 shadow-xl shrink-0", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-2xl" : "")} />
                )}
                <div className="flex-1">
                    <h1 className="text-[26px] font-extrabold tracking-tight">{personalInfo.fullName || "Your Name"}</h1>
                    <p className="text-[13px] font-medium mt-0.5" style={{ color: c }}>{personalInfo.jobTitle}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-[10px] opacity-70">
                        {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                        {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                        {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                        {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                        {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                    </div>
                </div>
            </div>

            {/* Accent Bar */}
            <div className="h-1" style={{ backgroundColor: c }} />

            {/* Body */}
            <div className="px-8 py-6">
                {sectionVisibility?.summary && summary && (<section className="mb-6"><SH title="Executive Summary" /><p className="text-[11.5px] leading-relaxed text-slate-600">{summary}</p></section>)}

                {/* Two-column body for key sections */}
                <div className="flex gap-8">
                    <div className="flex-1">
                        {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                            <section className="mb-6"><SH title="Professional Experience" /><div className="space-y-4">{workExperience.map(e => (
                                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[12px] text-slate-800">{e.position}</h3><span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: c + '15', color: c }}>{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[10.5px] font-semibold mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` | ${e.location}` : ''}</p><p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.projects && projects?.length > 0 && (
                            <section className="mb-6"><SH title="Key Projects" /><div className="space-y-3">{projects.map(p => (
                                <div key={p.id}><h3 className="font-bold text-[12px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><div className="flex flex-wrap gap-1 mt-0.5 mb-1">{p.technologies?.map((t,i) => <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: c }}>{t}</span>)}</div><p className="text-[10.5px] text-slate-600">{p.description}</p></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.volunteerWork && volunteerWork?.length > 0 && (
                            <section className="mb-6"><SH title="Volunteer Experience" /><div className="space-y-3">{volunteerWork.map(v => (<div key={v.id}><h3 className="font-bold text-[12px] text-slate-800">{v.role} <span className="font-normal" style={{ color: c }}>@ {v.organization}</span></h3><p className="text-[10.5px] text-slate-600 mt-0.5 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>
                        )}
                    </div>

                    <div className="w-[200px] shrink-0">
                        {sectionVisibility?.education && education?.length > 0 && (
                            <section className="mb-6"><SH title="Education" /><div className="space-y-3">{education.map(e => (
                                <div key={e.id}><h3 className="font-bold text-[11px] text-slate-800">{e.degree}</h3><p className="text-[10px]" style={{ color: c }}>{e.school}</p><p className="text-[9px] text-slate-400">{e.startDate} — {e.endDate}</p></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.skills && skills?.length > 0 && (
                            <section className="mb-6"><SH title="Core Skills" /><div className="space-y-2">{skills.map(s => (
                                <div key={s.id}><span className="text-[10px] font-semibold text-slate-700">{s.name}</span><div className="h-1 bg-slate-100 rounded-full mt-0.5"><div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: c }} /></div></div>
                            ))}</div></section>
                        )}

                        {sectionVisibility?.certifications && certifications?.length > 0 && (
                            <section className="mb-6"><SH title="Certifications" /><div className="space-y-2">{certifications.map(cert => (<div key={cert.id}><p className="text-[10px] font-bold text-slate-800">{cert.name}</p><p className="text-[9px] text-slate-500">{cert.issuer}</p></div>))}</div></section>
                        )}

                        {sectionVisibility?.languages && languages?.length > 0 && (
                            <section className="mb-6"><SH title="Languages" /><div className="space-y-1">{languages.map(l => (<div key={l.id} className="flex justify-between text-[10px]"><span className="text-slate-700 font-medium">{l.name}</span><span className="text-slate-400 capitalize">{l.proficiency}</span></div>))}</div></section>
                        )}

                        {sectionVisibility?.achievements && achievements?.length > 0 && (
                            <section className="mb-6"><SH title="Achievements" /><div className="space-y-1.5">{achievements.map(a => (<div key={a.id} className="flex items-start gap-1.5"><Trophy className="w-3 h-3 mt-0.5 shrink-0" style={{ color: c }} /><p className="text-[10px] text-slate-700 font-medium">{a.title}</p></div>))}</div></section>
                        )}

                        {sectionVisibility?.awards && awards?.length > 0 && (
                            <section className="mb-6"><SH title="Awards" /><div className="space-y-1.5">{awards.map(a => (<div key={a.id}><p className="text-[10px] font-bold text-slate-800">{a.title}</p><p className="text-[9px] text-slate-500">{a.issuer}</p></div>))}</div></section>
                        )}

                        {sectionVisibility?.interests && interests?.length > 0 && (
                            <section className="mb-6"><SH title="Interests" /><div className="flex flex-wrap gap-1">{interests.map(i => (<span key={i.id} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c + '10', color: c }}>{i.name}</span>))}</div></section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
