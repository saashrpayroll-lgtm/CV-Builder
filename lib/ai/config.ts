import { createClient } from "@/lib/supabase/server";

export async function getSystemAISettings() {
    try {
        const supabase = await createClient();
        
        // Find any active configuration. In a single-tenant SaaS, usually the primary admin record is used.
        // If there's an enabled setup, pick it.
        const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .eq('ai_enabled', true)
            .limit(1)
            .single();
            
        if (error || !data) {
            // Check if there's an AI record at all to see if completely disabled or just not setup
            const { data: anyData } = await supabase.from('admin_settings').select('ai_enabled').limit(1).single();
            
            return {
                ai_enabled: anyData ? false : true, // If no settings exist yet, default to TRUE to fallback to ENV vars
                ai_provider: 'GEMINI',
                ai_api_key: null
            };
        }
        
        return data;
    } catch (e) {
        // Fallback to true with ENV on server error
        return {
            ai_enabled: true,
            ai_provider: 'GEMINI',
            ai_api_key: null
        };
    }
}
