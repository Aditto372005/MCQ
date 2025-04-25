/*
  # Fix RLS policies for responses table

  1. Changes
    - Drop existing insert policy
    - Create new insert policy that explicitly allows inserts from both anon and authenticated users
    - Keep existing select policy unchanged
  
  2. Security
    - Enables RLS on responses table
    - Allows inserts from both anonymous and authenticated users
    - Maintains read access only for authenticated users
*/

-- Drop existing insert policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert access for all users" ON public.responses;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create new insert policy with explicit roles
CREATE POLICY "Enable insert access for all users" ON public.responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Note: We keep the existing select policy unchanged:
-- "Enable read access for authenticated users" which allows
-- authenticated users to read all responses