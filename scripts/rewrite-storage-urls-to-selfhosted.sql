-- Point sample file URLs at the self-hosted Supabase host.
-- Safe to re-run; only rewrites the old cloud project host.

UPDATE samples
SET file_url = REPLACE(
  file_url,
  'https://gsaeboozkgbltbotwdkc.supabase.co',
  'https://db.ampafrica.com'
)
WHERE file_url LIKE 'https://gsaeboozkgbltbotwdkc.supabase.co%';

UPDATE talent
SET photo_url = REPLACE(
  photo_url,
  'https://gsaeboozkgbltbotwdkc.supabase.co',
  'https://db.ampafrica.com'
)
WHERE photo_url LIKE 'https://gsaeboozkgbltbotwdkc.supabase.co%';
