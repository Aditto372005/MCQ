DO $$
BEGIN
    -- Drop policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'responses' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        DROP POLICY "Enable read access for authenticated users" ON public.responses;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'responses' 
        AND policyname = 'Enable insert access for all users'
    ) THEN
        DROP POLICY "Enable insert access for all users" ON public.responses;
    END IF;
END $$;

-- Create new policies with proper permissions
CREATE POLICY "Enable read access for authenticated users"
  ON public.responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON public.responses
  FOR INSERT
  TO public
  WITH CHECK (true);
