import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFullResume } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { jobTitle, yearsExperience, keySkills } = await req.json();
        if (!jobTitle) return NextResponse.json({ error: "Job title required" }, { status: 400 });

        const resumeData = await generateFullResume(
            jobTitle,
            yearsExperience || 3,
            keySkills || []
        );

        return NextResponse.json({ success: true, data: resumeData });
    } catch (error) {
        console.error("[AI_GENERATE_RESUME]", error);
        return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
    }
}
