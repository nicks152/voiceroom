-- Update user_role_type enum to include admin, editor, viewer
-- Drop ALL policies on affected tables first

-- Step 1: Drop ALL policies on invitations table
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'invitations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON invitations', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Drop ALL policies on profiles table
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Drop ALL policies on talent table (if any reference profiles.role)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'talent'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON talent', pol.policyname);
    END LOOP;
END $$;

-- Step 4: Create a new enum type with the correct values
CREATE TYPE user_role_type_new AS ENUM ('admin', 'editor', 'viewer');

-- Step 5: Update the column to use the new enum
ALTER TABLE profiles 
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE user_role_type_new 
    USING (
      CASE role::text
        WHEN 'super_admin' THEN 'admin'::user_role_type_new
        WHEN 'editor' THEN 'editor'::user_role_type_new
        ELSE 'viewer'::user_role_type_new
      END
    ),
  ALTER COLUMN role SET DEFAULT 'viewer'::user_role_type_new;

-- Step 6: Drop the old enum type and rename new one
DROP TYPE user_role_type;
ALTER TYPE user_role_type_new RENAME TO user_role_type;

-- Step 7: Recreate policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- Step 8: Recreate policies for invitations
CREATE POLICY "Admins can view all invitations" ON invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can create invitations" ON invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete invitations" ON invitations
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Step 9: Recreate policies for talent (basic CRUD)
CREATE POLICY "Anyone can view published talent" ON talent
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert talent" ON talent
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can update talent" ON talent
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete talent" ON talent
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
