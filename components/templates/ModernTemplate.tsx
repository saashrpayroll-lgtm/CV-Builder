import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";

interface ModernTemplateProps {
    data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
    const { personalInfo, workExperience, education, skills, projects } = data;

    return (
        <div className="w-full h-full bg-white text-gray-800 p-8 font-sans">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-5 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900">
                    {personalInfo.fullName}
                </h1>
                {personalInfo.jobTitle && (
                    <p className="text-xl text-slate-600 mt-1">{personalInfo.jobTitle}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-slate-600">
                    {personalInfo.email && (
                        <span className="flex items-center gap-1">
                            <span>@</span> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1">
                            <span>📞</span> {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1">
                            <span>📍</span> {personalInfo.location}
                        </span>
                    )}
                    {personalInfo.linkedin && (
                        <span className="flex items-center gap-1">
                            <span>🔗</span> {personalInfo.linkedin.replace(/^https?:\/\//, '')}
                        </span>
                    )}
                </div>
            </header>

            <div className="flex gap-8">
                {/* Main Column */}
                <div className="w-2/3 space-y-6">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">About Me</h2>
                            <p className="text-sm leading-relaxed text-slate-700">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {workExperience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Experience</h2>
                            <div className="space-y-5">
                                {workExperience.map((job) => (
                                    <div key={job.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-800 text-lg">{job.position}</h3>
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {job.startDate} — {job.endDate}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600 font-medium mb-2">{job.company}</div>
                                        <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                            {job.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education - If main col specific or just flow */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                            <span className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <div className="text-sm text-slate-600">{edu.degree} in {edu.fieldOfStudy}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Projects</h2>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{project.name}</h3>
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                                                Link
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                        {project.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sidebar Column */}
                <div className="w-1/3 space-y-8">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span key={skill.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Link to Website / Portfolio if exists */}
                    {personalInfo.website && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Portfolio</h2>
                            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">
                                {personalInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
