import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon } from "lucide-react";

interface ProfessionalTemplateProps {
    data: ResumeData;
}

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
    const { personalInfo, workExperience, education, skills, projects, customSections } = data;

    return (
        <div className="w-full h-full bg-white text-slate-800 flex font-sans">
            {/* Left Sidebar - 30% width */}
            <div className="w-[30%] bg-slate-900 text-white min-h-screen p-6 flex flex-col gap-6">
                {/* Profile Photo Placeholder if needed */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight uppercase">
                        {personalInfo.fullName}
                    </h1>
                    {personalInfo.jobTitle && (
                        <p className="text-slate-400 font-medium mt-1">{personalInfo.jobTitle}</p>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                    {personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="break-all">{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-slate-400" />
                            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-300 truncate">
                                LinkedIn
                            </a>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-slate-400" />
                            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:text-slate-300 truncate">
                                Portfolio
                            </a>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {(skills && skills.length > 0) && (
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-3">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span key={skill.id} className="bg-slate-800 px-2 py-1 rounded text-xs">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education (Sidebar style) */}
                {(education && education.length > 0) && (
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-3">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="font-bold text-sm">{edu.school}</div>
                                    <div className="text-xs text-slate-400">{edu.degree}</div>
                                    <div className="text-xs text-slate-500 italic">
                                        {edu.startDate} - {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Right Content - 70% width */}
            <div className="w-[70%] p-8 space-y-8">

                {/* Summary */}
                {data.summary && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 mb-3">
                            Profile
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {data.summary}
                        </p>
                    </section>
                )}

                {/* Work Experience */}
                {(workExperience && workExperience.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 mb-4">
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {workExperience.map((job) => (
                                <div key={job.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{job.position}</h3>
                                        <span className="text-sm font-semibold text-slate-500">
                                            {job.startDate} — {job.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 font-bold mb-2">{job.company}</div>
                                    <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                        {job.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {(projects && projects.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 mb-4">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <h3 className="font-bold text-slate-800">{project.name}</h3>
                                    <p className="text-sm text-slate-600">{project.description}</p>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline mt-1 block">
                                            View Project
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
