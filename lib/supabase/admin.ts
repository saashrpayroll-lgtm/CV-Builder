import { createClient } from "@supabase/supabase-js";

// This client uses the service role key to bypass RLS.
// Use this ONLY in secure server-side environments like webhooks or background jobs.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;
