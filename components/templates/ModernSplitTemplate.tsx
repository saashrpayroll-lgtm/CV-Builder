import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, Medal, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ModernSplitTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, publications, awards, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#2563eb';

    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    return (
        <div className={cn("bg-white mx-auto flex", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            {/* LEFT SIDEBAR */}
            <div className="w-[35%] text-white p-6 flex flex-col" style={{ backgroundColor: c }}>
                {/* Photo */}
                {personalInfo.photo && (
                    <div className="flex justify-center mb-4">
                        <img src={personalInfo.photo} alt="" className={cn("w-28 h-28 object-cover border-4 border-white/30 shadow-lg", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-2xl" : "")} />
                    </div>
                )}
                <h1 className="text-[20px] font-extrabold text-center leading-tight mb-1">{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-[11px] text-center opacity-80 font-medium mb-5">{personalInfo.jobTitle}</p>

                {/* Contact */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Contact</h3>
                    <div className="space-y-2 text-[10px]">
                        {personalInfo.email && <div className="flex items-center gap-2 opacity-90"><Mail className="w-3 h-3 shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-center gap-2 opacity-90"><Phone className="w-3 h-3 shrink-0" />{personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2 opacity-90"><MapPin className="w-3 h-3 shrink-0" />{personalInfo.location}</div>}
                        {personalInfo.website && <div className="flex items-center gap-2 opacity-90"><Globe className="w-3 h-3 shrink-0" />{personalInfo.website}</div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-2 opacity-90"><Linkedin className="w-3 h-3 shrink-0" />{personalInfo.linkedin}</div>}
                        {personalInfo.github && <div className="flex items-center gap-2 opacity-90"><Github className="w-3 h-3 shrink-0" />{personalInfo.github}</div>}
                    </div>
                </div>

                {/* Skills */}
                {sectionVisibility?.skills && skills?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Skills</h3>
                        <div className="space-y-2.5">
                            {skills.map(s => (
                                <div key={s.id}>
                                    <div className="flex justify-between text-[10px] mb-1"><span className="font-semibold">{s.name}</span><span className="opacity-50">{s.percentage}%</span></div>
                                    <div className="h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white/80 rounded-full" style={{ width: `${s.percentage}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {sectionVisibility?.languages && languages?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Languages</h3>
                        <div className="space-y-1.5">{languages.map(l => (
                            <div key={l.id} className="flex justify-between text-[10px]"><span className="font-medium">{l.name}</span><span className="opacity-50 capitalize">{l.proficiency}</span></div>
                        ))}</div>
                    </div>
                )}

                {/* Interests */}
                {sectionVisibility?.interests && interests?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Interests</h3>
                        <div className="flex flex-wrap gap-1.5">{interests.map(i => (
                            <span key={i.id} className="text-[9px] px-2 py-1 rounded-full bg-white/15 font-medium">{i.name}</span>
                        ))}</div>
                    </div>
                )}

                {/* Certifications */}
                {sectionVisibility?.certifications && certifications?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Certifications</h3>
                        <div className="space-y-2">{certifications.map(cert => (
                            <div key={cert.id}><p className="text-[10px] font-bold">{cert.name}</p><p className="text-[9px] opacity-50">{cert.issuer} • {cert.date}</p></div>
                        ))}</div>
                    </div>
                )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-[65%] p-7">
                {/* Summary */}
                {sectionVisibility?.summary && summary && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Summary</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <p className="text-[11.5px] leading-relaxed text-slate-600">{summary}</p>
                    </section>
                )}

                {/* Work Experience */}
                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Experience</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-4">{workExperience.map(e => (
                            <div key={e.id} className="relative pl-4" style={{ borderLeft: `2px solid ${c}20` }}>
                                <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                                <div className="flex justify-between items-baseline"><h3 className="font-bold text-[12.5px] text-slate-800">{e.position}</h3><span className="text-[9.5px] text-slate-400 font-semibold shrink-0 ml-2">{e.startDate} — {e.current ? "Present" : e.endDate}</span></div>
                                <p className="text-[10.5px] font-semibold mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p>
                                <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p>
                            </div>
                        ))}</div>
                    </section>
                )}

                {/* Education */}
                {sectionVisibility?.education && education?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Education</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-3">{education.map(e => (
                            <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[12px] text-slate-800">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</h3><span className="text-[9.5px] text-slate-400 font-semibold">{e.startDate} — {e.endDate}</span></div><p className="text-[10.5px] font-semibold" style={{ color: c }}>{e.school}{e.grade ? ` • GPA: ${e.grade}` : ''}</p>{e.description && <p className="text-[10.5px] text-slate-600 mt-0.5">{e.description}</p>}</div>
                        ))}</div>
                    </section>
                )}

                {/* Projects */}
                {sectionVisibility?.projects && projects?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Projects</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-3">{projects.map(p => (
                            <div key={p.id}><h3 className="font-bold text-[12px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><div className="flex flex-wrap gap-1 mt-0.5 mb-1">{p.technologies?.map((t,i) => <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: c + 'CC' }}>{t}</span>)}</div><p className="text-[10.5px] text-slate-600">{p.description}</p></div>
                        ))}</div>
                    </section>
                )}

                {/* Achievements */}
                {sectionVisibility?.achievements && achievements?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Achievements</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-2">{achievements.map(a => (<div key={a.id} className="flex items-start gap-2"><Trophy className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[11px] text-slate-800">{a.title}</h3><p className="text-[10px] text-slate-600">{a.description}</p></div></div>))}</div>
                    </section>
                )}

                {/* Awards */}
                {sectionVisibility?.awards && awards?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Awards</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-2">{awards.map(a => (<div key={a.id} className="flex items-start gap-2"><Medal className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[11px] text-slate-800">{a.title}</h3><p className="text-[10px] text-slate-500">{a.issuer} • {a.date}</p></div></div>))}</div>
                    </section>
                )}

                {/* Volunteer */}
                {sectionVisibility?.volunteerWork && volunteerWork?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Volunteer</h2>
                        <div className="h-[2px] w-10 mb-3" style={{ backgroundColor: c }} />
                        <div className="space-y-3">{volunteerWork.map(v => (<div key={v.id}><div className="flex justify-between"><h3 className="font-bold text-[12px] text-slate-800">{v.role}</h3><span className="text-[9.5px] text-slate-400">{v.startDate} — {v.current ? "Present" : v.endDate}</span></div><p className="text-[10.5px] font-semibold" style={{ color: c }}>{v.organization}</p><p className="text-[10.5px] text-slate-600 mt-0.5 whitespace-pre-wrap">{v.description}</p></div>))}</div>
                    </section>
                )}
            </div>
        </div>
    );
}
