"use server";

import { createClient } from "@/lib/supabase/server";

export async function deductExportCredit() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: currentUser } = await supabase
        .from('users')
        .select('export_credits')
        .eq('id', user.id)
        .single();

    const currentCredits = currentUser?.export_credits || 0;

    if (currentCredits <= 0) {
        return { error: "No export credits available" };
    }

    const { error } = await supabase
        .from('users')
        .update({ export_credits: currentCredits - 1 })
        .eq('id', user.id);

    if (error) {
        return { error: error.message };
    }

    return { success: true, remaining: currentCredits - 1 };
}
