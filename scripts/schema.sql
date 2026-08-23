-- ============================================================
-- Cinematic Portfolio — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- ============ PROJECTS ============
create table if not exists projects (
  id text primary key,                 -- slug, e.g. "nocturne"
  title text not null,
  category text not null,
  year text not null,
  type text not null,
  hero_image text not null,            -- Cloudinary secure_url
  thumbnail text not null,             -- Cloudinary secure_url
  description text not null,
  services text[] not null default '{}',
  tags text[] not null default '{}',
  metadata text,
  overview text,
  approach text,
  stills text[] not null default '{}', -- array of Cloudinary URLs
  credits jsonb not null default '[]', -- [{ role, name }]
  tech_specs jsonb not null default '{}', -- { master, colorSpace, hdr, pipeline }
  vimeo text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ TRAILERS ============
create table if not exists trailers (
  id text primary key,
  vimeo_id text not null,
  title text not null,
  subtitle text,
  year text,
  duration text,
  category text,
  filter_category text,
  genre text,
  client text,
  thumbnail text,
  vimeo_review_url text,
  description text,
  specs jsonb not null default '{}',   -- { resolution, colorSpace, sound, role }
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ ABOUT (singleton row) ============
create table if not exists about_content (
  id int primary key default 1 check (id = 1), -- enforce single row
  hero jsonb not null default '{}',       -- { title, description, backgroundImage }
  profile jsonb not null default '{}',    -- { image, name, title, bio, ... }
  sections jsonb not null default '[]',   -- [{ title, description, image, cta, imagePosition }]
  skills jsonb not null default '[]',     -- [{ category, items }]
  updated_at timestamptz not null default now()
);

-- ============ CONTACT INFO (singleton row) ============
create table if not exists contact_info (
  id int primary key default 1 check (id = 1),
  heading text,
  title text,
  residing jsonb not null default '{}',
  state_home jsonb not null default '{}',
  email text,
  kakao text,
  social jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ============ CONTACT MESSAGES (form submissions, admin-only read) ============
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- ============ SERVICES ============
create table if not exists services (
  id text primary key,
  title text not null,
  description text,
  icon text,
  details jsonb not null default '[]',
  sort_order int not null default 0
);

-- ============ CAREERS ============
create table if not exists careers (
  id text primary key,
  title text not null,
  department text,
  location text,
  type text,
  description text,
  requirements text[] not null default '{}',
  active boolean not null default true,
  sort_order int not null default 0
);


-- ============================================================
-- updated_at auto-touch trigger (reusable)
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();
create trigger trg_trailers_updated before update on trailers
  for each row execute function set_updated_at();
create trigger trg_about_updated before update on about_content
  for each row execute function set_updated_at();
create trigger trg_contact_info_updated before update on contact_info
  for each row execute function set_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table projects enable row level security;
alter table trailers enable row level security;
alter table about_content enable row level security;
alter table contact_info enable row level security;
alter table contact_messages enable row level security;
alter table services enable row level security;
alter table careers enable row level security;

-- Public read policies (anyone can SELECT)
create policy "public read projects" on projects for select using (true);
create policy "public read trailers" on trailers for select using (true);
create policy "public read about" on about_content for select using (true);
create policy "public read contact_info" on contact_info for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read careers" on careers for select using (true);

-- Public insert-only on contact_messages (public contact form)
create policy "public insert contact_messages" on contact_messages
  for insert with check (true);

-- Admin (authenticated) full access — all tables
create policy "admin all projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all trailers" on trailers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all about" on about_content for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all contact_info" on contact_info for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read contact_messages" on contact_messages for select
  using (auth.role() = 'authenticated');
create policy "admin update contact_messages" on contact_messages for update
  using (auth.role() = 'authenticated');
create policy "admin all services" on services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all careers" on careers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
