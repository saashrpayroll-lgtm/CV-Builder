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

        const { section, content, action } = await req.json();

        if (!section || !content) {
            return new NextResponse("Section and content required", { status: 400 });
        }

        // 1. Section AI Prompt
        const prompt = `
            You are an expert resume editor. 
            Section: ${section}
            Action: ${action || "professionally rewrite"}
            
            Current Content:
            ${content}
            
            Instructions:
            - Perform the requested action while maintaining a professional tone.
            - If action is "expand", add more professional detail and metrics if implied.
            - If action is "shorten", make it punchy and concise.
            - Return ONLY the updated text.
        `;

        const updatedText = await generateText(prompt);

        return NextResponse.json({ success: true, text: updatedText });

    } catch (error) {
        console.error("[AI_SECTION_ERROR]", error);
        return new NextResponse("AI Section Refinement Failed", { status: 500 });
    }
}
