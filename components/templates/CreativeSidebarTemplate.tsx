import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function CreativeSidebarTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#7c3aed';
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title }: { title: string }) => (<div className="mb-3"><h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-800">{title}</h2><div className="h-[2px] w-8 mt-1" style={{ backgroundColor: c }} /></div>);

    return (
        <div className={cn("bg-white mx-auto flex", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm" }}>
            {/* LEFT MAIN */}
            <div className="flex-1 p-7">
                {/* Name */}
                <header className="mb-6">
                    <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">{personalInfo.fullName || "Your Name"}</h1>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: c }}>{personalInfo.jobTitle}</p>
                </header>

                {sectionVisibility?.summary && summary && (<section className="mb-5"><SH title="Profile" /><p className="text-[11px] leading-relaxed text-slate-600">{summary}</p></section>)}

                {sectionVisibility?.workExperience && workExperience?.length > 0 && (
                    <section className="mb-5"><SH title="Experience" /><div className="space-y-4">{workExperience.map(e => (
                        <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[12px] text-slate-800">{e.position}</h3><span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: c + '12', color: c }}>{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[10.5px] font-semibold mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p><p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p></div>
                    ))}</div></section>
                )}

                {sectionVisibility?.education && education?.length > 0 && (
                    <section className="mb-5"><SH title="Education" /><div className="space-y-3">{education.map(e => (
                        <div key={e.id}><h3 className="font-bold text-[12px] text-slate-800">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</h3><p className="text-[10.5px] font-semibold" style={{ color: c }}>{e.school}</p><p className="text-[9px] text-slate-400">{e.startDate} — {e.endDate}{e.grade ? ` • GPA: ${e.grade}` : ''}</p></div>
                    ))}</div></section>
                )}

                {sectionVisibility?.projects && projects?.length > 0 && (
                    <section className="mb-5"><SH title="Projects" /><div className="space-y-3">{projects.map(p => (
                        <div key={p.id}><h3 className="font-bold text-[12px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><div className="flex flex-wrap gap-1 mt-0.5 mb-1">{p.technologies?.map((t,i) => <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: c }}>{t}</span>)}</div><p className="text-[10.5px] text-slate-600">{p.description}</p></div>
                    ))}</div></section>
                )}

                {sectionVisibility?.achievements && achievements?.length > 0 && (
                    <section className="mb-5"><SH title="Achievements" /><div className="space-y-2">{achievements.map(a => (<div key={a.id} className="flex items-start gap-2"><Trophy className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[11px] text-slate-800">{a.title}</h3><p className="text-[10px] text-slate-600">{a.description}</p></div></div>))}</div></section>
                )}

                {sectionVisibility?.volunteerWork && volunteerWork?.length > 0 && (
                    <section className="mb-5"><SH title="Volunteer" /><div className="space-y-2">{volunteerWork.map(v => (<div key={v.id}><h3 className="font-bold text-[11px] text-slate-800">{v.role} <span className="font-normal text-slate-500">@ {v.organization}</span></h3><p className="text-[10px] text-slate-600 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>
                )}

                {sectionVisibility?.awards && awards?.length > 0 && (
                    <section className="mb-5"><SH title="Awards" /><div className="space-y-1.5">{awards.map(a => (<p key={a.id} className="text-[10.5px] text-slate-600"><span className="font-bold text-slate-800">{a.title}</span> — {a.issuer}</p>))}</div></section>
                )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-[30%] text-white p-6 flex flex-col" style={{ backgroundColor: '#1e1b4b' }}>
                {personalInfo.photo && (
                    <div className="flex justify-center mb-4">
                        <img src={personalInfo.photo} alt="" className={cn("w-24 h-24 object-cover border-3 border-white/20 shadow-xl", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-2xl" : "")} />
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: c }}>Contact</h3>
                    <div className="space-y-2 text-[10px]">
                        {personalInfo.email && <div className="flex items-start gap-2 opacity-80"><Mail className="w-3 h-3 mt-0.5 shrink-0" /><span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-center gap-2 opacity-80"><Phone className="w-3 h-3 shrink-0" />{personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2 opacity-80"><MapPin className="w-3 h-3 shrink-0" />{personalInfo.location}</div>}
                        {personalInfo.website && <div className="flex items-center gap-2 opacity-80"><Globe className="w-3 h-3 shrink-0" />{personalInfo.website}</div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-2 opacity-80"><Linkedin className="w-3 h-3 shrink-0" />{personalInfo.linkedin}</div>}
                    </div>
                </div>

                {sectionVisibility?.skills && skills?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: c }}>Skills</h3>
                        <div className="space-y-2">{skills.map(s => (
                            <div key={s.id}><div className="flex justify-between text-[10px] mb-0.5"><span className="font-medium">{s.name}</span></div><div className="h-1 bg-white/15 rounded-full"><div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: c }} /></div></div>
                        ))}</div>
                    </div>
                )}

                {sectionVisibility?.languages && languages?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: c }}>Languages</h3>
                        <div className="space-y-1.5">{languages.map(l => (<div key={l.id} className="flex justify-between text-[10px]"><span className="font-medium">{l.name}</span><span className="opacity-40 capitalize">{l.proficiency}</span></div>))}</div>
                    </div>
                )}

                {sectionVisibility?.certifications && certifications?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: c }}>Certifications</h3>
                        <div className="space-y-2">{certifications.map(cert => (<div key={cert.id}><p className="text-[10px] font-semibold">{cert.name}</p><p className="text-[8px] opacity-40">{cert.issuer}</p></div>))}</div>
                    </div>
                )}

                {sectionVisibility?.interests && interests?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: c }}>Interests</h3>
                        <div className="flex flex-wrap gap-1">{interests.map(i => (<span key={i.id} className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c + '30' }}>{i.name}</span>))}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
