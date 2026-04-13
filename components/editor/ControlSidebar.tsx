"use client"

import { useResumeStore } from "@/store/useResumeStore";
import {
    GripVertical, Eye, EyeOff, Sparkles, Plus, Settings2,
    SpellCheck, Type, ChevronDown, ChevronUp, Layout, Palette,
    Briefcase, GraduationCap, FolderKanban, Award, Languages,
    Heart, Trophy, HandHeart, BookOpen, Medal, Link2, FileText,
    Users, BookOpenCheck, Trash2
} from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { SummaryForm } from "./forms/SummaryForm";
import { EducationForm } from "./forms/EducationForm";
import { WorkExperienceForm } from "./forms/WorkExperienceForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { CustomSectionForm } from "./forms/CustomSectionForm";
import { CertificationsForm } from "./forms/CertificationsForm";
import { LanguagesForm } from "./forms/LanguagesForm";
import { InterestsForm } from "./forms/InterestsForm";
import { AchievementsForm } from "./forms/AchievementsForm";
import { VolunteerForm } from "./forms/VolunteerForm";
import { PublicationsForm } from "./forms/PublicationsForm";
import { AwardsForm } from "./forms/AwardsForm";
import { SocialLinksForm } from "./forms/SocialLinksForm";
import { CoverLetterForm } from "./forms/CoverLetterForm";
import { ReferencesForm } from "./forms/ReferencesForm";
import { CourseworkForm } from "./forms/CourseworkForm";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AIPolishModal } from "./AIPolishModal";

const SECTION_LABELS: Record<string, { label: string; icon: any; component: any }> = {
    personalInfo: { label: "Heading", icon: Type, component: PersonalInfoForm },
    summary: { label: "Professional Summary", icon: SpellCheck, component: SummaryForm },
    skills: { label: "Skills & Abilities", icon: Settings2, component: SkillsForm },
    workExperience: { label: "Work Experience", icon: Briefcase, component: WorkExperienceForm },
    education: { label: "Education", icon: GraduationCap, component: EducationForm },
    projects: { label: "Projects", icon: FolderKanban, component: ProjectsForm },
    certifications: { label: "Certifications", icon: Award, component: CertificationsForm },
    languages: { label: "Languages", icon: Languages, component: LanguagesForm },
    interests: { label: "Interests / Hobbies", icon: Heart, component: InterestsForm },
    achievements: { label: "Achievements", icon: Trophy, component: AchievementsForm },
    volunteerWork: { label: "Volunteer Work", icon: HandHeart, component: VolunteerForm },
    publications: { label: "Publications", icon: BookOpen, component: PublicationsForm },
    awards: { label: "Awards & Honors", icon: Medal, component: AwardsForm },
    socialLinks: { label: "Social Links", icon: Link2, component: SocialLinksForm },
    references: { label: "References", icon: Users, component: ReferencesForm },
    coursework: { label: "Coursework / Training", icon: BookOpenCheck, component: CourseworkForm },
    customSections: { label: "Custom Sections", icon: Plus, component: CustomSectionForm },
    coverLetter: { label: "Cover Letter", icon: FileText, component: CoverLetterForm },
};

