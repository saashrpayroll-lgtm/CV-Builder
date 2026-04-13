import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data, error } = await supabase
        .from("resumes")
        .insert({
            user_id: user.id,
            title: "Untitled Resume",
            content: {
                personalInfo: {
                    fullName: user.user_metadata.full_name || "",
                    email: user.email || "",
                },
                workExperience: [],
                education: [],
                skills: [],
                projects: [],
            },
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating resume:", error);
        return NextResponse.redirect(new URL("/dashboard?error=create_failed", req.url));
    }

    revalidatePath("/dashboard");
    return NextResponse.redirect(new URL(`/editor/${data.id}`, req.url));
}
