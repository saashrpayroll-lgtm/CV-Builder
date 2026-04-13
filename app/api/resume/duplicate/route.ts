import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { resumeId } = await req.json();
        if (!resumeId) return NextResponse.json({ error: "Resume ID required" }, { status: 400 });

        // Fetch original
        const { data: original, error: fetchError } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .eq("user_id", user.id)
            .single();

        if (fetchError || !original) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

        // Create duplicate
        const { data: duplicate, error: dupError } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                title: `${original.title} (Copy)`,
                content: original.content,
                template_id: original.template_id,
                ats_score: original.ats_score,
                slug: `${user.id.slice(0, 8)}-${Date.now()}`,
            })
            .select()
            .single();

        if (dupError) throw dupError;

        return NextResponse.json({ success: true, resume: duplicate });
    } catch (error) {
        console.error("[RESUME_DUPLICATE]", error);
        return NextResponse.json({ error: "Failed to duplicate" }, { status: 500 });
    }
}
