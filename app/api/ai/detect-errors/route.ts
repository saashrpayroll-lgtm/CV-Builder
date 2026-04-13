import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { detectResumeErrors } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { resumeData } = await req.json();
        if (!resumeData) return NextResponse.json({ error: "Resume data required" }, { status: 400 });

        const errors = await detectResumeErrors(resumeData);
        return NextResponse.json({ success: true, errors });
    } catch (error) {
        console.error("[AI_ERRORS]", error);
        return NextResponse.json({ error: "Failed to detect errors" }, { status: 500 });
    }
}
