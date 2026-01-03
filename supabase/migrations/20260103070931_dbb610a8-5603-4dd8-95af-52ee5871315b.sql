-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create weekly cron job to ping search engines every Sunday at 6:00 AM UTC
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