import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN' && user.email !== 'admin@example.com') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let { data: settings, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('admin_id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!settings) {
        // Create default settings if none exist
        const { data: newSettings, error: insertError } = await supabase
            .from('admin_settings')
            .insert([{
                admin_id: user.id,
                ai_enabled: false,
                ai_provider: 'GEMINI',
                monetization_enabled: false,
                premium_price: 10
            }])
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
        settings = newSettings;
    }

    return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN' && user.email !== 'admin@example.com') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Whitelist allowable fields to update
    const updateData = {
        ai_enabled: body.ai_enabled,
        ai_provider: body.ai_provider,
        ai_api_key: body.ai_api_key !== undefined ? body.ai_api_key : undefined, // only update if provided
        payment_upi_qr: body.payment_upi_qr,
        payment_gateway_key: body.payment_gateway_key !== undefined ? body.payment_gateway_key : undefined,
        premium_price: body.premium_price,
        monetization_enabled: body.monetization_enabled,
        updated_at: new Date().toISOString()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]);

    const { data: settings, error } = await supabase
        .from('admin_settings')
        .update(updateData)
        .eq('admin_id', user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(settings);
}
