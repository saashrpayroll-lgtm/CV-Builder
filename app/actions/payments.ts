"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitUTR(utr: string, amount: number, packages: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized. Please login again." };
    if (!utr || utr.trim().length === 0) return { error: "Invalid UTR" };

    const { error } = await supabase
        .from('payments')
        .insert([{
            user_id: user.id,
            transaction_id: utr.trim(),
            amount: amount,
            credits_requested: packages,
            status: 'PENDING'
        }]);

    if (error) {
        if (error.code === '23505') { // Unique violation if UTR is heavily unique constrained
            return { error: "This UTR has already been submitted." };
        }
        return { error: "Failed to submit transaction: " + error.message };
    }

    return { success: true };
}
