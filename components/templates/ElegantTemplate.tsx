import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ElegantTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, interests, achievements, volunteerWork, awards, sectionOrder, sectionVisibility, theme } = data;
    const c = theme?.accentColor || '#991b1b';
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title }: { title: string }) => (
        <div className="mb-4 mt-1 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            <h2 className="text-[14px] font-semibold tracking-wide" style={{ color: c, fontFamily: "'Playfair Display', serif" }}>{title}</h2>
            <div className="flex-1 h-[0.5px]" style={{ backgroundColor: c + '30' }} />
        </div>
    );

    const sections: Record<string, React.ReactNode> = {
        personalInfo: sectionVisibility?.personalInfo && (
            <header key="pi" className="text-center mb-7 pt-2">
                <h1 className="text-[32px] font-semibold tracking-wide text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>{personalInfo.fullName || "Your Name"}</h1>
                <p className="text-[13px] tracking-[0.3em] uppercase mt-1" style={{ color: c }}>{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-[10px] text-slate-500">
                    {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                    {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
                    {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                </div>
                <div className="mt-4 mx-auto w-20 h-[1px]" style={{ backgroundColor: c }} />
            </header>
        ),
        summary: sectionVisibility?.summary && summary ? (<section key="s"><SH title="Profile" /><p className="text-[11.5px] leading-[1.8] text-slate-600 italic px-4">{summary}</p></section>) : null,
        workExperience: sectionVisibility?.workExperience && workExperience?.length > 0 ? (
            <section key="w"><SH title="Professional Experience" /><div className="space-y-5">{workExperience.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-semibold text-[13px] text-slate-800">{e.position}</h3><span className="text-[9.5px] text-slate-400 italic">{e.startDate} — {e.current ? "Present" : e.endDate}</span></div><p className="text-[11px] mt-0.5" style={{ color: c }}>{e.company}{e.location ? ` — ${e.location}` : ''}</p><p className="text-[10.5px] text-slate-600 mt-1.5 leading-[1.7] whitespace-pre-wrap">{e.description}</p></div>
            ))}</div></section>) : null,
        education: sectionVisibility?.education && education?.length > 0 ? (
            <section key="ed"><SH title="Education" /><div className="space-y-3">{education.map(e => (
                <div key={e.id}><div className="flex justify-between items-baseline"><h3 className="font-semibold text-[12px] text-slate-800">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ''}</h3><span className="text-[9.5px] text-slate-400 italic">{e.startDate} — {e.endDate}</span></div><p className="text-[10.5px]" style={{ color: c }}>{e.school}{e.grade ? ` — GPA: ${e.grade}` : ''}</p></div>
            ))}</div></section>) : null,
        skills: sectionVisibility?.skills && skills?.length > 0 ? (
            <section key="sk"><SH title="Competencies" /><div className="flex flex-wrap gap-2 px-2">{skills.map(s => (
                <span key={s.id} className="text-[10px] px-3 py-1 border rounded-sm text-slate-600" style={{ borderColor: c + '30' }}>{s.name}</span>
            ))}</div></section>) : null,
        projects: sectionVisibility?.projects && projects?.length > 0 ? (
            <section key="pj"><SH title="Notable Projects" /><div className="space-y-3">{projects.map(p => (
                <div key={p.id}><h3 className="font-semibold text-[12px] text-slate-800 flex items-center gap-1" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}{p.link && <ExternalLink className="w-3 h-3 text-slate-400" />}</h3><p className="text-[10.5px] text-slate-600 mt-0.5 leading-[1.7]">{p.description}</p></div>
            ))}</div></section>) : null,
        certifications: sectionVisibility?.certifications && certifications?.length > 0 ? (<section key="c"><SH title="Certifications" /><div className="space-y-1.5 px-2">{certifications.map(cert => (<p key={cert.id} className="text-[10.5px] text-slate-600"><span className="font-semibold text-slate-800">{cert.name}</span> — {cert.issuer}, {cert.date}</p>))}</div></section>) : null,
        languages: sectionVisibility?.languages && languages?.length > 0 ? (<section key="l"><SH title="Languages" /><p className="text-[10.5px] text-slate-600 px-2">{languages.map(l => `${l.name} (${l.proficiency})`).join(" • ")}</p></section>) : null,
        interests: sectionVisibility?.interests && interests?.length > 0 ? (<section key="i"><SH title="Interests" /><p className="text-[10.5px] text-slate-500 italic px-2">{interests.map(i => i.name).join(" • ")}</p></section>) : null,
        achievements: sectionVisibility?.achievements && achievements?.length > 0 ? (<section key="ac"><SH title="Achievements" /><div className="space-y-1 px-2">{achievements.map(a => (<p key={a.id} className="text-[10.5px] text-slate-600"><span className="font-semibold text-slate-800">{a.title}</span> — {a.description}</p>))}</div></section>) : null,
        volunteerWork: sectionVisibility?.volunteerWork && volunteerWork?.length > 0 ? (<section key="v"><SH title="Community Service" /><div className="space-y-2 px-2">{volunteerWork.map(v => (<div key={v.id}><h3 className="font-semibold text-[11px] text-slate-800">{v.role}, <span style={{ color: c }}>{v.organization}</span></h3><p className="text-[10px] text-slate-600 whitespace-pre-wrap">{v.description}</p></div>))}</div></section>) : null,
        awards: sectionVisibility?.awards && awards?.length > 0 ? (<section key="aw"><SH title="Honors & Awards" /><div className="space-y-1 px-2">{awards.map(a => (<p key={a.id} className="text-[10.5px] text-slate-600"><span className="font-semibold text-slate-800">{a.title}</span> — {a.issuer}, {a.date}</p>))}</div></section>) : null,
    };

    return (
        <div className={cn("bg-white mx-auto", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || "'Playfair Display', serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: theme?.viewMode === 'comfortable' ? "1in" : "0.6in", background: "#fffdf7" }}>
            {sectionOrder?.map(id => sections[id])}
        </div>
    );
}
