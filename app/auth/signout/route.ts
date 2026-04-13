import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return NextResponse.redirect(new URL("/error", req.url));
    }

    revalidatePath("/", "layout");
    return NextResponse.redirect(new URL("/login", req.url), {
        status: 302,
    });
}
