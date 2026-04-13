import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email, password, adminSecret } = await req.json();

        // 1. Verify Admin Secret Key from environment
        const envSecret = process.env.ADMIN_SECRET_KEY;
        if (!envSecret) {
            return NextResponse.json({ error: "Server misconfigured: Admin secret not set" }, { status: 500 });
        }
        if (adminSecret !== envSecret) {
            return NextResponse.json({ error: "Invalid admin secret key" }, { status: 403 });
        }

        // 2. Authenticate with Supabase
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 3. Verify the user has ADMIN role
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profile?.role !== "ADMIN") {
            // Sign them out immediately
            await supabase.auth.signOut();
            return NextResponse.json({ error: "Access denied. This account does not have admin privileges." }, { status: 403 });
        }

        // 4. Generate a session token
        const token = randomUUID();

        return NextResponse.json({ success: true, token, user: { id: data.user.id, email: data.user.email } });
    } catch (error: any) {
        console.error("[ADMIN_LOGIN_ERROR]", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
