-- Update user_role_type enum to include admin, editor, viewer
-- Must drop policies first, then alter column, then recreate policies

-- Step 1: Drop policies that depend on the role column
DROP POLICY IF EXISTS "Admins can create invitations" ON invitations;
DROP POLICY IF EXISTS "Admins can view invitations" ON invitations;
DROP POLICY IF EXISTS "Admins can delete invitations" ON invitations;
DROP POLICY IF EXISTS "Admins can update invitations" ON invitations;

-- Also check profiles table for any role-dependent policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Step 2: Create a new enum type with the correct values
CREATE TYPE user_role_type_new AS ENUM ('admin', 'editor', 'viewer');

-- Step 3: Update the column to use the new enum (converting existing values)
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

-- Step 4: Drop the old enum type
DROP TYPE user_role_type;

-- Step 5: Rename the new enum type to the original name
ALTER TYPE user_role_type_new RENAME TO user_role_type;

-- Step 6: Recreate the policies with updated role values
-- Invitations policies
CREATE POLICY "Admins can create invitations" ON invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view invitations" ON invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
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

-- Profiles policies
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
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
    )
  );
