-- Create a table for public profiles (syncs with auth.users if needed, or just linked)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  role text default 'USER' check (role in ('USER', 'ADMIN')),
  plan text default 'FREE' check (plan in ('FREE', 'PRO')),
  credits int default 5,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Resumes table
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null default 'My Resume',
  content jsonb not null default '{}'::jsonb,
  template_id text default 'modern',
  ats_score int default 0,
  is_public boolean default false,
  slug text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.resumes enable row level security;

-- Policies for resumes
create policy "Users can view their own resumes" on public.resumes
  for select using (auth.uid() = user_id);

create policy "Users can create their own resumes" on public.resumes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own resumes" on public.resumes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own resumes" on public.resumes
  for delete using (auth.uid() = user_id);

-- Public access policy (if resume is public)
create policy "Public resumes are viewable by everyone" on public.resumes
  for select using (is_public = true);

-- Admin Settings Table for BYOK & Monetization
create table public.admin_settings (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.users(id) on delete cascade not null,
  ai_enabled boolean default false,
  ai_provider text default 'GEMINI' check (ai_provider in ('GEMINI', 'OPENAI', 'GROQ')),
  ai_api_key text,
  payment_upi_qr text,
  payment_gateway_key text,
  premium_price numeric default 10,
  monetization_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(admin_id)
);

-- Enable RLS
alter table public.admin_settings enable row level security;

-- Policies for admin settings
create policy "Admins can view their own settings" on public.admin_settings
  for select using (auth.uid() = admin_id);

create policy "Admins can insert their own settings" on public.admin_settings
  for insert with check (auth.uid() = admin_id);

create policy "Admins can update their own settings" on public.admin_settings
  for update using (auth.uid() = admin_id);
