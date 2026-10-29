# Supabase Integration Guide for Portfolio CMS

## Overview

This guide covers the complete Supabase integration for your portfolio project with:

- **Admin Panel**: Full CRUD operations with real-time sync
- **Portfolio Website**: Real-time content updates without refresh
- **Database**: PostgreSQL with JSONB storage, RLS policies, and realtime subscriptions

---

## 1. Database Setup (Run in Supabase SQL Editor)

Execute the schema from `supabase-schema.sql`:

```sql
-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create portfolio_content table
CREATE TABLE portfolio_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Updated_at trigger
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

-- 4. Enable RLS
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;

-- 5. Public read policy (for portfolio visitors)
CREATE POLICY "Public read access" ON portfolio_content
    FOR SELECT USING (true);

-- 6. Admin write policy (for admin panel)
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

-- 7. Insert default data (from supabase-schema.sql)
-- ... (copy INSERT statements from supabase-schema.sql)

-- 8. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_content;

-- 9. Helper functions
CREATE OR REPLACE FUNCTION get_all_portfolio_content()
RETURNS JSONB LANGUAGE sql AS $$
    SELECT jsonb_object_agg(section_name, content) FROM portfolio_content;
$$;

CREATE OR REPLACE FUNCTION get_portfolio_section(p_section TEXT)
RETURNS JSONB LANGUAGE sql AS $$
    SELECT content FROM portfolio_content WHERE section_name = p_section;
$$;
```

---

## 2. Environment Configuration

Create `.env.local` (never commit this):

```env
# Public - safe for client-side
VITE_SUPABASE_URL=https://xhoecoqqtgymohwialsl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_jGis2ZkU7asYDhMMtXUnHg_QEL4MdI9

# Secret - ONLY for server-side/API routes
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWKS_URL=https://xhoecoqqtgymohwialsl.supabase.co/auth/v1/.well-known/jwks.json
```

---

## 3. Project Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client + types
│   └── cms.ts               # Legacy localStorage CMS (deprecated)
├── types/
│   └── supabase.ts          # Database types
├── admin/
│   ├── hooks/
│   │   └── usePortfolioContent.ts  # Admin CRUD + realtime
│   └── components/
│       └── AdminDashboard.tsx      # Updated to use Supabase
├── hooks/
│   └── usePortfolioData.ts         # Portfolio fetching + realtime
└── routes/
    └── index.tsx              # Main page using Supabase data
```

---

## 4. Admin Panel Implementation

### Key Hook: `usePortfolioContent()`

```typescript
import { usePortfolioContent } from "@/admin/hooks/usePortfolioContent";

function AdminDashboard() {
  const {
    content, // All sections data
    loading, // Initial fetch state
    saving, // Per-section saving state
    error, // Error messages
    fetchAllContent, // Refresh from server
    saveSection, // Save single section
    resetSection, // Reset to defaults
    resetAll, // Reset everything
    subscribeToChanges, // Real-time listener
  } = usePortfolioContent();

  // Save handler
  const handleSave = async (section: SectionName, data: any) => {
    await saveSection(section, data); // Upserts to Supabase
  };
}
```

### JSON Payload Examples

**Hero Section:**

```json
{
  "tag": "Available for freelance — 2026",
  "titleLines": [
    "I'm Khushi",
    "Rawat <span class=\"text-primary\">&mdash;</span>",
    "<span class=\"text-primary\">Brand Strategist</span>",
    "& Designer"
  ],
  "subtitleLines": [
    "I build brands that stop the scroll.",
    "Brand strategy, identity, social media and UI design."
  ],
  "ctaText": "View My Work",
  "secondaryCtaText": "Let's Collaborate"
}
```

**Services Section:**

```json
{
  "items": [
    { "icon": "Compass", "title": "Brand Strategy", "copy": "..." },
    { "icon": "Fingerprint", "title": "Brand Identity", "copy": "..." }
  ]
}
```

**Projects Section (array):**

```json
[
  { "name": "Picsdrop", "tag": "Branding", "desc": "...", "url": "https://..." },
  { "name": "Project 2", "tag": "UI", "desc": "...", "url": "" }
]
```

---

## 5. Portfolio Website Implementation

### Main Page: `usePortfolioData()`

```typescript
import { usePortfolioData } from '@/hooks/usePortfolioData';

