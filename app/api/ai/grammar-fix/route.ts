import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fixGrammar } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { text } = await req.json();
        if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

        const fixed = await fixGrammar(text);
        return NextResponse.json({ success: true, text: fixed });
    } catch (error) {
        console.error("[AI_GRAMMAR]", error);
        return NextResponse.json({ error: "Failed to fix grammar" }, { status: 500 });
    }
}
