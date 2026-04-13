import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Whitelist allowed fields
    const updateData: Record<string, string> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.linkedin_url !== undefined) updateData.linkedin_url = body.linkedin_url;
    if (body.website_url !== undefined) updateData.website_url = body.website_url;

    const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
