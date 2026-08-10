-- Add description column to talent table
ALTER TABLE talent ADD COLUMN IF NOT EXISTS description TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN talent.description IS 'A short display description for the voice artist shown on the website';
