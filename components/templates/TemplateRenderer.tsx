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

// 10 Epic Templates added
import CyberpunkTemplate from "./CyberpunkTemplate";
import MinimalDarkTemplate from "./MinimalDarkTemplate";
import TwoColumnCleanTemplate from "./TwoColumnCleanTemplate";
import PastelDreamTemplate from "./PastelDreamTemplate";
import DataScientistTemplate from "./DataScientistTemplate";
import ExecutiveSuiteTemplate from "./ExecutiveSuiteTemplate";
import CreativePortfolioTemplate from "./CreativePortfolioTemplate";
import NeonTechTemplate from "./NeonTechTemplate";
import RetroTerminalTemplate from "./RetroTerminalTemplate";
import ModernMonochromeTemplate from "./ModernMonochromeTemplate";

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
    
    // New Epics
    'cyberpunk': CyberpunkTemplate,
    'minimal-dark': MinimalDarkTemplate,
    'two-column-clean': TwoColumnCleanTemplate,
    'pastel-dream': PastelDreamTemplate,
    'data-scientist': DataScientistTemplate,
    'executive-suite': ExecutiveSuiteTemplate,
    'creative-portfolio': CreativePortfolioTemplate,
    'neon-tech': NeonTechTemplate,
    'retro-terminal': RetroTerminalTemplate,
    'modern-monochrome': ModernMonochromeTemplate,
};

export default function TemplateRenderer({ templateId, data, isPrint }: TemplateRendererProps) {
    const Template = templateMap[templateId];
    
    if (Template) {
        return <Template data={data} isPrint={isPrint} />;
    }
    
    // Fallback to UniversalRenderer for any unknown templateId
    return <UniversalRenderer data={data} isPrint={isPrint} />;
}
