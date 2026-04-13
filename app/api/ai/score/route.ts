import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreResume } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { resumeData, jobDescription } = await req.json();
        if (!resumeData) return NextResponse.json({ error: "Resume data required" }, { status: 400 });

        const result = await scoreResume(resumeData, jobDescription);
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("[AI_SCORE]", error);
        return NextResponse.json({ error: "Failed to score resume" }, { status: 500 });
    }
}
