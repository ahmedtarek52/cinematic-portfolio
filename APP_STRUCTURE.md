# Application Structure

## Overview

The application is a React single-page portfolio with public pages and a protected admin area. The frontend uses Supabase for authentication and database access, Cloudinary for media, and serverless API handlers for operations that need server-side credentials.

## Frontend

```text
src/
├── main.jsx                 # App entry point and shared providers
├── App.jsx                  # Root application
├── router/                  # Public and admin routes
├── pages/
│   ├── Home/
│   ├── Projects/
│   ├── Trailers/
│   ├── Services/
│   ├── About/
│   ├── Contact/
│   ├── Showreel/
│   └── admin/               # Admin pages and editors
├── components/
│   ├── layout/              # Site-wide layouts and navigation
│   ├── home/                # Homepage sections
│   ├── ui/                  # Shared interface components
│   └── admin/               # Admin layout, access control, and tools
├── contexts/                # Shared authentication state
├── services/                # Data and API operations used by pages
├── data/                    # Local/static content
└── lib/                     # Supabase client, media, and shared utilities
```

## Backend and Integrations

```text
api/
├── send-email.js            # Contact submission, database write, email notification
└── delete-image.js          # Secure Cloudinary asset deletion

scripts/
└── schema.sql               # Supabase database schema and access policies
```

- **Supabase** provides PostgreSQL data storage and admin authentication. Frontend data services read and manage portfolio content.
- **Cloudinary** stores and delivers portfolio media. Uploads are initiated from the frontend; deletion is handled by a serverless API endpoint.
- **Resend** delivers contact-form notification emails through the serverless email endpoint.

## Database

The schema in `scripts/schema.sql` defines these main tables:

- `projects` and `trailers` — portfolio work and video content
- `about_content`, `contact_info`, `services`, and `careers` — editable site content
- `contact_messages` — submitted contact inquiries

## High-Level Data Flow

```text
Browser
  ├── Pages and admin tools
  ├── Service modules ───────────────> Supabase (Auth and PostgreSQL)
  ├── Media uploads ────────────────> Cloudinary
  └── Contact form / media deletion > Serverless API (api/)
                                          ├── Supabase
                                          ├── Resend
                                          └── Cloudinary
```
