# PRD Addendum: Dynamic Backend (Supabase + Cloudinary) & Admin Dashboard
**Project:** Cinematic Portfolio (Spectra Post / Abo Hussain Studio)
**Extends:** `PRD.md` (v1.0.0 — Static Data Architecture)
**Document Version:** 2.0.0
**Status:** Draft — Implementation Plan for Editor/IDE Execution
**Target Stack Additions:** Supabase (Postgres + Auth + RLS + Storage), Cloudinary (Media CDN, free plan), React Admin Dashboard (protected routes)

---

## 0. Purpose of This Document

The base PRD describes a fully static site (`src/data/*.js` as a mock CMS). This document is the execution plan to:

1. Move all content (`projects`, `trailers`, `about`, `contact`, `services`, `careers`) from static JS modules into **Supabase Postgres**, preserving the existing TypeScript-documented shapes so public-facing components need minimal changes.
2. Store all media (stills, thumbnails, hero images, art collection images) on **Cloudinary free plan**, replacing `public/images/...` paths with Cloudinary URLs.
3. Build a **protected `/admin` dashboard** inside the same Vite app for full CRUD (Create, Read, Update, Delete) on all entities, including nested/array fields (stills, credits, tags, tech specs).
4. Keep the public site's data-fetching layer swappable and typed, so the transition from static → dynamic doesn't break `ProjectDetails.jsx`, `getRelatedProjects()`, etc.

This doc is written so an AI coding assistant operating inside an editor (Claude Code, Cursor, Windsurf, etc.) can execute it phase-by-phase without additional clarification.

---

## 1. High-Level Architecture

```
+-----------------------------------------------------------------------------------+
|                              CINEMATIC PORTFOLIO (Vite)                           |
|                                                                                    |
|  PUBLIC SITE (existing routes)          ADMIN DASHBOARD (new, protected)          |
|  /, /projects, /trailers, /about ...    /admin/login, /admin/projects, ...        |
|         |                                        |                                |
|         v                                        v                                |
|  src/services/*.js  <--- shared data access layer (supabase-js queries) --->      |
|         |                                        |                                |
|         v                                        v                                |
|  +--------------------------+          +---------------------------------+        |
|  |  Supabase Postgres       |          |  Supabase Auth (admin user)     |        |
|  |  projects, trailers,     |<-------->|  email/password, JWT session    |        |
|  |  about, contact, etc.    |          |  RLS: public SELECT, admin ALL  |        |
|  +--------------------------+          +---------------------------------+        |
|         |                                                                         |
|         v                                                                         |
|  image URLs (Cloudinary secure_url) stored as text/text[] columns                 |
|                                                                                     |
|  +--------------------------+                                                     |
|  |  Cloudinary (free tier)  |  <-- unsigned upload preset, browser-direct upload  |
|  |  /portfolio/projects/... |      from Admin Dashboard (no backend needed)       |
|  +--------------------------+                                                     |
+-----------------------------------------------------------------------------------+
```

**Key decision:** No custom backend server. `supabase-js` and Cloudinary's unsigned upload API are called directly from the React app. Security is enforced via Supabase Row Level Security (RLS) and Cloudinary's upload-preset restrictions (folder scoping, file-type/size limits).

---

## 2. Supabase Setup

