import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Trophy, Medal, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

const SH = ({ title, color }: { title: string; color: string }) => (
    <div className="flex items-center gap-3 mb-3 break-after-avoid">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color }}>{title}</h2>
        <div className="flex-1 h-[1.5px]" style={{ backgroundColor: color, opacity: 0.2 }} />
    </div>
);

export default function ClassicTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, publications, awards, sectionOrder, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#1e3a5f';

    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const sections: Record<string, React.ReactNode> = {
        personalInfo: sectionVisibility?.personalInfo && (
            <header key="pi" className="text-center mb-6 pb-5" style={{ borderBottom: `2px solid ${c}` }}>
                {personalInfo.photo && (
                    <div className="flex justify-center mb-3">
                        <img src={personalInfo.photo} alt="" className={cn("w-24 h-24 object-cover border-3 shadow-md", personalInfo.photoShape === 'circle' ? "rounded-full" : personalInfo.photoShape === 'rounded' ? "rounded-xl" : "")} style={{ borderColor: c }} />
                    </div>
                )}
                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: c }}>{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-[14px] text-slate-600 font-medium mt-0.5">{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap justify-center gap-4 mt-2.5 text-[10.5px] text-slate-500">
                    {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                    {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
                    {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                </div>
            </header>
        ),
        summary: sectionVisibility?.summary && summary ? (<section key="s" className="mb-5"><SH title="Professional Summary" color={c} /><p className="text-[12px] leading-relaxed text-slate-600">{summary}</p></section>) : null,
        workExperience: sectionVisibility?.workExperience && workExperience?.length > 0 ? (
            <section key="w" className="mb-5"><SH title="Experience" color={c} /><div className="space-y-4">{workExperience.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[13px] text-slate-800">{e.position}</h3><span className="text-[10px] text-slate-400 font-semibold">{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[11px] font-semibold mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p><p className="text-[11px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p></div>
            ))}</div></section>) : null,
        education: sectionVisibility?.education && education?.length > 0 ? (
            <section key="ed" className="mb-5"><SH title="Education" color={c} /><div className="space-y-3">{education.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-bold text-[13px] text-slate-800">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</h3><span className="text-[10px] text-slate-400 font-semibold">{e.startDate} — {e.endDate}</span></div><p className="text-[11px] font-semibold" style={{ color: c }}>{e.school}{e.grade ? ` • GPA: ${e.grade}` : ''}</p>{e.description && <p className="text-[11px] text-slate-600 mt-0.5">{e.description}</p>}</div>
            ))}</div></section>) : null,
        skills: sectionVisibility?.skills && skills?.length > 0 ? (
            <section key="sk" className="mb-5"><SH title="Skills" color={c} /><div className="flex flex-wrap gap-1.5">{skills.map(s => (
                <span key={s.id} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border text-slate-700" style={{ borderColor: c + '40', backgroundColor: c + '08' }}>{s.name}</span>
            ))}</div></section>) : null,
        projects: sectionVisibility?.projects && projects?.length > 0 ? (
            <section key="pj" className="mb-5"><SH title="Projects" color={c} /><div className="space-y-3">{projects.map(p => (
                <div key={p.id}><h3 className="font-bold text-[12px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><div className="flex flex-wrap gap-1 mt-0.5">{p.technologies?.map((t,i) => <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{t}</span>)}</div><p className="text-[11px] text-slate-600 mt-1">{p.description}</p></div>
            ))}</div></section>) : null,
        certifications: sectionVisibility?.certifications && certifications?.length > 0 ? (<section key="c" className="mb-5"><SH title="Certifications" color={c} /><div className="space-y-2">{certifications.map(cert => (<div key={cert.id} className="flex items-start gap-2"><Award className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[12px] text-slate-800">{cert.name}</h3><p className="text-[10px] text-slate-500">{cert.issuer} • {cert.date}</p></div></div>))}</div></section>) : null,
        languages: sectionVisibility?.languages && languages?.length > 0 ? (<section key="l" className="mb-5"><SH title="Languages" color={c} /><div className="flex flex-wrap gap-2">{languages.map(l => (<span key={l.id} className="text-[11px] bg-slate-50 px-3 py-1 rounded-lg text-slate-700 font-medium">{l.name} <span className="text-slate-400">({l.proficiency})</span></span>))}</div></section>) : null,
        interests: sectionVisibility?.interests && interests?.length > 0 ? (<section key="i" className="mb-5"><SH title="Interests" color={c} /><div className="flex flex-wrap gap-2">{interests.map(i => (<span key={i.id} className="text-[10px] px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 font-medium border border-slate-100">{i.name}</span>))}</div></section>) : null,
        achievements: sectionVisibility?.achievements && achievements?.length > 0 ? (<section key="ac" className="mb-5"><SH title="Achievements" color={c} /><div className="space-y-2">{achievements.map(a => (<div key={a.id} className="flex items-start gap-2"><Trophy className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[12px] text-slate-800">{a.title}</h3><p className="text-[11px] text-slate-600">{a.description}</p></div></div>))}</div></section>) : null,
        volunteerWork: sectionVisibility?.volunteerWork && volunteerWork?.length > 0 ? (<section key="v" className="mb-5"><SH title="Volunteer" color={c} /><div className="space-y-3">{volunteerWork.map(v => (<div key={v.id}><div className="flex justify-between"><h3 className="font-bold text-[12px] text-slate-800">{v.role}</h3><span className="text-[10px] text-slate-400">{v.startDate} — {v.current ? "Present" : v.endDate}</span></div><p className="text-[11px] font-semibold" style={{ color: c }}>{v.organization}</p><p className="text-[11px] text-slate-600 mt-0.5 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>) : null,
        publications: sectionVisibility?.publications && publications?.length > 0 ? (<section key="pu" className="mb-5"><SH title="Publications" color={c} /><div className="space-y-2">{publications.map(p => (<div key={p.id}><h3 className="font-bold text-[12px] text-slate-800">{p.title}</h3><p className="text-[10px] text-slate-500">{p.publisher} • {p.date}</p></div>))}</div></section>) : null,
        awards: sectionVisibility?.awards && awards?.length > 0 ? (<section key="aw" className="mb-5"><SH title="Awards" color={c} /><div className="space-y-2">{awards.map(a => (<div key={a.id} className="flex items-start gap-2"><Medal className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: c }} /><div><h3 className="font-bold text-[12px] text-slate-800">{a.title}</h3><p className="text-[10px] text-slate-500">{a.issuer} • {a.date}</p></div></div>))}</div></section>) : null,
    };

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: theme?.viewMode === 'comfortable' ? "1in" : "0.5in" }}>
            {sectionOrder?.map(id => sections[id])}
        </div>
    );
}
