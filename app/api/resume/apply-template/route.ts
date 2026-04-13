import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { resumeId, templateId } = await req.json();

        if (!resumeId || !templateId) {
            return new NextResponse("Resume ID and Template ID required", { status: 400 });
        }

        // 1. Update DB
        const { error } = await supabase
            .from("resumes")
            .update({
                template_id: templateId,
                updated_at: new Date().toISOString()
            })
            .eq("id", resumeId);

        if (error) throw error;

        return NextResponse.json({ success: true, templateId });

    } catch (error) {
        console.error("[APPLY_TEMPLATE_ERROR]", error);
        return new NextResponse("Failed to apply template", { status: 500 });
    }
}
