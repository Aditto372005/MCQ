/*
  # Update RLS policies for responses table

  1. Changes
    - Add RLS policy to allow anonymous and authenticated users to insert responses
    - Keep existing policy for authenticated users to read responses

  2. Security
    - Enable RLS on responses table
    - Allow all users to insert responses
    - Only authenticated users can read responses
*/

-- Enable RLS on responses table (if not already enabled)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Enable insert access for all users" ON responses;

-- Create new insert policy
CREATE POLICY "Enable insert access for all users"
ON responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Keep existing select policy
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON responses;
CREATE POLICY "Enable read access for authenticated users"
ON responses
FOR SELECT
TO authenticated
USING (true);