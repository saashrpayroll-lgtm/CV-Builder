import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { globalPolish } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { resumeData } = await req.json();
        if (!resumeData) return NextResponse.json({ error: "Resume data required" }, { status: 400 });

        const suggestions = await globalPolish(resumeData);
        return NextResponse.json({ success: true, suggestions });
    } catch (error) {
        console.error("[AI_POLISH]", error);
        return NextResponse.json({ error: "Failed to polish resume" }, { status: 500 });
    }
}
