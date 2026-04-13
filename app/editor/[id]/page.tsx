import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ResumeEditor from "@/components/editor/ResumeEditor";

interface EditorPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!resume) {
        notFound();
    }

    // Fetch subscription status
    const { data: userData } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

    const isPro = userData?.subscription_status === "pro";

    return (
        <div className="h-screen flex flex-col">
            <ResumeEditor initialData={resume} isPro={isPro} />
        </div>
    );
}
