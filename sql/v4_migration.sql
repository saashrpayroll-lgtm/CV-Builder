---------------------------------------------------------
-- V4 Migration: Fix Infinite Recursion in RLS Policies
---------------------------------------------------------

-- 1. Drop the buggy policies that caused infinite recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all resumes" ON public.resumes;
DROP POLICY IF EXISTS "Any admin can read settings" ON public.admin_settings;

-- 2. Create a SECURITY DEFINER function to check admin status
-- Security definer runs as the database owner, bypassing RLS to avoid infinite loops!
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- 3. Recreate the policies using the new is_admin() function
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admins can delete users" ON public.users
  FOR DELETE USING ( public.is_admin() );

CREATE POLICY "Admins can view all resumes" ON public.resumes
  FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Any admin can read settings" ON public.admin_settings
  FOR SELECT USING ( public.is_admin() );
