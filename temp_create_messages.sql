-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'Portfolio Inquiry',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_status BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can insert messages
CREATE POLICY "Public can insert messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Public can read all messages
-- (the admin panel uses the publishable/anon key, not a Supabase Auth session)
CREATE POLICY "Public can read messages" ON messages
    FOR SELECT TO anon, authenticated USING (true);

-- Admin panel can mark as read
CREATE POLICY "Admin can update messages" ON messages
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Admin panel can delete
CREATE POLICY "Admin can delete messages" ON messages
    FOR DELETE TO anon, authenticated USING (true);