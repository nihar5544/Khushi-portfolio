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

-- Admins can read all messages
CREATE POLICY "Admins can read messages" ON messages
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com'
    );

-- Admin can mark as read
CREATE POLICY "Admin can update messages" ON messages
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com'
    );