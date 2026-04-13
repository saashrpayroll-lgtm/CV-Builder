"use client";

import { useResumeStore } from "@/store/useResumeStore";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { forwardRef } from "react";

const LivePreview = forwardRef<HTMLDivElement>((props, ref) => {
    const { data } = useResumeStore();

    return (
        <div ref={ref} className="bg-white text-black min-h-[297mm] w-[210mm] shadow-sm mx-auto overflow-visible print:shadow-none print:mx-0 print-area">
            <TemplateRenderer templateId={data.templateId} data={data} />
        </div>
    );
});

LivePreview.displayName = "LivePreview";

export default LivePreview;
