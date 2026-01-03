-- Move pg_cron extension to the extensions schema (where Supabase expects it)
-- This resolves the "Extension in Public" warning
DROP EXTENSION IF EXISTS pg_cron CASCADE;
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Recreate extensions in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate the weekly cron job
SELECT cron.schedule(
  'weekly-search-engine-ping',
  '0 6 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://jzvgndwxfhscbpiaaxnq.supabase.co/functions/v1/ping-search-engines',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6dmduZHd4ZmhzY2JwaWFheG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzk2OTIsImV4cCI6MjA4MDgxNTY5Mn0.YDZFM1x_0A1lpo1PAK0hN14eOtd9kD6u_zQIxjV_VXo"}'::jsonb,
    body := '{"action": "weekly_ping"}'::jsonb
  ) AS request_id;
  $$
);