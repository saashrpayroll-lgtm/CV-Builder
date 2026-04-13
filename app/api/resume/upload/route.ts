import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithAI } from "@/lib/ai/parser";
import { createClient } from "@/lib/supabase/server";

// Polyfills for pdf-parse compatibility in Node environment
if (typeof global.DOMMatrix === "undefined") {
    (global as any).DOMMatrix = class { };
}
if (typeof global.ImageData === "undefined") {
    (global as any).ImageData = class { };
}
if (typeof global.Path2D === "undefined") {
    (global as any).Path2D = class { };
}

// pdf-parse and mammoth are used for extracting text.
let pdfParser: any = null;
let mammoth: any = null;

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Extract Text
        let text = "";
        const mimeType = file.type;
        const fileName = file.name.toLowerCase();

        if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
            // Lazy load the parser
            if (!pdfParser) {
                const { createRequire } = await import("module");
                const require = createRequire(import.meta.url);
                // Bypassing a bug in pdf-parse v1 where it tries to read non-existent test files in ESM
                pdfParser = require("pdf-parse/lib/pdf-parse.js");
            }
            const pdfData = await pdfParser(buffer);
            text = pdfData.text;
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName.endsWith(".docx")) {
            // Lazy load mammoth
            if (!mammoth) {
                mammoth = await import("mammoth");
            }
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return new NextResponse("Unsupported file format. Only PDF and Word (.docx) supported.", { status: 400 });
        }

        // 2. AI Parse
        const structuredData = await parseResumeWithAI(text);

        // 3. Save to DB
        const resumeTitle = file.name.replace(/\.(pdf|docx)$/i, "");

        const { data: resume, error } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                title: resumeTitle,
                template_id: "modern-1",
                content: {
                    ...structuredData,
                    sectionOrder: ["personalInfo", "workExperience", "education", "skills", "projects"],
                    sectionVisibility: {
                        personalInfo: true,
                        workExperience: true,
                        education: true,
                        skills: true,
                        projects: true
                    }
                }
            })
            .select()
            .single();

        if (error) {
            console.error("DB Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, resume: { id: resume.id }, ...structuredData });

    } catch (error: any) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json({ success: false, error: error?.message || "Failed to parse resume" }, { status: 500 });
    }
}
