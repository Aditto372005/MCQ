/*
  # Fix RLS policies for responses table

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle both anonymous and authenticated inserts
    - Maintain read access for authenticated users
  
  2. Security
    - Allow both anonymous and authenticated users to insert responses
    - Maintain read access for authenticated users only
    - Simplify policy structure to ensure consistent behavior
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read responses" ON responses;
DROP POLICY IF EXISTS "Enable insert access for anonymous users" ON responses;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
  ON responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);