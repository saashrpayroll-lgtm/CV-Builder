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

        // 2. We use the freshly acquired access_token to bypass the delayed cookie issue
        const authClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return []; },
                    setAll() { },
                },
                global: {
                    headers: {
                        Authorization: `Bearer ${data.session.access_token}`
                    }
                }
            }
        );

        const { data: profile, error: profileError } = await authClient
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profileError) {
            await supabase.auth.signOut();
            return NextResponse.json({ error: `Database error finding profile: ${profileError.message}` }, { status: 403 });
        }

        if (profile?.role !== "ADMIN") {
            await supabase.auth.signOut();
            return NextResponse.json({ error: `Access denied. Your current database role is '${profile?.role}'. Please update it to 'ADMIN' using the SQL Editor.` }, { status: 403 });
        }

        return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (error: unknown) {
        console.error("[ADMIN_LOGIN_ERROR]", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}
