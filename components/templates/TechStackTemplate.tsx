import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function TechStackTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#059669';
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            {/* Header with green accent */}
            <div className="px-7 py-6 flex items-center gap-5" style={{ borderBottom: `3px solid ${c}` }}>
                {personalInfo.photo && (
                    <img src={personalInfo.photo} alt="" className={cn("w-20 h-20 object-cover shrink-0 border-2", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-xl" : "")} style={{ borderColor: c }} />
                )}
                <div className="flex-1">
                    <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight">{personalInfo.fullName || "Your Name"}</h1>
                    <p className="text-[12px] font-bold uppercase tracking-[0.15em] mt-0.5" style={{ color: c }}>{personalInfo.jobTitle}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-[9.5px] text-slate-500">
                        {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                        {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                        {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                        {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                        {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                    </div>
                </div>
                {/* Tech Stack Badge */}
                {sectionVisibility?.skills && skills?.length > 0 && (
                    <div className="shrink-0 w-[160px]">
                        <h4 className="text-[8px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: c }}>Tech Stack</h4>
                        <div className="flex flex-wrap gap-1">{skills.slice(0, 8).map(s => (
                            <span key={s.id} className="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: c }}>{s.name}</span>
                        ))}</div>
                    </div>
                )}
            </div>

            {/* Body - Two Equal Columns */}
            <div className="flex px-7 py-5 gap-6">
                <div className="flex-1">
                    {sectionVisibility?.summary && summary && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: c }}>Summary</h2><p className="text-[11px] leading-relaxed text-slate-600">{summary}</p></section>
                    )}

                    {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Experience</h2><div className="space-y-4">{workExperience.map(e => (
                            <div key={e.id} className="pl-3" style={{ borderLeft: `2px solid ${c}` }}>
                                <h3 className="font-bold text-[12px] text-slate-800">{e.position}</h3>
                                <div className="flex justify-between items-center"><p className="text-[10px] font-semibold" style={{ color: c }}>{e.company}</p><span className="text-[9px] text-slate-400">{e.startDate} — {e.current ? "Present" : e.endDate}</span></div>
                                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p>
                            </div>
                        ))}</div></section>
                    )}

                    {sectionVisibility?.projects && projects?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Projects</h2><div className="space-y-3">{projects.map(p => (
                            <div key={p.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-[11px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3>
                                <div className="flex flex-wrap gap-1 mt-1 mb-1">{p.technologies?.map((t,i) => <span key={i} className="text-[7px] font-black px-1.5 py-0.5 rounded text-white uppercase" style={{ backgroundColor: c + 'CC' }}>{t}</span>)}</div>
                                <p className="text-[10px] text-slate-600">{p.description}</p>
                            </div>
                        ))}</div></section>
                    )}
                </div>

                <div className="w-[200px] shrink-0">
                    {/* Skills with bars */}
                    {sectionVisibility?.skills && skills?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Skills</h2><div className="space-y-2.5">{skills.map(s => (
                            <div key={s.id}><div className="flex justify-between text-[9.5px] mb-0.5"><span className="font-semibold text-slate-700">{s.name}</span><span className="text-slate-400">{s.percentage}%</span></div><div className="h-1.5 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: c }} /></div></div>
                        ))}</div></section>
                    )}

                    {sectionVisibility?.education && education?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Education</h2><div className="space-y-3">{education.map(e => (
                            <div key={e.id}><h3 className="font-bold text-[10.5px] text-slate-800">{e.degree}</h3><p className="text-[9.5px]" style={{ color: c }}>{e.school}</p><p className="text-[8.5px] text-slate-400">{e.startDate} — {e.endDate}</p></div>
                        ))}</div></section>
                    )}

                    {sectionVisibility?.certifications && certifications?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Certs</h2><div className="space-y-2">{certifications.map(cert => (<div key={cert.id} className="flex items-start gap-1.5"><Award className="w-3 h-3 mt-0.5 shrink-0" style={{ color: c }} /><div><p className="text-[9.5px] font-bold text-slate-700">{cert.name}</p><p className="text-[8px] text-slate-400">{cert.issuer}</p></div></div>))}</div></section>
                    )}

                    {sectionVisibility?.languages && languages?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Languages</h2><div className="space-y-1">{languages.map(l => (<div key={l.id} className="flex justify-between text-[10px]"><span className="text-slate-700">{l.name}</span><span className="text-slate-400 capitalize">{l.proficiency}</span></div>))}</div></section>
                    )}

                    {sectionVisibility?.achievements && achievements?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Achievements</h2><div className="space-y-1.5">{achievements.map(a => (<div key={a.id} className="flex items-start gap-1.5"><Trophy className="w-3 h-3 mt-0.5 shrink-0" style={{ color: c }} /><p className="text-[9.5px] text-slate-700 font-medium">{a.title}</p></div>))}</div></section>
                    )}

                    {sectionVisibility?.interests && interests?.length > 0 && (
                        <section className="mb-5"><h2 className="text-[11px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: c }}>Interests</h2><div className="flex flex-wrap gap-1">{interests.map(i => (<span key={i.id} className="text-[8px] px-2 py-0.5 rounded-full font-medium border" style={{ borderColor: c + '40', color: c }}>{i.name}</span>))}</div></section>
                    )}
                </div>
            </div>
        </div>
    );
}
