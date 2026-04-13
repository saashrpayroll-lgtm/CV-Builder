---------------------------------------------------------
-- V3 Migration: Admin RLS Policies + Auto-Approve + Profile
---------------------------------------------------------

-- 1. Allow Admins to view ALL users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all users' AND tablename = 'users') THEN
        CREATE POLICY "Admins can view all users" ON public.users
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
          );
    END IF;
END $$;

-- 2. Allow Admins to update ALL users (for status/credits changes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all users' AND tablename = 'users') THEN
        CREATE POLICY "Admins can update all users" ON public.users
          FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
          );
    END IF;
END $$;

-- 3. Allow Admins to delete users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete users' AND tablename = 'users') THEN
        CREATE POLICY "Admins can delete users" ON public.users
          FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
          );
    END IF;
END $$;

-- 4. Allow Admins to view ALL resumes (for analytics)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all resumes' AND tablename = 'resumes') THEN
        CREATE POLICY "Admins can view all resumes" ON public.resumes
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
          );
    END IF;
END $$;

-- 5. Allow Admins to read their own settings via service role (already exists, but ensure read for any admin)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Any admin can read settings' AND tablename = 'admin_settings') THEN
        CREATE POLICY "Any admin can read settings" ON public.admin_settings
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
          );
    END IF;
END $$;

-- 6. Add auto_approve_payments to admin_settings
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS auto_approve_payments boolean DEFAULT false;

-- 7. Add profile fields to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS website_url text;
