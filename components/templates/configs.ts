import { ResumeData } from "@/store/useResumeStore";

export interface TemplateConfig {
    templateId: string;
    templateName: string;
    category: string;
    isATSFriendly: boolean;
    layout: {
        type: "two-column" | "single-column";
        leftWidth?: string;
        rightWidth?: string;
        sectionOrder: string[];
    };
    theme: {
        background: string;
        primaryColor: string;
        secondaryColor: string;
        textPrimary: string;
        textSecondary: string;
        accent: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        headingWeight: number;
        bodyWeight: number;
        lineHeight: number;
    };
    sections: {
        [key: string]: {
            icon?: string;
            showPhoto?: boolean;
            photoShape?: "circle" | "square" | "rounded";
            alignment?: "left" | "center" | "right";
            layout?: "timeline" | "list" | "grid";
            bulletStyle?: "dot" | "dash" | "none";
            highlightKeywords?: boolean;
        };
    };
    uiEffects: {
        cardStyle: "glass" | "solid" | "outline";
        shadow: "soft" | "medium" | "hard" | "none";
        divider: "gradient-line" | "solid" | "none";
    };
}

// Sample Configuration for "Ultra Modern Gradient"
export const ultraModernConfig: TemplateConfig = {
    templateId: "ultra_modern_gradient",
    templateName: "Ultra Modern Gradient",
    category: "Modern",
    isATSFriendly: true,
    layout: {
        type: "two-column",
        leftWidth: "35%",
        rightWidth: "65%",
        sectionOrder: [
            "profile",
            "experience",
            "projects",
            "education",
            "skills",
        ]
    },
    theme: {
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        primaryColor: "#4f46e5",
        secondaryColor: "#22d3ee",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        accent: "#f59e0b"
    },
    typography: {
        headingFont: "Poppins, sans-serif",
        bodyFont: "Inter, sans-serif",
        headingWeight: 600,
        bodyWeight: 400,
        lineHeight: 1.6
    },
    sections: {
        profile: {
            icon: "user",
            showPhoto: true,
            photoShape: "circle",
            alignment: "left"
        },
        experience: {
            layout: "timeline",
            bulletStyle: "dot",
            highlightKeywords: true
        },
        education: {
            layout: "list",
            bulletStyle: "none"
        },
        projects: {
            layout: "grid",
            bulletStyle: "dot"
        },
        skills: {
            layout: "grid",
            bulletStyle: "none"
        }
    },
    uiEffects: {
        cardStyle: "glass",
        shadow: "soft",
        divider: "gradient-line"
    }
};

export const templateConfigs: Record<string, TemplateConfig> = {
    "ultra_modern_gradient": ultraModernConfig,
};
