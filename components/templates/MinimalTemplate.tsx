import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function MinimalTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionOrder, sectionVisibility, theme } = data;
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title }: { title: string }) => (<div className="mb-3 mt-5"><h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">{title}</h2><div className="h-[0.5px] bg-slate-200" /></div>);

    const sections: Record<string, React.ReactNode> = {
        personalInfo: sectionVisibility?.personalInfo && (
            <header key="pi" className="mb-5">
                <h1 className="text-[30px] font-light tracking-tight text-slate-900">{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-slate-400">
                    {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                    {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
                    {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                </div>
            </header>
        ),
        summary: sectionVisibility?.summary && summary ? (<section key="s"><SH title="About" /><p className="text-[11.5px] leading-relaxed text-slate-600">{summary}</p></section>) : null,
        workExperience: sectionVisibility?.workExperience && workExperience?.length > 0 ? (
            <section key="w"><SH title="Experience" /><div className="space-y-4">{workExperience.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-semibold text-[12.5px] text-slate-800">{e.position}</h3><span className="text-[9.5px] text-slate-400">{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[10.5px] text-slate-500 mt-0.5">{e.company}{e.location ? `, ${e.location}` : ''}</p><p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{e.description}</p></div>
            ))}</div></section>) : null,
        education: sectionVisibility?.education && education?.length > 0 ? (
            <section key="ed"><SH title="Education" /><div className="space-y-3">{education.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-semibold text-[12px] text-slate-800">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ''}</h3><span className="text-[9.5px] text-slate-400">{e.startDate} — {e.endDate}</span></div><p className="text-[10.5px] text-slate-500">{e.school}{e.grade ? ` — GPA: ${e.grade}` : ''}</p></div>
            ))}</div></section>) : null,
        skills: sectionVisibility?.skills && skills?.length > 0 ? (
            <section key="sk"><SH title="Skills" /><div className="flex flex-wrap gap-2">{skills.map(s => (
                <span key={s.id} className="text-[10px] font-medium text-slate-600 px-3 py-1 border border-slate-200 rounded">{s.name}</span>
            ))}</div></section>) : null,
        projects: sectionVisibility?.projects && projects?.length > 0 ? (
            <section key="pj"><SH title="Projects" /><div className="space-y-3">{projects.map(p => (
                <div key={p.id}><h3 className="font-semibold text-[12px] text-slate-800 flex items-center gap-1">{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><p className="text-[10.5px] text-slate-600 mt-0.5">{p.description}</p></div>
            ))}</div></section>) : null,
        certifications: sectionVisibility?.certifications && certifications?.length > 0 ? (<section key="c"><SH title="Certifications" /><div className="space-y-1.5">{certifications.map(cert => (<div key={cert.id}><span className="text-[11px] font-medium text-slate-700">{cert.name}</span><span className="text-[10px] text-slate-400"> — {cert.issuer}, {cert.date}</span></div>))}</div></section>) : null,
        languages: sectionVisibility?.languages && languages?.length > 0 ? (<section key="l"><SH title="Languages" /><div className="flex gap-4">{languages.map(l => (<span key={l.id} className="text-[10.5px] text-slate-600">{l.name} <span className="text-slate-400">({l.proficiency})</span></span>))}</div></section>) : null,
        interests: sectionVisibility?.interests && interests?.length > 0 ? (<section key="i"><SH title="Interests" /><p className="text-[10.5px] text-slate-500">{interests.map(i => i.name).join(" • ")}</p></section>) : null,
        achievements: sectionVisibility?.achievements && achievements?.length > 0 ? (<section key="ac"><SH title="Achievements" /><div className="space-y-1">{achievements.map(a => (<p key={a.id} className="text-[10.5px] text-slate-600"><span className="font-semibold text-slate-800">{a.title}</span> — {a.description}</p>))}</div></section>) : null,
        volunteerWork: sectionVisibility?.volunteerWork && volunteerWork?.length > 0 ? (<section key="v"><SH title="Volunteer" /><div className="space-y-2">{volunteerWork.map(v => (<div key={v.id}><h3 className="font-semibold text-[11px] text-slate-800">{v.role} @ {v.organization}</h3><p className="text-[10px] text-slate-600 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>) : null,
        awards: sectionVisibility?.awards && awards?.length > 0 ? (<section key="aw"><SH title="Awards" /><div className="space-y-1">{awards.map(a => (<p key={a.id} className="text-[10.5px] text-slate-600"><span className="font-semibold text-slate-800">{a.title}</span> — {a.issuer}, {a.date}</p>))}</div></section>) : null,
    };

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || fontMap.inter, width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: theme?.viewMode === 'comfortable' ? "1in" : "0.6in" }}>
            {sectionOrder?.map(id => sections[id])}
        </div>
    );
}
