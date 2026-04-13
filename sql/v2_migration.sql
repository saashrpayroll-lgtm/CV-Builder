---------------------------------------------------------
-- Advanced Admin Portal & Monetization Upgrades V2
---------------------------------------------------------

-- 1. Extend Users Table
alter table public.users add column if not exists status text default 'ACTIVE' check (status in ('ACTIVE', 'BLOCKED', 'SUSPENDED'));
alter table public.users add column if not exists export_credits int default 0;

-- 2. Extend Admin Settings
alter table public.admin_settings add column if not exists export_price_1 numeric default 49;
alter table public.admin_settings add column if not exists export_price_3 numeric default 99;
alter table public.admin_settings add column if not exists export_payment_message text default 'To unlock downloading and printing, please pay the platform maintenance fee.';

-- 3. Create Payments tracking table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  amount numeric not null,
  transaction_id text not null,
  status text default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  credits_requested int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on tracking table
alter table public.payments enable row level security;

-- Policies for payments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own payments' AND tablename = 'payments') THEN
        create policy "Users can view their own payments" on public.payments
          for select using (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own payments' AND tablename = 'payments') THEN
        create policy "Users can insert their own payments" on public.payments
          for insert with check (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all payments' AND tablename = 'payments') THEN
        create policy "Admins can manage all payments" on public.payments
          for all using (
            exists (
              select 1 from public.users where id = auth.uid() and role = 'ADMIN'
            )
          );
    END IF;
END $$;
