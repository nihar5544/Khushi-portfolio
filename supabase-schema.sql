-- ============================================
-- SUPABASE DATABASE SCHEMA FOR PORTFOLIO CMS
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main portfolio content table
CREATE TABLE portfolio_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_content_updated_at
    BEFORE UPDATE ON portfolio_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public read access (for portfolio website visitors)
CREATE POLICY "Public read access" ON portfolio_content
    FOR SELECT
    USING (true);

-- Policy 2: Authenticated admin write access (for admin panel)
-- This assumes you have an 'admin' role or specific user emails
CREATE POLICY "Admin write access" ON portfolio_content
    FOR ALL
    USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com'
    )
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' = 'rawatkhushi2910@gmail.com'
    );

-- Alternative: If using a custom admin role
-- CREATE POLICY "Admin write access" ON portfolio_content
--     FOR ALL
--     USING (auth.jwt() ->> 'role' = 'admin')
--     WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- DEFAULT DATA INSERTION
-- ============================================

INSERT INTO portfolio_content (section_name, content) VALUES
('hero', '{
    "tag": "Available for freelance & collaborations — 2026",
    "titleLines": [
        "I''m Khushi",
        "Rawat <span class=\"text-primary\">&mdash;</span>",
        "<span class=\"text-primary\">Brand Strategist</span>",
        "& Designer"
    ],
    "subtitleLines": [
        "I build brands that stop the scroll.",
        "Brand strategy, identity, social media and UI design for founders who refuse to blend in."
    ],
    "ctaText": "View My Work",
    "secondaryCtaText": "Let''s Collaborate"
}'::jsonb),
('about', '{
    "description1": "I''ve spent the last 3+ years designing for brands, startups and growing businesses from brand identity and social media to websites and UI.",
    "description2": "I like turning ideas into design that feels clear, memorable and actually useful. I work mainly in Figma, Canva and Adobe tools, and enjoy being involved from the first idea to the final visual.",
    "stats": [
        { "value": 3, "suffix": "+", "label": "Years Experience" },
        { "value": 10, "suffix": "+", "label": "Brands Worked With" },
        { "value": 50, "suffix": "+", "label": "Projects Delivered" }
    ]
}'::jsonb),
('services', '{
    "items": [
        { "icon": "Compass", "title": "Brand Strategy", "copy": "Logos, visual identities, colour systems and brand assets that make a business recognizable." },
        { "icon": "Fingerprint", "title": "Brand Identity & Logo Design", "copy": "Logos, type, colour and full identity kits built to last beyond a trend cycle." },
        { "icon": "Instagram", "title": "Social Media Design", "copy": "Posts, carousels, stories and content systems that keep brands consistent and engaging." },
        { "icon": "LayoutGrid", "title": "UI/UX Design", "copy": "Websites, SaaS products, dashboards and interfaces designed around real user needs." },
        { "icon": "Layers", "title": "Design Systems in Figma & Canva", "copy": "Handoff-ready libraries your team can actually run with, solo or at scale." }
    ]
}'::jsonb),
('projects', '[
    { "name": "Picsdrop", "tag": "Branding / Social Media / Website Design", "desc": "Built the visual direction for a photography business platform, from its brand presence and social content to the website experience.", "url": "https://picsdrop.in" },
    { "name": "Somenu Digital", "tag": "Branding / Social Media / UI", "desc": "Worked across the brand, social media and product interface to create a more consistent experience for a digital POS and menu platform.", "url": "https://somenu.digital" },
    { "name": "Spark Digishine", "tag": "SOCIAL MEDIA / UI / WEBSITE DESIGN", "desc": "Designed digital experiences and social content for a creative technology studio, keeping the work clear, modern and consistent across platforms.", "url": "https://sparkdigishine.com" },
    { "name": "Fishelly", "tag": "UI / SOCIAL MEDIA", "desc": "Designed the product experience and social visuals for a fish community platform, making complex features feel simple and approachable.", "url": "https://fishelly.com" },
    { "name": "Super Squirrels", "tag": "Branding / Social Media", "desc": "Created a playful visual direction across the brand and website, giving the initiative a more recognizable personality.", "url": "https://supersquirrels.org" },
    { "name": "ORIZA TEAS", "tag": "WEBSITE DESIGN / PACKAGING DESIGN", "desc": "Worked on the digital and packaging experience for a tea brand, bringing the products, visual identity and online presence together.", "url": "" }
]'::jsonb),
('process', '{
    "steps": [
        { "n": "01", "title": "Discover", "copy": "Understand the business, audience and problem." },
        { "n": "02", "title": "Strategize", "copy": "Find the right direction before designing." },
        { "n": "03", "title": "Design", "copy": "Turn the direction into a clear visual experience." },
        { "n": "04", "title": "Deliver", "copy": "Files, guidelines and handoff your team can run with." }
    ]
}'::jsonb),
('testimonials', '{
    "quotes": [
        { "quote": "Placeholder testimonial — Khushi turned a vague idea into a brand our audience instantly recognised.", "name": "Client Name", "role": "Founder, Company" },
        { "quote": "Placeholder testimonial — the social system she designed doubled how consistent our feed looks.", "name": "Client Name", "role": "Marketing Lead, Company" },
        { "quote": "Placeholder testimonial — sharp strategy, fast execution, and files our team could actually use.", "name": "Client Name", "role": "Co-founder, Company" }
    ]
}'::jsonb),
('navigation', '[
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Services", "href": "/services" },
    { "label": "Work", "href": "/work" },
    { "label": "Testimonials", "href": "/testimonials" },
    { "label": "Contact", "href": "/contact" }
]'::jsonb),
('socialLinks', '[
    { "icon": "Mail", "href": "mailto:rawatkhushi2910@gmail.com", "label": "Email" },
    { "icon": "Linkedin", "href": "https://www.linkedin.com/in/khushi-rawat-712290208/", "label": "LinkedIn" },
    { "icon": "Phone", "href": "tel:+916353561585", "label": "Phone" }
]'::jsonb)
ON CONFLICT (section_name) DO NOTHING;

-- ============================================
-- REALTIME PUBLICATION (for live updates)
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_content;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get all content as a single JSON object (for initial load)
CREATE OR REPLACE FUNCTION get_all_portfolio_content()
RETURNS JSONB
LANGUAGE sql
AS $$
    SELECT jsonb_object_agg(section_name, content)
    FROM portfolio_content;
$$;

-- Get single section content
CREATE OR REPLACE FUNCTION get_portfolio_section(p_section TEXT)
RETURNS JSONB
LANGUAGE sql
AS $$
    SELECT content FROM portfolio_content WHERE section_name = p_section;
$$;