function Index() {
  const { data: cmsData, loading, error, lastUpdated } = usePortfolioData();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <main>
      <Hero cms={cmsData.hero} />
      <About cms={cmsData.about} />
      <Services cms={cmsData.services} />
      <Work cms={cmsData.projects} />
      <Process cms={cmsData.process} />
      <Testimonials cms={cmsData.testimonials} />
    </main>
  );
}
```

### Real-time Updates (Automatic)

The hook automatically subscribes to Supabase Realtime:

```typescript
// Inside usePortfolioData.ts
useEffect(() => {
  const channel = supabase
    .channel("portfolio_public_changes")
    .on(
      "postgres_changes",
      {
        event: ["INSERT", "UPDATE"],
        schema: "public",
        table: "portfolio_content",
      },
      (payload) => {
        // Automatically updates local state
        const section = payload.new.section_name;
        const newData = payload.new.content;
        setData((prev) => ({ ...prev, [section]: newData }));
      },
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## 6. RLS Security Verification

### Test Policies in Supabase Dashboard

1. Go to **Authentication > Policies**
2. Verify `portfolio_content` has:
   - ✅ `Public read access` (SELECT, `true`)
   - ✅ `Admin write access` (ALL, email check)

### Test with Different Users

```sql
-- Test as anonymous (should work - read only)
SET ROLE anon;
SELECT * FROM portfolio_content;

-- Test as authenticated admin (should work - read/write)
SET ROLE authenticated;
SET request.jwt.claims = '{"email": "rawatkhushi2910@gmail.com"}';
INSERT INTO portfolio_content (section_name, content)
VALUES ('test', '{"test": true}');

-- Test as other user (should fail - write)
SET request.jwt.claims = '{"email": "other@example.com"}';
INSERT INTO portfolio_content (section_name, content)
VALUES ('test2', '{"test": true}'); -- ERROR
```

---

## 7. Deployment Checklist

### Vercel / Netlify / Cloudflare Pages

1. **Environment Variables:**

   ```
   VITE_SUPABASE_URL=https://xhoecoqqtgymohwialsl.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_jGis2ZkU7asYDhMMtXUnHg_QEL4MdI9
   ```

2. **Build Command:** `npm run build`
3. **Output Directory:** `.output/public` (or `dist`)

### Supabase Production Settings

1. **Authentication > Settings:**
   - Enable email provider
   - Add `rawatkhushi2910@gmail.com` as admin user

2. **Database > Replication:**
   - Enable `supabase_realtime` publication for `portfolio_content`

3. **API Settings:**
   - Verify anon key has `public` role
   - Service role key kept secret (server-only)

---

## 8. Troubleshooting

### Common Issues

| Issue                 | Solution                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| "Failed to fetch"     | Check `VITE_SUPABASE_URL` and network                                                |
| "Permission denied"   | Verify RLS policies and user email                                                   |
| Real-time not working | Check `ALTER PUBLICATION` ran; verify Replication settings                           |
| Build errors          | Run `npm install` after adding `@supabase/supabase-js`                               |
| Types out of sync     | Run `npx supabase gen types typescript --project-id YOUR_ID > src/types/supabase.ts` |

### Debug Commands

```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/rest/v1/portfolio_content

# Check realtime status
curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/realtime/v1/health
```

---

## 9. Migration from localStorage

The new implementation:

- ✅ Replaces `cms.ts` localStorage with Supabase
- ✅ Maintains same component interfaces (`cms` prop)
- ✅ Adds real-time sync across admin sessions
- ✅ Persists to PostgreSQL (survives deployments)
- ✅ Falls back to defaults if Supabase unavailable

### Rollback Plan

If issues arise, temporarily switch back in `index.tsx`:

```typescript
// import { cms } from '@/lib/cms';  // localStorage version
import { usePortfolioData } from "@/hooks/usePortfolioData"; // Supabase version
```

---

## 10. Performance Optimization

### For High Traffic

1. **Enable Supabase Edge Caching** for `GET /portfolio_content`
2. **Add React Query** for stale-while-revalidate:
   ```typescript
   import { useQuery } from "@tanstack/react-query";

   const { data } = useQuery({
     queryKey: ["portfolio"],
     queryFn: () => supabase.rpc("get_all_portfolio_content"),
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

### Bundle Size

- Supabase client: ~38KB gzipped
- Consider `@supabase/supabase-js` tree-shaking for smaller bundles

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Realtime Guide**: https://supabase.com/docs/guides/realtime
- **RLS Reference**: https://supabase.com/docs/guides/auth/row-level-security
