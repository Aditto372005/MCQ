/*
  # Fix RLS policies for responses table

  1. Changes
    - Drop existing policies safely using DO block
    - Recreate policies with correct permissions:
      - Allow public access for inserts
      - Allow authenticated users to read all responses
  
  2. Security
    - Enable RLS on responses table
    - Add policy for authenticated users to read responses
    - Add policy for public users to insert responses
*/

-- First ensure RLS is enabled
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies
DO $$
BEGIN
    -- Drop all existing policies on the responses table
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.responses;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON public.responses;
    DROP POLICY IF EXISTS "Allow authenticated users to read responses" ON public.responses;
    DROP POLICY IF EXISTS "Allow anyone to insert responses" ON public.responses;
    DROP POLICY IF EXISTS "Enable insert access for anonymous users" ON public.responses;
END $$;

-- Create fresh policies
CREATE POLICY "responses_select_policy"
    ON public.responses
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "responses_insert_policy"
    ON public.responses
    FOR INSERT
    TO public
    WITH CHECK (true);