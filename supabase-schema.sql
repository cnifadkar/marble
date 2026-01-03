-- Marble Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Waitlist table for email signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public signup form)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading count (for displaying total signups)
CREATE POLICY "Allow reading count" ON waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);

-- Canvases table (for future user canvas storage)
CREATE TABLE IF NOT EXISTS canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT, -- Will be used when auth is added
  session_id TEXT, -- For anonymous users
  name TEXT NOT NULL DEFAULT 'Untitled Canvas',
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for now (will restrict when auth is added)
CREATE POLICY "Allow all access to canvases" ON canvases
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS canvases_user_id_idx ON canvases(user_id);
CREATE INDEX IF NOT EXISTS canvases_session_id_idx ON canvases(session_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for auto-updating
CREATE TRIGGER update_canvases_updated_at
  BEFORE UPDATE ON canvases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database schema created successfully!' as status;

