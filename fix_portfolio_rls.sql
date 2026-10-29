-- Fix RLS policies for portfolio_content table
-- Allows authenticated admin writes, public reads

ALTER TABLE portfolio_content DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON portfolio_content;
DROP POLICY IF EXISTS "Admin write access" ON portfolio_content;

CREATE POLICY "Public read access" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON portfolio_content
    FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com')
    WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com');

ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;