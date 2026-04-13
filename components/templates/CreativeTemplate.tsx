import { ResumeData } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon } from "lucide-react";

interface CreativeTemplateProps {
    data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
    const { personalInfo, workExperience, education, skills, projects } = data;

    return (
        <div className="w-full h-full bg-slate-50 text-slate-800 p-8 font-serif">
            {/* Header - Minimalist Centered */}
            <header className="text-center mb-10">
                <h1 className="text-5xl font-bold tracking-tighter text-indigo-600 mb-2">
                    {personalInfo.fullName}
                </h1>
                {personalInfo.jobTitle && (
                    <p className="text-xl italic text-slate-500">{personalInfo.jobTitle}</p>
                )}

                <div className="flex justify-center flex-wrap gap-4 mt-4 text-sm font-sans text-slate-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                    {personalInfo.linkedin && (
                        <span>• <a href={personalInfo.linkedin} className="text-indigo-500 hover:underline">LinkedIn</a></span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Column (Main Content) */}
                <div className="col-span-8 space-y-8">
                    {data.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-1 bg-indigo-500 block"></span>
                                Profile
                            </h2>
                            <p className="text-slate-600 leading-relaxed font-sans">
                                {data.summary}
                            </p>
                        </section>
                    )}

                    {workExperience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-indigo-500 block"></span>
                                Experience
                            </h2>
                            <div className="space-y-6 border-l-2 border-indigo-100 pl-6 ml-2">
                                {workExperience.map((job) => (
                                    <div key={job.id} className="relative">
                                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white"></span>
                                        <h3 className="text-xl font-bold text-slate-800">{job.position}</h3>
                                        <div className="text-indigo-600 font-medium font-sans mb-1">{job.company}</div>
                                        <div className="text-xs text-slate-400 font-sans uppercase tracking-widest mb-2">
                                            {job.startDate} — {job.endDate}
                                        </div>
                                        <p className="text-slate-600 font-sans text-sm leading-relaxed whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-indigo-500 block"></span>
                                Selected Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-4 font-sans">
                                {projects.map(p => (
                                    <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                        <h3 className="font-bold text-slate-800">{p.name}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column (Sidebar info) */}
                <div className="col-span-4 space-y-8 font-sans">
                    {skills.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 border-b-2 border-indigo-500 inline-block pb-1">
                                Expertise
                            </h3>
                            <div className="flex flex-col gap-2">
                                {skills.map(s => (
                                    <div key={s.id} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                        <span className="text-slate-700">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 border-b-2 border-indigo-500 inline-block pb-1">
                                Education
                            </h3>
                            <div className="space-y-4">
                                {education.map(e => (
                                    <div key={e.id}>
                                        <div className="font-bold text-slate-800">{e.school}</div>
                                        <div className="text-indigo-600 text-sm">{e.degree}</div>
                                        <div className="text-xs text-slate-400 mt-1">{e.startDate} - {e.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
