-- Update user_role_type enum to include admin, editor, viewer
-- First, rename existing values and add new ones

-- Create a new enum type with the correct values
CREATE TYPE user_role_type_new AS ENUM ('admin', 'editor', 'viewer');

-- Update the column to use the new enum (converting existing values)
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

-- Drop the old enum type
DROP TYPE user_role_type;

-- Rename the new enum type to the original name
ALTER TYPE user_role_type_new RENAME TO user_role_type;
