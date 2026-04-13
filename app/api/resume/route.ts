import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Create a new resume
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const { data: resume, error } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                title: body.title || "Untitled Resume",
                content: body.content || {},
                template_id: body.templateId || "modern-1",
                ats_score: 0,
                slug: `${user.id.slice(0, 8)}-${Date.now()}`,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, resume });
    } catch (error) {
        console.error("[RESUME_CREATE]", error);
        return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
    }
}

// GET - List all resumes for the current user
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: resumes, error } = await supabase
            .from("resumes")
            .select("id, title, template_id, ats_score, updated_at, is_public, slug, created_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ resumes });
    } catch (error) {
        console.error("[RESUME_LIST]", error);
        return NextResponse.json({ error: "Failed to list resumes" }, { status: 500 });
    }
}
