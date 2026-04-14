import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const cookieStore = await cookies();

        // Create supabase client
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // ignore in route handler
                        }
                    },
                },
            }
        );

        // 1. Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 2. Use the service role key to check user role directly (bypasses RLS)
        // This avoids the issue where RLS auth.uid() isn't set yet in the same request
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (serviceRoleKey) {
            // Use service role to bypass RLS and check role
            const adminClient = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                {
                    cookies: {
                        getAll() { return []; },
                        setAll() { },
                    },
                }
            );

            const { data: profile } = await adminClient
                .from("users")
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (profile?.role !== "ADMIN") {
                await supabase.auth.signOut();
                return NextResponse.json({ error: "Access denied. This account does not have admin privileges." }, { status: 403 });
            }
        } else {
            // Fallback: Try with the same client (may work if cookies propagate)
            const { data: profile } = await supabase
                .from("users")
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (profile?.role !== "ADMIN") {
                await supabase.auth.signOut();
                return NextResponse.json({ error: "Access denied. This account does not have admin privileges." }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (error: unknown) {
        console.error("[ADMIN_LOGIN_ERROR]", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
