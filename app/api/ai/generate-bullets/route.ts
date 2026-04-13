import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateBulletPoints } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { role, company, industry } = await req.json();
        if (!role || !company) return NextResponse.json({ error: "Role and company required" }, { status: 400 });

        const bullets = await generateBulletPoints(role, company, industry);
        return NextResponse.json({ success: true, bullets });
    } catch (error) {
        console.error("[AI_BULLETS]", error);
        return NextResponse.json({ error: "Failed to generate bullets" }, { status: 500 });
    }
}
