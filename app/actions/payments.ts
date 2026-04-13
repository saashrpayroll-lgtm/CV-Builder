"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitUTR(utr: string, amount: number, packages: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized. Please login again." };
    if (!utr || utr.trim().length === 0) return { error: "Invalid UTR" };

    // Check if auto-approve is enabled
    const { data: adminSettings } = await supabase
        .from('admin_settings')
        .select('auto_approve_payments')
        .limit(1)
        .single();

    const autoApprove = adminSettings?.auto_approve_payments === true;

    // Insert payment record
    const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
            user_id: user.id,
            transaction_id: utr.trim(),
            amount: amount,
            credits_requested: packages,
            status: autoApprove ? 'APPROVED' : 'PENDING'
        }])
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "This UTR has already been submitted." };
        }
        return { error: "Failed to submit transaction: " + error.message };
    }

    // If auto-approve is ON, immediately grant export credits to the user
    if (autoApprove && payment) {
        const { data: currentUser } = await supabase
            .from('users')
            .select('export_credits')
            .eq('id', user.id)
            .single();

        const newCredits = (currentUser?.export_credits || 0) + packages;

        await supabase
            .from('users')
            .update({ export_credits: newCredits })
            .eq('id', user.id);

        return { success: true, autoApproved: true, credits: newCredits };
    }

    return { success: true, autoApproved: false };
}
