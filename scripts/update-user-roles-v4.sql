-- Update user_role_type enum to include admin, editor, viewer
-- This version handles ALL dependencies including functions and the invitations table

-- Step 1: Drop ALL policies on affected tables
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'invitations', 'talent')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Step 2: Drop functions that depend on user_role_type
DROP FUNCTION IF EXISTS create_invitation(text, user_role_type, integer);
DROP FUNCTION IF EXISTS validate_invitation(text, text);

-- Step 3: Create a new enum type with the correct values
CREATE TYPE user_role_type_new AS ENUM ('admin', 'editor', 'viewer');

-- Step 4: Update the profiles table column
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

-- Step 5: Update the invitations table column (if it has a role column)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'role'
  ) THEN
    EXECUTE 'ALTER TABLE invitations 
      ALTER COLUMN role DROP DEFAULT,
      ALTER COLUMN role TYPE user_role_type_new 
        USING (
          CASE role::text
            WHEN ''super_admin'' THEN ''admin''::user_role_type_new
            WHEN ''editor'' THEN ''editor''::user_role_type_new
            ELSE ''viewer''::user_role_type_new
          END
        ),
      ALTER COLUMN role SET DEFAULT ''viewer''::user_role_type_new';
  END IF;
END $$;

-- Step 6: Drop the old enum type
DROP TYPE user_role_type;

-- Step 7: Rename the new enum type to the original name
ALTER TYPE user_role_type_new RENAME TO user_role_type;

-- Step 8: Recreate the functions with new enum type
CREATE OR REPLACE FUNCTION create_invitation(
  p_email TEXT,
  p_role user_role_type DEFAULT 'viewer',
  p_expires_in_days INTEGER DEFAULT 7
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token uuid;
BEGIN
  v_token := gen_random_uuid();
  
  INSERT INTO invitations (email, role, token, expires_at, created_by)
  VALUES (
    p_email,
    p_role,
    v_token,
    NOW() + (p_expires_in_days || ' days')::INTERVAL,
    auth.uid()
  );
  
  RETURN v_token;
END;
$$;

CREATE OR REPLACE FUNCTION validate_invitation(
  p_token TEXT,
  p_email TEXT
)
RETURNS user_role_type
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role user_role_type;
BEGIN
  SELECT role INTO v_role
  FROM invitations
  WHERE token::text = p_token
    AND email = p_email
    AND expires_at > NOW()
    AND used_at IS NULL;
  
  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Mark invitation as used
  UPDATE invitations
  SET used_at = NOW()
  WHERE token::text = p_token AND email = p_email;
  
  RETURN v_role;
END;
$$;

-- Step 9: Recreate policies
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

-- Talent policies (public read)
CREATE POLICY "Anyone can view published talent" ON talent
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage talent" ON talent
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );
