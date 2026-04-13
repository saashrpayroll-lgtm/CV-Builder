import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { suggestSkills } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { jobRole, currentSkills } = await req.json();
        if (!jobRole) return NextResponse.json({ error: "Job role required" }, { status: 400 });

        const skills = await suggestSkills(jobRole, currentSkills);
        return NextResponse.json({ success: true, skills });
    } catch (error) {
        console.error("[AI_SKILLS]", error);
        return NextResponse.json({ error: "Failed to suggest skills" }, { status: 500 });
    }
}
