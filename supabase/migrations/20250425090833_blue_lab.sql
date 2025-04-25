/*
  # Fix RLS policies for responses table

  1. Changes
    - Drop existing RLS policies
    - Create new policies that properly handle anonymous inserts
    - Maintain read access for authenticated users
  
  2. Security
    - Allow anonymous users to insert responses without authentication
    - Maintain read access for authenticated users only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read responses" ON responses;
DROP POLICY IF EXISTS "Allow anyone to insert responses" ON responses;

-- Create new policies
CREATE POLICY "Allow authenticated users to read responses"
  ON responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for anonymous users"
  ON responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);