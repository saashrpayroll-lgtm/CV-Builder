import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface Props { data: ResumeData; isPrint?: boolean; }

export default function ATSTemplate({ data, isPrint }: Props) {
    const { personalInfo, summary, workExperience, education, skills, projects, certifications, languages, achievements, volunteerWork, awards, sectionOrder, sectionVisibility, theme } = data;
    const fontMap: Record<string, string> = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif", roboto: "'Roboto', sans-serif", playfair: "'Playfair Display', serif", poppins: "'Poppins', sans-serif", lato: "'Lato', sans-serif", opensans: "'Open Sans', sans-serif", montserrat: "'Montserrat', sans-serif" };

    const SH = ({ title }: { title: string }) => (<div className="mb-2 mt-4 border-b-2 border-black pb-0.5"><h2 className="text-[13px] font-bold uppercase">{title}</h2></div>);

    const sections: Record<string, React.ReactNode> = {
        personalInfo: sectionVisibility?.personalInfo && (
            <header key="pi" className="text-center mb-3">
                <h1 className="text-[22px] font-bold uppercase tracking-wide">{personalInfo.fullName || "YOUR NAME"}</h1>
                <p className="text-[12px] mt-0.5">{personalInfo.jobTitle}</p>
                <p className="text-[10px] mt-1">
                    {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website, personalInfo.linkedin, personalInfo.github].filter(Boolean).join(" | ")}
                </p>
            </header>
        ),
        summary: sectionVisibility?.summary && summary ? (<section key="s"><SH title="Summary" /><p className="text-[11px] leading-[1.6] mt-1">{summary}</p></section>) : null,
        workExperience: sectionVisibility?.workExperience && workExperience?.length > 0 ? (
            <section key="w"><SH title="Professional Experience" /><div className="space-y-3 mt-1">{workExperience.map(e => (
                <div key={e.id}><div className="flex justify-between"><span className="font-bold text-[12px]">{e.position}</span><span className="text-[10px]">{e.startDate} - {e.current ? "Present" : e.endDate}</span></div><div className="flex justify-between"><span className="text-[11px] italic">{e.company}{e.location ? `, ${e.location}` : ''}</span></div><p className="text-[10.5px] mt-1 leading-[1.5] whitespace-pre-wrap">{e.description}</p></div>
            ))}</div></section>) : null,
        education: sectionVisibility?.education && education?.length > 0 ? (
            <section key="ed"><SH title="Education" /><div className="space-y-2 mt-1">{education.map(e => (
                <div key={e.id}><div className="flex justify-between"><span className="font-bold text-[11.5px]">{e.degree}{e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''}</span><span className="text-[10px]">{e.startDate} - {e.endDate}</span></div><p className="text-[10.5px] italic">{e.school}{e.grade ? ` | GPA: ${e.grade}` : ''}</p></div>
            ))}</div></section>) : null,
        skills: sectionVisibility?.skills && skills?.length > 0 ? (
            <section key="sk"><SH title="Skills" /><p className="text-[10.5px] mt-1">{skills.map(s => s.name).join(" | ")}</p></section>) : null,
        projects: sectionVisibility?.projects && projects?.length > 0 ? (
            <section key="pj"><SH title="Projects" /><div className="space-y-2 mt-1">{projects.map(p => (
                <div key={p.id}><span className="font-bold text-[11px]">{p.name}</span>{p.technologies?.length > 0 && <span className="text-[10px]"> ({p.technologies.join(", ")})</span>}<p className="text-[10.5px] mt-0.5">{p.description}</p></div>
            ))}</div></section>) : null,
        certifications: sectionVisibility?.certifications && certifications?.length > 0 ? (<section key="c"><SH title="Certifications" /><div className="mt-1">{certifications.map(cert => (<p key={cert.id} className="text-[10.5px]">{cert.name} - {cert.issuer}, {cert.date}</p>))}</div></section>) : null,
        languages: sectionVisibility?.languages && languages?.length > 0 ? (<section key="l"><SH title="Languages" /><p className="text-[10.5px] mt-1">{languages.map(l => `${l.name} (${l.proficiency})`).join(" | ")}</p></section>) : null,
        achievements: sectionVisibility?.achievements && achievements?.length > 0 ? (<section key="ac"><SH title="Achievements" /><div className="mt-1">{achievements.map(a => (<p key={a.id} className="text-[10.5px]">• {a.title}{a.description ? ` - ${a.description}` : ''}</p>))}</div></section>) : null,
        volunteerWork: sectionVisibility?.volunteerWork && volunteerWork?.length > 0 ? (<section key="v"><SH title="Volunteer Experience" /><div className="space-y-2 mt-1">{volunteerWork.map(v => (<div key={v.id}><div className="flex justify-between"><span className="font-bold text-[11px]">{v.role}, {v.organization}</span><span className="text-[10px]">{v.startDate} - {v.current ? "Present" : v.endDate}</span></div><p className="text-[10.5px] whitespace-pre-wrap">{v.description}</p></div>))}</div></section>) : null,
        awards: sectionVisibility?.awards && awards?.length > 0 ? (<section key="aw"><SH title="Awards" /><div className="mt-1">{awards.map(a => (<p key={a.id} className="text-[10.5px]">{a.title} - {a.issuer}, {a.date}</p>))}</div></section>) : null,
    };

    return (
        <div className={cn("bg-white mx-auto text-black", isPrint && "print-area")} style={{ fontFamily: fontMap[theme?.font] || "'Inter', sans-serif", width: isPrint ? "210mm" : "21cm", minHeight: isPrint ? "297mm" : "29.7cm", padding: theme?.viewMode === 'comfortable' ? "0.75in" : "0.5in" }}>
            {sectionOrder?.map(id => sections[id])}
        </div>
    );
}