export function ControlSidebar() {
    const { data, reorderSections, toggleSection, addSection, removeSection } = useResumeStore();
    const [activeTab, setActiveTab] = useState<"content" | "design">("content");
    const [expandedSection, setExpandedSection] = useState<string | null>("personalInfo");
    const [isAIPolishOpen, setIsAIPolishOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleReorder = (newOrder: string[]) => {
        reorderSections(newOrder);
    };

    const visibleSections = data.sectionOrder.filter(id => SECTION_LABELS[id]);
    const hiddenSections = Object.keys(SECTION_LABELS).filter(
        id => !data.sectionOrder.includes(id) || !data.sectionVisibility[id]
    );

    return (
        <div className="w-full border-l bg-indigo-950 text-white flex flex-col h-full overflow-hidden shadow-2xl">
            {/* TABS */}
            <div className="flex bg-indigo-900/50 p-1 m-4 rounded-xl border border-white/5">
                <button
                    onClick={() => setActiveTab("content")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                        activeTab === "content" ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <Layout className="w-3.5 h-3.5" /> Content
                </button>
                <button
                    onClick={() => setActiveTab("design")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                        activeTab === "design" ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <Palette className="w-3.5 h-3.5" /> Design
                </button>
            </div>

            {activeTab === "content" ? (
                <>
                    <div className="px-5 pb-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-xs uppercase tracking-widest text-white/40">Sections</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold text-indigo-400 hover:bg-white/5 uppercase tracking-wider"
                            onClick={() => setIsAIPolishOpen(true)}
                        >
                            <Sparkles className="w-3 h-3 mr-1.5" /> AI Polish
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 custom-scrollbar">
                        <Reorder.Group axis="y" values={visibleSections} onReorder={handleReorder} className="space-y-2">
                            {visibleSections.map((sectionId) => {
                                const section = SECTION_LABELS[sectionId];
                                if (!section) return null;
                                const isExpanded = expandedSection === sectionId;
                                const isVisible = data.sectionVisibility[sectionId];
                                const SectionIcon = section.icon;

                                return (
                                    <Reorder.Item
                                        key={sectionId}
                                        value={sectionId}
                                        className={cn(
                                            "rounded-xl transition-all border border-white/5",
                                            isExpanded ? "bg-white/10 shadow-lg ring-1 ring-white/20" : "bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="p-3 flex items-center gap-2.5 select-none">
                                            <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                                isVisible ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/20"
                                            )}>
                                                <SectionIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <div
                                                className="flex-1 font-semibold text-sm cursor-pointer py-1"
                                                onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                                            >
                                                {section.label}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleSection(sectionId); }}
                                                    className={cn("p-1.5 rounded-lg transition-colors", isVisible ? "text-indigo-400" : "text-white/10 hover:text-white/40")}
                                                    title={isVisible ? "Hide on resume" : "Show on resume"}
                                                >
                                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeSection(sectionId); }}
                                                    className="p-1.5 rounded-lg text-white/10 hover:text-red-400 transition-colors"
                                                    title="Delete section"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                                                    className="p-1.5 text-white/20 hover:text-white"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-white/5 rounded-b-xl border-t border-white/5"
                                                >
                                                    <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                                        {section.component && <section.component />}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Reorder.Item>
                                );
                            })}
                        </Reorder.Group>

                        {/* Add Section Button */}
                        <div className="relative mt-4">
                            <Button
                                onClick={() => setShowAddModal(!showAddModal)}
                                className="w-full bg-white/5 hover:bg-white/10 text-white/60 border border-white/5 border-dashed gap-2 h-12 font-bold rounded-xl text-xs uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" />
                                {showAddModal ? "Close" : "Add Section"}
                            </Button>

                            <AnimatePresence>
                                {showAddModal && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 bg-indigo-900/80 backdrop-blur-xl rounded-xl border border-white/10 p-3 space-y-1"
                                    >
                                        {Object.entries(SECTION_LABELS).map(([id, sec]) => {
                                            const isActive = data.sectionVisibility[id];
                                            if (isActive) return null;
                                            const Icon = sec.icon;
                                            return (
                                                <button
                                                    key={id}
                                                    onClick={() => { addSection(id); setShowAddModal(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <Icon className="w-4 h-4 text-indigo-400" />
                                                    {sec.label}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <ThemeSwitcher />
                </div>
            )}

            <div className="p-4 border-t border-white/5 bg-indigo-950/80 backdrop-blur-md">
                <Button
                    onClick={() => setIsAIPolishOpen(true)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold uppercase tracking-tight h-12 shadow-2xl rounded-xl"
                >
                    <Sparkles className="w-4 h-4 mr-2" /> Global AI Polish
                </Button>
            </div>

            <AIPolishModal isOpen={isAIPolishOpen} onClose={() => setIsAIPolishOpen(false)} />
        </div>
    );
}
