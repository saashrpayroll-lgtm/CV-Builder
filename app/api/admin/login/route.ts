import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 1. Authenticate with Supabase
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 2. Verify the user has ADMIN role
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profile?.role !== "ADMIN") {
            await supabase.auth.signOut();
            return NextResponse.json({ error: "Access denied. This account does not have admin privileges." }, { status: 403 });
        }

        return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (error: unknown) {
        console.error("[ADMIN_LOGIN_ERROR]", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
