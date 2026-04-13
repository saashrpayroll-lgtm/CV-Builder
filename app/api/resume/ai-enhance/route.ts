import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { resumeId, mode, tone, engine } = await req.json();

        if (!resumeId) {
            return new NextResponse("Resume ID required", { status: 400 });
        }

        // 1. Fetch resume from DB
        const { data: resume, error: fetchError } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .single();

        if (fetchError || !resume) {
            return new NextResponse("Resume not found", { status: 404 });
        }

        // 2. AI Enhancement Prompt
        const prompt = `
            You are an expert resume writer. Enhance the following resume data.
            Tone: ${tone || "professional"}
            Mode: ${mode || "ATS optimization"}
            
            Current Resume Data:
            ${JSON.stringify(resume.content, null, 2)}
            
            Instructions:
            - Improve the language to be more impactful.
            - Ensure all descriptions are concise and results-oriented.
            - If mode is "executive", focus on leadership and strategy.
            - Return ONLY the updated JSON structure.
        `;

        const enhancedJson = await generateText(prompt);

        // Clean the response if AI adds markdown
        const cleanedJson = enhancedJson.replace(/```json|```/g, "").trim();
        const structuredData = JSON.parse(cleanedJson);

        // 3. Update DB
        const { error: updateError } = await supabase
            .from("resumes")
            .update({
                content: {
                    ...resume.content,
                    ...structuredData
                },
                updated_at: new Date().toISOString()
            })
            .eq("id", resumeId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, data: structuredData });

    } catch (error) {
        console.error("[AI_ENHANCE_ERROR]", error);
        return new NextResponse("AI Enhancement Failed", { status: 500 });
    }
}
