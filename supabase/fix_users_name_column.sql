-- Fix: Add missing 'name' column to users table
-- Run this in Supabase SQL Editor: https://bshvpxzkezzxgfewbzax.supabase.co

-- Add name column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
