import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Load a resume
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: resume, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

        // Check ownership or public
        if (resume.user_id !== user.id && !resume.is_public) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error("[RESUME_GET]", error);
        return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
    }
}

// PUT - Update a resume
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const { error } = await supabase
            .from("resumes")
            .update({
                title: body.title,
                content: body.content,
                template_id: body.templateId,
                ats_score: body.atsScore,
                is_public: body.isPublic,
                slug: body.slug,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[RESUME_PUT]", error);
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
    }
}

// DELETE - Delete a resume
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { error } = await supabase
            .from("resumes")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[RESUME_DELETE]", error);
        return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
    }
}
