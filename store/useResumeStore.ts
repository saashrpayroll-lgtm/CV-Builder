import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Type Definitions ─── //

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location?: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade?: string;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    percentage: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link?: string;
    technologies: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    link?: string;
    credentialId?: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
}

export interface Interest {
    id: string;
    name: string;
    icon?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    date?: string;
}

export interface VolunteerWork {
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Publication {
    id: string;
    title: string;
    publisher: string;
    date: string;
    link?: string;
    description?: string;
}

export interface Award {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    icon?: string;
}

export interface CustomSectionItem {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description: string;
}

export interface Reference {
    id: string;
    name: string;
    position: string;
    company: string;
    email?: string;
    phone?: string;
}

export interface Coursework {
    id: string;
    course: string;
    institution: string;
    date?: string;
    skills?: string;
}

export interface CustomSection {
    id: string;
    title: string;
    items: CustomSectionItem[];
}

export interface ResumeData {
    id?: string;
    title: string;
    templateId: string;
    sectionOrder: string[];
    sectionVisibility: Record<string, boolean>;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        jobTitle: string;
        photo?: string;
        photoShape: 'circle' | 'square' | 'rounded';
        website?: string;
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    summary: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
    interests: Interest[];
    achievements: Achievement[];
    volunteerWork: VolunteerWork[];
    publications: Publication[];
    awards: Award[];
    socialLinks: SocialLink[];
    customSections: CustomSection[];
    references: Reference[];
    coursework: Coursework[];
    coverLetter: string;
    theme: {
        font: string;
        accentColor: string;
        viewMode: 'comfortable' | 'standard' | 'compact';
        fontSize: 'small' | 'medium' | 'large';
    };
}

interface ResumeState {
    data: ResumeData;
    isPro: boolean;
    isLoading: boolean;
    isSaving: boolean;
    lastSaved: string | null;
    aiCreditsUsed: number;
    exportCredits: number;
    monetizationSettings: Record<string, string | number | boolean | null> | null;

    // Actions
    setIsPro: (isPro: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsSaving: (isSaving: boolean) => void;
    setResumeData: (data: Partial<ResumeData>) => void;
    updateSection: <K extends keyof ResumeData>(section: K, value: ResumeData[K]) => void;
    updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
    updateTheme: (theme: Partial<ResumeData['theme']>) => void;
    toggleSection: (sectionId: string) => void;
    addSection: (sectionId: string) => void;
    removeSection: (sectionId: string) => void;
    reorderSections: (newOrder: string[]) => void;
    resetResume: () => void;
    loadResume: (data: ResumeData) => void;
    incrementAiCredits: () => void;
    markSaved: () => void;
    setExportCredits: (credits: number) => void;
    setMonetizationSettings: (settings: Record<string, string | number | boolean | null> | null) => void;
}

export const ALL_SECTIONS = [
    { id: 'personalInfo', label: 'Heading', required: true },
    { id: 'summary', label: 'Professional Summary', required: true },
    { id: 'skills', label: 'Skills & Abilities', required: true },
    { id: 'workExperience', label: 'Work Experience', required: true },
    { id: 'education', label: 'Education', required: true },
    { id: 'projects', label: 'Projects', required: false },
    { id: 'certifications', label: 'Certifications', required: false },
    { id: 'languages', label: 'Languages', required: false },
    { id: 'interests', label: 'Interests / Hobbies', required: false },
    { id: 'achievements', label: 'Achievements', required: false },
    { id: 'volunteerWork', label: 'Volunteer Work', required: false },
    { id: 'publications', label: 'Publications', required: false },
    { id: 'awards', label: 'Awards & Honors', required: false },
    { id: 'socialLinks', label: 'Social Links', required: false },
    { id: 'references', label: 'References', required: false },
    { id: 'coursework', label: 'Coursework / Training', required: false },
    { id: 'customSections', label: 'Custom Sections', required: false },
];

export const initialResumeData: ResumeData = {
    title: 'Untitled Resume',
    templateId: 'modern-1',
    sectionOrder: [
        'personalInfo', 'summary', 'skills', 'workExperience',
        'education', 'projects', 'certifications', 'languages',
        'interests', 'achievements', 'volunteerWork', 'publications',
        'awards', 'socialLinks', 'references', 'coursework', 'customSections'
    ],
    sectionVisibility: {
        personalInfo: true,
        summary: true,
        skills: true,
        workExperience: true,
        education: true,
        projects: true,
        certifications: false,
        languages: false,
        interests: false,
        achievements: false,
        volunteerWork: false,
        publications: false,
        awards: false,
        socialLinks: false,
        references: false,
        coursework: false,
        customSections: false,
    },
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        jobTitle: '',
        photoShape: 'circle',
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    achievements: [],
    volunteerWork: [],
    publications: [],
    awards: [],
    socialLinks: [],
    references: [],
    coursework: [],
    customSections: [],
    coverLetter: '',
    theme: {
        font: 'inter',
        accentColor: '#6366f1',
        viewMode: 'standard',
        fontSize: 'medium',
    },
};

export const useResumeStore = create<ResumeState>()(
    persist(
        (set) => ({
            data: initialResumeData,
            isPro: false,
            isLoading: false,
            isSaving: false,
            lastSaved: null,
            aiCreditsUsed: 0,
            exportCredits: 0,
            monetizationSettings: null,

            setIsPro: (isPro) => set({ isPro }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setIsSaving: (isSaving) => set({ isSaving }),

            setResumeData: (data) =>
                set((state) => ({
                    data: { ...state.data, ...data },
                })),

            updateSection: (section, value) =>
                set((state) => ({
                    data: { ...state.data, [section]: value },
                })),

            updatePersonalInfo: (info) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        personalInfo: { ...state.data.personalInfo, ...info },
                    },
                })),

            updateTheme: (theme) =>
                set((state) => ({
                    data: { ...state.data, theme: { ...state.data.theme, ...theme } },
                })),

            toggleSection: (sectionId) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        sectionVisibility: {
                            ...state.data.sectionVisibility,
                            [sectionId]: !state.data.sectionVisibility[sectionId],
                        },
                    },
                })),

            addSection: (sectionId) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        sectionOrder: state.data.sectionOrder.includes(sectionId)
                            ? state.data.sectionOrder
                            : [...state.data.sectionOrder, sectionId],
                        sectionVisibility: {
                            ...state.data.sectionVisibility,
                            [sectionId]: true,
                        },
                    },
                })),

            removeSection: (sectionId) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        sectionOrder: state.data.sectionOrder.filter(id => id !== sectionId),
                        sectionVisibility: {
                            ...state.data.sectionVisibility,
                            [sectionId]: false,
                        },
                        // Optionally reset data if it's an array to clear it fully
                        [sectionId]: Array.isArray(state.data[sectionId as keyof ResumeData]) ? [] : state.data[sectionId as keyof ResumeData]
                    },
                })),

            reorderSections: (newOrder) =>
                set((state) => ({
                    data: { ...state.data, sectionOrder: newOrder },
                })),

            resetResume: () => set({ data: initialResumeData }),

            loadResume: (data) => set({ data, isLoading: false }),

            incrementAiCredits: () =>
                set((state) => ({
                    aiCreditsUsed: state.aiCreditsUsed + 1,
                })),

            markSaved: () => set({ isSaving: false, lastSaved: new Date().toISOString() }),
            
            setExportCredits: (credits) => set({ exportCredits: credits }),
            setMonetizationSettings: (settings) => set({ monetizationSettings: settings }),
        }),
        {
            name: 'resume-storage',
        }
    )
);
