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

    // Fetch user details including premium status and export credits
    const { data: userData } = await supabase
        .from("users")
        .select("subscription_status, export_credits, status")
        .eq("id", user.id)
        .single();

    // Check if user is blocked or suspended
    if (userData?.status === 'BLOCKED' || userData?.status === 'SUSPENDED') {
        redirect("/dashboard?error=account_suspended");
    }

    const isPro = userData?.subscription_status === "pro";
    const exportCredits = userData?.export_credits || 0;

    // Fetch monetization settings (we grab the first admin_settings row assuming single-tenant/main admin app)
    const { data: adminSettings } = await supabase
        .from("admin_settings")
        .select("monetization_enabled, export_price_1, export_price_3, payment_upi_qr, export_payment_message")
        .limit(1)
        .single();

    return (
        <div className="h-screen flex flex-col">
            <ResumeEditor 
                initialData={resume} 
                isPro={isPro} 
                exportCredits={exportCredits}
                monetizationSettings={adminSettings}
            />
        </div>
    );
}
