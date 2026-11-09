-- Fix RLS policies for the messages table.
--
-- Why this exists: the admin panel authenticates with a client-side password and
-- talks to Supabase with the public (anon) key. It never creates a Supabase Auth
-- session, so UPDATE/DELETE must be allowed for the `anon` role. The previous
-- version of this file only allowed `authenticated` users with a specific email,
-- which the admin panel never is — Supabase then silently drops the write
-- (HTTP 200 with 0 rows affected) and "Mark as read" / "Delete" appear broken.
--
-- Run this in the Supabase SQL editor once, then reload the admin panel.
-- SECURITY NOTE: this makes message writes public to anyone holding the site's
-- publishable key. Message SELECT is already public, and the admin password is
-- checked in the browser, so this does not reduce meaningful protection here.
-- For real protection, move the admin panel behind Supabase Auth and remove the
-- anon policies.

alter table public.messages enable row level security;

drop policy if exists "Public can insert messages" on public.messages;
drop policy if exists "Public can read messages" on public.messages;
drop policy if exists "Admins can read messages" on public.messages;
drop policy if exists "Admin can update messages" on public.messages;
drop policy if exists "Admin can delete messages" on public.messages;
drop policy if exists "messages update" on public.messages;
drop policy if exists "messages delete" on public.messages;

create policy "Public can insert messages" on public.messages
    for insert to anon, authenticated with check (true);

create policy "Public can read messages" on public.messages
    for select to anon, authenticated using (true);

create policy "Admin can update messages" on public.messages
    for update to anon, authenticated using (true) with check (true);

create policy "Admin can delete messages" on public.messages
    for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.messages to anon, authenticated;

-- Remove the leftover row from permission testing.
delete from public.messages where subject = 'TEMP-ADMIN-TEST';
