import { ResumeData } from "@/store/useResumeStore";
import ClassicTemplate from "./ClassicTemplate";
import ModernSplitTemplate from "./ModernSplitTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeSidebarTemplate from "./CreativeSidebarTemplate";
import TechStackTemplate from "./TechStackTemplate";
import CorporateTemplate from "./CorporateTemplate";
import ElegantTemplate from "./ElegantTemplate";
import ATSTemplate from "./ATSTemplate";
import AcademicTemplate from "./AcademicTemplate";
import SwissTemplate from "./SwissTemplate";
import FAANGTemplate from "./FAANGTemplate";
import TimelineTemplate from "./TimelineTemplate";
import GraphicDesignerTemplate from "./GraphicDesignerTemplate";
import HackerTemplate from "./HackerTemplate";
import CompactTemplate from "./CompactTemplate";
import NewspaperTemplate from "./NewspaperTemplate";
import ModernRightTemplate from "./ModernRightTemplate";
import StartupTemplate from "./StartupTemplate";
import UniversalRenderer from "./UniversalRenderer";

interface TemplateRendererProps {
    templateId: string;
    data: ResumeData;
    isPrint?: boolean;
}

const templateMap: Record<string, React.ComponentType<{ data: ResumeData; isPrint?: boolean }>> = {
    'classic': ClassicTemplate,
    'modern-split': ModernSplitTemplate,
    'executive': ExecutiveTemplate,
    'minimal': MinimalTemplate,
    'creative-sidebar': CreativeSidebarTemplate,
    'tech-stack': TechStackTemplate,
    'corporate': CorporateTemplate,
    'elegant': ElegantTemplate,
    'ats': ATSTemplate,
    'academic': AcademicTemplate,
    'swiss': SwissTemplate,
    'faang': FAANGTemplate,
    'timeline': TimelineTemplate,
    'graphic-designer': GraphicDesignerTemplate,
    'hacker': HackerTemplate,
    'compact': CompactTemplate,
    'newspaper': NewspaperTemplate,
    'modern-right': ModernRightTemplate,
    'startup': StartupTemplate,
};

export default function TemplateRenderer({ templateId, data, isPrint }: TemplateRendererProps) {
    const Template = templateMap[templateId];
    
    if (Template) {
        return <Template data={data} isPrint={isPrint} />;
    }
    
    // Fallback to UniversalRenderer for any unknown templateId
    return <UniversalRenderer data={data} isPrint={isPrint} />;
}
