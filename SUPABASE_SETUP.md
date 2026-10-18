# KrishiMitra — Supabase Setup Guide (Phase 2)

This document provides setup instructions for connecting KrishiMitra to Supabase PostgreSQL, configuring Supabase Auth, and applying database migrations.

---

## 1. Create a Supabase Project

1. Log in to [Supabase](https://supabase.com).
2. Click **New project**.
3. Choose an organization, enter a project name (e.g. `krishimitra-db`), and set a strong database password.
4. Select a region close to your users (e.g., **South Asia - Mumbai / `ap-south-1`** for Kerala & Indian farmers).
5. Click **Create new project**.

---

## 2. Obtain Project Credentials

1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) > **API**.
2. Locate the following keys:
   - **Project URL**: e.g., `https://xyzcompany.supabase.co`
   - **anon / public key**: Click `Reveal` and copy the public anon key.
   - **service_role key**: Click `Reveal` and copy the service role key. Keep this private!
3. In your local development environment:
   ```bash
   cp .env.example .env.local
   ```
4. Paste the credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
   ```

---

## 3. Apply Database Schema and Migrations

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Click **New query**.
3. Copy the entire contents of [`supabase/migrations/20261018000001_phase2_schema.sql`](./supabase/migrations/20261018000001_phase2_schema.sql).
4. Paste it into the SQL editor and click **Run**.
5. Verify the following 4 tables appear in the **Table Editor**:
   - `profiles`: Farmer user profiles linked to `auth.users` with automated trigger.
   - `farms`: Multi-farm support with area, unit, and Kerala district validation.
   - `farm_plots`: Plots nested in farms with foreign-key composite ownership enforcement.
   - `farm_crops`: Crops nested in farms and plots with growth stage and health tracking.

---

## 4. Configure Supabase Auth and URL Redirects

1. In the Supabase Dashboard, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app` (or custom domain)
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - `https://your-domain.vercel.app/**`
4. Under **Authentication** > **Providers** > **Email**:
   - Ensure **Enable Email provider** is turned **ON**.
   - (Optional for development) Disable "Confirm email" if you want instant test logins without configuring an SMTP provider. For production, keep email confirmation enabled.

---

## 5. Security and Row Level Security (RLS)

All tables have RLS enabled with explicit policies:
- Authenticated farmers can only read, insert, update, and delete their own records.
- Cross-tenant record association is blocked both at the database foreign key level (`UNIQUE(id, owner_id)`) and RLS policy level (`auth.uid() = owner_id`).
- Service role secret key is kept server-side only in `SUPABASE_SERVICE_ROLE_KEY` and never exposed to browser clients.
