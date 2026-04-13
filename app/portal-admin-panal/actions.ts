"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(userId: string, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: admin } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (admin?.role !== 'ADMIN') return { error: "Forbidden" };

    const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

    if (error) return { error: error.message };
    revalidatePath('/portal-admin-panal');
    return { success: true };
}

export async function updateUserCredits(userId: string, aiCredits: number, exportCredits: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: admin } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (admin?.role !== 'ADMIN') return { error: "Forbidden" };

    const { error } = await supabase
        .from('users')
        .update({ 
            credits: aiCredits,
            export_credits: exportCredits 
        })
        .eq('id', userId);

    if (error) return { error: error.message };
    revalidatePath('/portal-admin-panal');
    return { success: true };
}

export async function handlePaymentApproval(paymentId: string, action: 'APPROVED' | 'REJECTED') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: admin } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (admin?.role !== 'ADMIN') return { error: "Forbidden" };

    // Get the payment record
    const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();
        
    if (!payment) return { error: "Payment not found" };
    if (payment.status !== 'PENDING') return { error: "Payment already processed" };

    // Start a logical transaction
    if (action === 'APPROVED') {
        // Give the user their export credits
        const { data: targetUser } = await supabase
            .from('users')
            .select('export_credits')
            .eq('id', payment.user_id)
            .single();
            
        const newCredits = (targetUser?.export_credits || 0) + payment.credits_requested;
        
        await supabase
            .from('users')
            .update({ export_credits: newCredits })
            .eq('id', payment.user_id);
    }

    // Update payment status
    const { error } = await supabase
        .from('payments')
        .update({ status: action })
        .eq('id', paymentId);

    if (error) return { error: error.message };
    
    revalidatePath('/portal-admin-panal');
    return { success: true };
}
