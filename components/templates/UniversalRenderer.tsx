import React from "react";
import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import {
    Mail, Phone, MapPin, Linkedin, Github, Globe, Award,
    Languages, Heart, Trophy, HandHeart, BookOpen, Medal, Link2, ExternalLink, Twitter
} from "lucide-react";

interface UniversalRendererProps {
    data: ResumeData;
    isPrint?: boolean;
}

const SectionHeading = ({ title, color }: { title: string; color: string }) => (
    <div className="flex items-center gap-3 mb-4 break-after-avoid">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800 whitespace-nowrap" style={{ color }}>{title}</h2>
        <div className="flex-1 h-[1px] bg-slate-200" />
    </div>
);

export default function UniversalRenderer({ data, isPrint }: UniversalRendererProps) {
    const {
        personalInfo, summary, workExperience, education, skills, projects,
        certifications, languages, interests, achievements, volunteerWork,
        publications, awards, socialLinks, customSections,
        sectionOrder, sectionVisibility, theme
    } = data;

    const activeColor = theme?.accentColor || '#6366f1';

    const renderSection = (sectionId: string) => {
        if (!sectionVisibility?.[sectionId]) return null;

        switch (sectionId) {
            case 'personalInfo':
                return (
                    <header key="personal" className="mb-8 text-center">
                        {personalInfo.photo && (
                            <div className="flex justify-center mb-5">
                                <img
                                    src={personalInfo.photo}
                                    alt={personalInfo.fullName}
                                    className={cn(
                                        "w-28 h-28 object-cover border-4 border-white shadow-lg",
                                        personalInfo.photoShape === 'circle' ? "rounded-full" :
                                            personalInfo.photoShape === 'rounded' ? "rounded-2xl" : "rounded-none"
                                    )}
                                />
                            </div>
                        )}
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                            {personalInfo.fullName || "Your Name"}
                        </h1>
                        <p className="text-lg font-medium tracking-wide mb-3" style={{ color: activeColor }}>
                            {personalInfo.jobTitle || "Job Title"}
                        </p>
                        <div className="flex flex-wrap justify-center gap-y-1.5 gap-x-5 text-[11px] text-slate-500 font-medium">
                            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</a>}
                            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                            {personalInfo.website && <a href={personalInfo.website} className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</a>}
                            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                            {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                        </div>
                    </header>
                );

            case 'summary':
                return summary ? (
                    <section key="summary" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Professional Summary" color={activeColor} />
                        <p className="text-[13px] leading-relaxed text-slate-600 text-justify">{summary}</p>
                    </section>
                ) : null;

            case 'workExperience':
                return workExperience?.length > 0 ? (
                    <section key="work" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Work Experience" color={activeColor} />
                        <div className="space-y-5">
                            {workExperience.map((exp) => (
                                <div key={exp.id} className="group">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-[14px]">{exp.position}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded shrink-0 ml-2">
                                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[12px] font-semibold mb-1.5" style={{ color: activeColor }}>
                                        {exp.company} {exp.location && `• ${exp.location}`}
                                    </div>
                                    <div className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'education':
                return education?.length > 0 ? (
                    <section key="education" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Education" color={activeColor} />
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-[14px]">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded shrink-0 ml-2">
                                            {edu.startDate} — {edu.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[12px] font-semibold mb-1" style={{ color: activeColor }}>
                                        {edu.school} {edu.grade && `• GPA: ${edu.grade}`}
                                    </div>
                                    {edu.description && <p className="text-[12px] text-slate-600 leading-relaxed">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'skills':
                return skills?.length > 0 ? (
                    <section key="skills" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Skills" color={activeColor} />
                        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                            {skills.map((skill) => (
                                <div key={skill.id} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-bold text-slate-700">{skill.name}</span>
                                        <span className="text-[9px] font-bold text-slate-400">{skill.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${skill.percentage}%`, backgroundColor: activeColor }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'projects':
                return projects?.length > 0 ? (
                    <section key="projects" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Key Projects" color={activeColor} />
                        <div className="space-y-4">
                            {projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">
                                            {proj.name}
                                            {proj.link && <ExternalLink className="w-3 h-3 text-slate-400" />}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-1.5">
                                        {proj.technologies?.map((tech, i) => (
                                            <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">{tech}</span>
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-slate-600 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'certifications':
                return certifications?.length > 0 ? (
                    <section key="certs" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Certifications" color={activeColor} />
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="flex items-start gap-2">
                                    <Award className="w-4 h-4 mt-0.5 shrink-0" style={{ color: activeColor }} />
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-[13px]">{cert.name}</h3>
                                        <p className="text-[11px] text-slate-500">{cert.issuer} • {cert.date}</p>
                                        {cert.credentialId && <p className="text-[10px] text-slate-400">ID: {cert.credentialId}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'languages':
                return languages?.length > 0 ? (
                    <section key="langs" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Languages" color={activeColor} />
                        <div className="flex flex-wrap gap-3">
                            {languages.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                                    <span className="text-[12px] font-bold text-slate-700">{lang.name}</span>
                                    <span className="text-[10px] text-slate-400 capitalize">({lang.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'interests':
                return interests?.length > 0 ? (
                    <section key="interests" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Interests" color={activeColor} />
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <span key={interest.id} className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                                    {interest.name}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'achievements':
                return achievements?.length > 0 ? (
                    <section key="achievements" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Achievements" color={activeColor} />
                        <div className="space-y-3">
                            {achievements.map((a) => (
                                <div key={a.id} className="flex items-start gap-2">
                                    <Trophy className="w-4 h-4 mt-0.5 shrink-0" style={{ color: activeColor }} />
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-[13px]">{a.title}</h3>
                                        {a.date && <p className="text-[10px] text-slate-400 mb-0.5">{a.date}</p>}
                                        <p className="text-[12px] text-slate-600">{a.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'volunteerWork':
                return volunteerWork?.length > 0 ? (
                    <section key="volunteer" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Volunteer Experience" color={activeColor} />
                        <div className="space-y-4">
                            {volunteerWork.map((v) => (
                                <div key={v.id}>
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-[14px]">{v.role}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded shrink-0 ml-2">
                                            {v.startDate} — {v.current ? "Present" : v.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[12px] font-semibold mb-1" style={{ color: activeColor }}>{v.organization}</div>
                                    <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap">{v.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'publications':
                return publications?.length > 0 ? (
                    <section key="pubs" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Publications" color={activeColor} />
                        <div className="space-y-3">
                            {publications.map((pub) => (
                                <div key={pub.id}>
                                    <h3 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5">
                                        {pub.title}
                                        {pub.link && <ExternalLink className="w-3 h-3 text-slate-400" />}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">{pub.publisher} • {pub.date}</p>
                                    {pub.description && <p className="text-[11px] text-slate-600 mt-0.5">{pub.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'awards':
                return awards?.length > 0 ? (
                    <section key="awards" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Awards & Honors" color={activeColor} />
                        <div className="space-y-3">
                            {awards.map((a) => (
                                <div key={a.id} className="flex items-start gap-2">
                                    <Medal className="w-4 h-4 mt-0.5 shrink-0" style={{ color: activeColor }} />
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-[13px]">{a.title}</h3>
                                        <p className="text-[11px] text-slate-500">{a.issuer} • {a.date}</p>
                                        {a.description && <p className="text-[11px] text-slate-600 mt-0.5">{a.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'socialLinks':
                return socialLinks?.length > 0 ? (
                    <section key="social" className="mb-7 break-inside-avoid">
                        <SectionHeading title="Links" color={activeColor} />
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((link) => (
                                <a key={link.id} href={link.url} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Link2 className="w-3 h-3" />
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'customSections':
                return customSections?.length > 0 ? (
                    <div key="custom">
                        {customSections.map((section) => (
                            <section key={section.id} className="mb-7 break-inside-avoid">
                                <SectionHeading title={section.title} color={activeColor} />
                                <div className="space-y-4">
                                    {section.items?.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h3 className="font-bold text-slate-800 text-[14px]">{item.title}</h3>
                                                {item.date && (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded shrink-0 ml-2">
                                                        {item.date}
                                                    </span>
                                                )}
                                            </div>
                                            {item.subtitle && <div className="text-[12px] font-semibold mb-1" style={{ color: activeColor }}>{item.subtitle}</div>}
                                            <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : null;

            default:
                return null;
        }
    };

    const fontMap: Record<string, string> = {
        inter: "'Inter', sans-serif",
        merriweather: "'Merriweather', serif",
        roboto: "'Roboto', sans-serif",
        playfair: "'Playfair Display', serif",
        poppins: "'Poppins', sans-serif",
        lato: "'Lato', sans-serif",
        opensans: "'Open Sans', sans-serif",
        montserrat: "'Montserrat', sans-serif",
    };

    return (
        <div
            className={cn(
                "bg-white mx-auto shadow-inner transition-all duration-300",
                isPrint ? "print-area" : "",
                theme?.viewMode === 'comfortable' ? "p-[1in]" : "p-[0.5in]"
            )}
            style={{
                fontFamily: fontMap[theme?.font] || fontMap.inter,
                width: isPrint ? "210mm" : "21cm",
                minHeight: isPrint ? "297mm" : "29.7cm",
            }}
        >
            {sectionOrder?.map(sectionId => renderSection(sectionId))}
        </div>
    );
}
