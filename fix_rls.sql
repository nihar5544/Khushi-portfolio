-- Fix RLS policies for messages table
-- Allows anon reads (matches insert behavior)

ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert messages" ON messages;
DROP POLICY IF EXISTS "Admins can read messages" ON messages;
DROP POLICY IF EXISTS "Admin can update messages" ON messages;

CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Admin can update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com') WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com');

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;