### 2.1 Project & Environment Variables
Create a Supabase project (free tier). Add to `.env` (and `.env.example`):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned-preset-name>
```

Never expose the Supabase **service_role** key or Cloudinary **API secret** in the frontend. Only `anon` key + unsigned preset are used client-side.

### 2.2 Database Schema (SQL Migration)

Nested value objects that don't need independent querying (`techSpecs`, `TrailerSpecs`, `credits`, `AboutData.profile`, etc.) are stored as **JSONB** to minimize join complexity in a small single-tenant app. Arrays of strings (`tags`, `services`, `stills`) use Postgres `text[]`.

```sql
-- ============ PROJECTS ============
create table projects (
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
create table trailers (
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
create table about_content (
  id int primary key default 1 check (id = 1), -- enforce single row
  hero jsonb not null default '{}',       -- { title, description, backgroundImage }
  profile jsonb not null default '{}',    -- { image, name, title, bio, ... }
  sections jsonb not null default '[]',   -- [{ title, description, image, cta, imagePosition }]
  skills jsonb not null default '[]',     -- [{ category, items }]
  updated_at timestamptz not null default now()
);

-- ============ CONTACT INFO (singleton row) ============
create table contact_info (
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
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- ============ SERVICES ============
create table services (
  id text primary key,
  title text not null,
  description text,
  icon text,
  details jsonb not null default '[]',
  sort_order int not null default 0
);

-- ============ CAREERS ============
create table careers (
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

-- updated_at auto-touch trigger (reusable)
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
```

### 2.3 Row Level Security (RLS)

Enable RLS on every table. Public (anon) gets read-only on content tables; only authenticated admin can write. `contact_messages` is admin-only for both read and write-via-insert should be allowed for anon (so the public contact form can submit), but SELECT is admin-only.

```sql
alter table projects enable row level security;
alter table trailers enable row level security;
alter table about_content enable row level security;
alter table contact_info enable row level security;
alter table contact_messages enable row level security;
alter table services enable row level security;
alter table careers enable row level security;

-- Public read policies
create policy "public read projects" on projects for select using (true);
create policy "public read trailers" on trailers for select using (true);
create policy "public read about" on about_content for select using (true);
create policy "public read contact_info" on contact_info for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read careers" on careers for select using (true);

-- Public insert-only on contact_messages (the contact form)
create policy "public insert contact_messages" on contact_messages
  for insert with check (true);

-- Admin (authenticated) full access — repeat per table
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
```

Since this is a **single-admin** studio site, "authenticated" is a sufficient gate — no separate roles table needed. If multi-admin roles are ever required, add a `profiles` table with a `role` column and check that instead.

### 2.4 Admin User
Create the one admin account via Supabase Dashboard → Authentication → Users → Add User (email + password), or via `supabase.auth.admin.createUser` in a one-off setup script. Disable public sign-ups in Auth settings so no one else can register.

---

## 3. Cloudinary Setup (Free Plan)

### 3.1 Account & Upload Preset
1. Create a free Cloudinary account, note the **Cloud Name**.
2. Settings → Upload → Add an **unsigned upload preset** (e.g. `portfolio_unsigned`).
3. Restrict the preset: set an allowed folder root (e.g. `portfolio/`), restrict formats to `jpg,png,webp,avif`, cap file size (~10MB), enable `unique_filename` + `overwrite: false`.
4. Free plan limits to design around: **25 monthly credits** (~25GB combined storage/bandwidth/transformations), 10MB max upload by default. Compress/resize on upload (Cloudinary can auto-convert to `f_auto,q_auto`) to conserve credits.

### 3.2 Folder Convention
```
portfolio/
  projects/{project-id}/hero.jpg
  projects/{project-id}/thumbnail.jpg
  projects/{project-id}/stills/{n}.jpg
  trailers/{trailer-id}/thumbnail.jpg
  about/profile.jpg
  about/sections/{n}.jpg
```

### 3.3 Client-Side Upload Flow (no backend needed)
Direct browser POST to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` using `FormData` with `file`, `upload_preset`, and `folder`. Store the returned `secure_url` (and optionally `public_id`, for future deletion) in the corresponding Supabase column.

```js
// src/lib/cloudinary.js
export async function uploadToCloudinary(file, folder) {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
```

**Deletion note:** unsigned presets cannot delete assets (requires the API secret). For the admin "delete image" action, either (a) just remove the URL reference from Supabase and leave the orphaned asset in Cloudinary (acceptable on free tier, low volume), or (b) add a minimal Supabase Edge Function that holds the Cloudinary API secret and performs signed deletes. Recommend (a) for MVP, (b) as a Phase 6 hardening step.

---

## 4. Data Access Layer (Shared by Public Site + Admin)

Replace `src/data/*.js` static modules with `src/services/*.js`, preserving exported helper function names/signatures so page components require minimal edits.

```
src/
  lib/
    supabaseClient.js       # createClient(url, anonKey)
    cloudinary.js           # uploadToCloudinary()
  services/
    projects.js             # getAllProjects, getProjectById, getRelatedProjects,
                             #   getCategories, getServicesList, getYears,
                             #   createProject, updateProject, deleteProject
    trailers.js              # getAllTrailers, getTrailerById,
                             #   createTrailer, updateTrailer, deleteTrailer
    about.js                 # getAboutContent, updateAboutContent
    contact.js                # getContactInfo, updateContactInfo,
                             #   submitContactMessage, getContactMessages, markMessageRead
    services-catalog.js       # CRUD for the "services" table (studio offerings)
    careers.js                 # CRUD for careers/openings
```

Example (`src/services/projects.js`):

```js
import { supabase } from "../lib/supabaseClient";

export async function getAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map(mapRowToProject);
}

export async function getProjectById(id) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return mapRowToProject(data);
}

export async function getRelatedProjects(currentProjectId, limit = 2) {
  const current = await getProjectById(currentProjectId);
  const all = await getAllProjects();
  return all
    .filter((p) => p.id !== currentProjectId)
    .filter((p) => p.category === current.category || p.services.some((s) => current.services.includes(s)))
    .slice(0, limit);
}

export async function getCategories() {
  const all = await getAllProjects();
  return [...new Set(all.map((p) => p.category))].sort();
}

// createProject / updateProject / deleteProject used by the admin dashboard
export async function createProject(payload) {
  const { data, error } = await supabase.from("projects").insert(mapProjectToRow(payload)).select().single();
  if (error) throw error;
  return mapRowToProject(data);
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase
    .from("projects")
    .update(mapProjectToRow(payload))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRowToProject(data);
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// snake_case (DB) <-> camelCase (app) mapping keeps components untouched
function mapRowToProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    year: row.year,
    type: row.type,
    heroImage: row.hero_image,
    thumbnail: row.thumbnail,
    description: row.description,
    services: row.services,
    tags: row.tags,
    metadata: row.metadata,
    overview: row.overview,
    approach: row.approach,
    stills: row.stills,
    credits: row.credits,
    techSpecs: row.tech_specs,
    vimeo: row.vimeo,
  };
}

function mapProjectToRow(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    type: p.type,
    hero_image: p.heroImage,
    thumbnail: p.thumbnail,
    description: p.description,
    services: p.services,
    tags: p.tags,
    metadata: p.metadata,
    overview: p.overview,
    approach: p.approach,
    stills: p.stills,
    credits: p.credits,
    tech_specs: p.techSpecs,
    vimeo: p.vimeo,
  };
}
```

Apply the same row-mapping pattern to `trailers.js`, `about.js`, `contact.js`, `services-catalog.js`, `careers.js`.

### 4.1 Fetching Strategy
Use **`@tanstack/react-query`** (add dependency) for caching, loading/error states, and automatic refetch after admin mutations — critical for the admin dashboard's list views to reflect changes immediately after create/edit/delete without full reloads.

---

## 5. Admin Authentication

```
src/
  contexts/
    AuthContext.jsx      # wraps supabase.auth session, exposes { user, signIn, signOut, loading }
  components/
    admin/
      ProtectedRoute.jsx # redirects to /admin/login if no session
```

`AuthContext.jsx` subscribes to `supabase.auth.onAuthStateChange` and exposes the current session. `ProtectedRoute` wraps every `/admin/*` route except `/admin/login`.

```js
// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Login form posts to `supabase.auth.signInWithPassword({ email, password })`. No public registration UI exists anywhere in the app.

---

## 6. Admin Dashboard — Routes & Screens

Add to `AppRouter.jsx` under a separate `AdminLayout` (no public Navbar/Footer — a dedicated sidebar shell).

| Route | Purpose |
| :--- | :--- |
| `/admin/login` | Email/password sign-in form |
| `/admin` | Dashboard home: entity counts, recent contact messages, quick links |
| `/admin/projects` | Table of all projects — search, filter by category, drag-to-reorder (`sort_order`), delete w/ confirm |
| `/admin/projects/new` | Full create form (see 6.1) |
| `/admin/projects/:id/edit` | Edit form, pre-filled |
| `/admin/trailers` | Table of trailers, same list/search/reorder pattern |
| `/admin/trailers/new` / `/admin/trailers/:id/edit` | Trailer form |
| `/admin/about` | Single-record editor for hero/profile/sections/skills (repeatable-field editor, no list needed) |
| `/admin/services` | CRUD for studio service offerings |
| `/admin/careers` | CRUD for job openings, active/inactive toggle |
| `/admin/contact` | Edit studio contact info (locations, email, social links) |
| `/admin/messages` | Read-only inbox of contact form submissions, mark-as-read |

### 6.1 Project Create/Edit Form — Field-to-Component Mapping

This is the most complex form due to nested arrays; it's the reference pattern for all other nested-array forms.

| PRD Field | Form Control |
| :--- | :--- |
| `title`, `category`, `type`, `year` | Text/select inputs |
| `heroImage`, `thumbnail` | `<CloudinaryUploader />` — drag/drop or click, shows preview, uploads on file select, stores returned URL in form state |
| `stills[]` | `<MultiImageUploader />` — grid of uploaded thumbnails with drag-to-reorder + per-image delete, "Add Stills" button appends more |
| `services[]`, `tags[]` | `<TagInput />` — chip-style input, press Enter/comma to add, click × to remove |
| `credits[]` | `<RepeatingFieldGroup />` — rows of `{ role (select or free text), name (text) }` with "Add Credit" / remove-row buttons |
| `techSpecs` (object) | Four labeled text inputs (`master`, `colorSpace`, `hdr`, `pipeline`) inside a fieldset |
| `description`, `overview`, `approach` | `<textarea>` (approach/overview can be longer, use a simple markdown-lite textarea; rich text editor is out of scope for MVP) |
| `vimeo` | Text input (optional, nullable) |
| `sort_order` | Numeric input or derived from drag position in the list view |

Validation: `react-hook-form` + `zod` schema mirroring the TypeScript interfaces in PRD.md §4.1–4.2, so the schema doubles as living documentation.

### 6.2 Reusable Admin Components to Build

```
src/components/admin/
  AdminLayout.jsx          # Sidebar nav + topbar with sign-out
  DataTable.jsx            # Generic sortable/searchable table (used by projects, trailers, careers)
  CloudinaryUploader.jsx   # Single-image upload w/ preview + progress state
  MultiImageUploader.jsx   # Multi-image upload w/ reorder (stills gallery)
  TagInput.jsx             # Chip input for string[] fields
  RepeatingFieldGroup.jsx  # Generic add/remove row group for object[] fields (credits, skills, sections)
  ConfirmDeleteDialog.jsx  # Shared destructive-action confirmation modal
  Toast.jsx / useToast.js  # Success/error feedback after mutations
```

---

## 7. Updated Project Structure (Additions Only)

```
cinematic-portfolio/
├── src/
│   ├── lib/
│   │   ├── supabaseClient.js       # NEW
│   │   └── cloudinary.js           # NEW
│   ├── services/                   # NEW — replaces src/data/*.js at runtime
│   │   ├── projects.js
│   │   ├── trailers.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   ├── services-catalog.js
│   │   └── careers.js
│   ├── contexts/
│   │   └── AuthContext.jsx         # NEW
│   ├── components/
│   │   └── admin/                  # NEW — see 6.2
│   ├── pages/
│   │   └── admin/                  # NEW
│   │       ├── Login.jsx
│   │       ├── DashboardHome.jsx
│   │       ├── ProjectsList.jsx
│   │       ├── ProjectForm.jsx
│   │       ├── TrailersList.jsx
│   │       ├── TrailerForm.jsx
│   │       ├── AboutEditor.jsx
│   │       ├── ServicesList.jsx
│   │       ├── CareersList.jsx
│   │       ├── ContactInfoEditor.jsx
│   │       └── MessagesInbox.jsx
│   ├── data/                       # KEPT temporarily as seed source (Phase 1), then deprecated
│   └── router/AppRouter.jsx        # MODIFIED — add /admin/* route tree
├── scripts/
│   └── seed-supabase.mjs           # NEW — one-off migration script (see §8.2)
└── .env.example                    # NEW
```

---

## 8. Migration & Implementation Phases

### Phase 0 — Provisioning (manual, ~30 min)
- Create Supabase project, run schema SQL (§2.2), apply RLS policies (§2.3), create the admin user (§2.4).
- Create Cloudinary account, configure unsigned upload preset (§3.1).
- Add `.env` with all four variables; add `.env.example` (no real values) to the repo.

### Phase 1 — Dependencies & Client Setup
```bash
npm install @supabase/supabase-js @tanstack/react-query react-hook-form zod @hookform/resolvers
```
Create `src/lib/supabaseClient.js`, `src/lib/cloudinary.js`, wrap `App.jsx` in `QueryClientProvider` and `AuthContext.Provider`.

### Phase 2 — Data Migration (seed script)
Write `scripts/seed-supabase.mjs`: import the existing `src/data/projects.js`, `trailers.js`, etc., transform each record with the row-mapping functions from §4, and bulk-insert into Supabase via a **service_role**-keyed client (this script runs locally/Node only — service key never ships to the browser). Upload each referenced local image in `public/images/` to Cloudinary first, capture the returned URL, and substitute it before insert.

### Phase 3 — Swap Public Site to Dynamic Data
Replace static imports (`import { projects } from '../../data/projects'`) in `Projects.jsx`, `ProjectDetails.jsx`, `FeaturedWorks.jsx`, `Trailers.jsx`, `CinematicTrailers.jsx`, `About.jsx`, `Contact.jsx` with the new `services/*.js` functions wrapped in `useQuery` hooks. Add loading skeletons and error states consistent with the existing dark cinematic theme. Once verified, remove `src/data/*.js`.

### Phase 4 — Admin Auth & Shell
Build `AuthContext`, `ProtectedRoute`, `AdminLayout`, `/admin/login`. Verify sign-in/sign-out and route protection before building any CRUD screens.

### Phase 5 — CRUD Screens (build in this order, reusing components as they mature)
1. Projects (full nested form — establishes the reusable pattern)
2. Trailers
3. About (singleton editor)
4. Services & Careers
5. Contact Info + Messages inbox

### Phase 6 — Hardening & Polish
- Add optimistic UI updates via React Query mutations.
- Add image-delete Edge Function (signed Cloudinary delete) if orphaned-asset accumulation becomes a concern.
- Add basic rate-limiting/honeypot to the public contact form to protect the free-tier `contact_messages` insert policy from spam.
- Confirm RLS by testing all admin endpoints while logged out (should fail) and while logged in (should succeed).
- Lighthouse pass on public pages to confirm the dynamic-fetch swap didn't regress performance (add `staleTime` in React Query to avoid redundant refetches).

---

## 9. Environment Variables Reference (`.env.example`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```
(`SUPABASE_SERVICE_ROLE_KEY` is used only in `scripts/seed-supabase.mjs`, run locally, and must never be committed or exposed to Vite's client bundle — do not prefix it with `VITE_`.)

---

## 10. Free-Plan Constraints to Design Around

| Service | Free-Tier Limit | Design Implication |
| :--- | :--- | :--- |
| Supabase | 500MB DB, 1GB file storage, 50k monthly active users, project pauses after 7 days inactivity | JSONB-heavy schema keeps row sizes small; images live on Cloudinary, not Supabase Storage, avoiding the file-storage cap. Ping the project periodically (or note the pause behavior) if traffic is low. |
| Cloudinary | ~25 monthly credits (storage+bandwidth+transforms combined), 10MB/file default | Use `f_auto,q_auto` delivery transformations to shrink bandwidth; keep stills count per project reasonable; monitor usage dashboard. |

---

## 11. Editor/IDE Execution Checklist

When implementing in an AI coding IDE, follow this literal order — each step should be a separate commit/PR-sized unit of work:

1. [ ] Run schema SQL + RLS policies in Supabase SQL editor; create admin user.
2. [ ] Configure Cloudinary unsigned upload preset.
3. [ ] `npm install` new dependencies (§8 Phase 1); add `.env` + `.env.example`.
4. [ ] Create `src/lib/supabaseClient.js`, `src/lib/cloudinary.js`.
5. [ ] Create `src/services/*.js` with full CRUD + row mapping for each entity.
6. [ ] Write and run `scripts/seed-supabase.mjs` to migrate existing static data + images.
7. [ ] Swap public pages to `useQuery`-backed data fetching; delete `src/data/*.js` once verified.
8. [ ] Build `AuthContext`, `ProtectedRoute`, `/admin/login`, `AdminLayout`.
9. [ ] Build shared admin components (`DataTable`, `CloudinaryUploader`, `MultiImageUploader`, `TagInput`, `RepeatingFieldGroup`).
10. [ ] Build Projects CRUD screens (list + form) — establishes the pattern.
11. [ ] Build Trailers CRUD screens.
12. [ ] Build About singleton editor.
13. [ ] Build Services & Careers CRUD screens.
14. [ ] Build Contact Info editor + Messages inbox.
15. [ ] Add loading/error/empty states across all admin screens.
16. [ ] RLS verification pass (logged-out vs logged-in checks).
17. [ ] Deploy: add env vars to hosting provider (Vercel, per existing `vercel.json`), confirm production Supabase/Cloudinary keys are the live project's, not local dev.
