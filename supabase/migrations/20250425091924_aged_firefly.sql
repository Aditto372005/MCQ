/*
  # Fix RLS policies for responses table

  1. Changes
    - Drop existing policies
    - Create new policies that properly allow:
      - Public (anonymous) users to insert responses
      - Authenticated users to read all responses
  
  2. Security
    - Maintain RLS enabled
    - Ensure proper access control for both anonymous and authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read responses" ON responses;
DROP POLICY IF EXISTS "Allow anyone to insert responses" ON responses;

-- Create new policies with proper permissions
CREATE POLICY "Enable read access for authenticated users"
  ON responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON responses
  FOR INSERT
  TO public
  WITH CHECK (true);