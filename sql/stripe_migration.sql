-- Add Stripe columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS subscription_status text default 'free',
ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);
