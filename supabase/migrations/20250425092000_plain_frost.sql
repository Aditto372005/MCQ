/*
  # Fix RLS policies for responses table

  1. Changes
    - Safely drop and recreate policies
    - Create policies only if they don't exist:
      - Public (anonymous) users to insert responses
      - Authenticated users to read all responses
  
  2. Security
    - Maintain RLS enabled
    - Ensure proper access control for both anonymous and authenticated users
*/

DO $$
BEGIN
    -- Drop policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'responses' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        DROP POLICY "Enable read access for authenticated users" ON responses;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'responses' 
        AND policyname = 'Enable insert access for all users'
    ) THEN
        DROP POLICY "Enable insert access for all users" ON responses;
    END IF;
END $$;

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