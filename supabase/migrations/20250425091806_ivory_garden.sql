/*
  # Update responses table RLS policies

  1. Security Changes
    - Drop existing policies that may be conflicting
    - Add new policies for:
      - Allowing inserts for all users (both authenticated and anonymous)
      - Allowing reads for authenticated users only
    
  Note: Since this is an exam system where students submit responses without needing 
  to authenticate, we need to allow inserts from anonymous users while maintaining 
  read restrictions to authenticated users only (for admin/teacher access).
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert access for all users" ON responses;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON responses;

-- Create new policies
CREATE POLICY "Enable insert access for all users"
ON responses
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
ON responses
FOR SELECT
TO authenticated
USING (true);