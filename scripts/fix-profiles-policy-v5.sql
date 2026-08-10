-- Fix infinite recursion in profiles policies
-- The issue is that checking "is user admin" requires querying profiles, 
-- which triggers the same policy, causing infinite recursion.
-- Solution: Create a SECURITY DEFINER function that bypasses RLS to check role.

-- Step 1: Create a function to get user role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role_type
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Step 2: Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Step 3: Recreate policies using the function (no recursion)
-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins and editors can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Users can update their own profile (name, username only - not role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any profile (including role)
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');
