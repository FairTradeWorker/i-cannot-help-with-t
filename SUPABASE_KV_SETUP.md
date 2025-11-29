# Supabase KV Setup Guide

This guide explains how to set up Supabase for the KV proxy system.

## Overview

The KV proxy mimics Spark KV's API (`window.spark.kv`) but stores data in Supabase tables. Each namespace (e.g., 'users', 'jobs') gets its own table.

## Quick Start

1. **Create Supabase Account** (if you don't have one)
   - Visit: https://supabase.com/dashboard
   - Sign up for free (no credit card required)

2. **Create a New Project**
   - Click "New Project"
   - Choose organization
   - Enter project name (e.g., "fairtradeworker")
   - Set database password (save it!)
   - Choose region closest to you
   - Wait ~2 minutes for setup

3. **Get Your Credentials**
   - Go to: Project Settings → API
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy **anon public** key (starts with `eyJ...`)

4. **Create Tables** (see Step 1 below)

5. **Add Environment Variables** (see Step 2 below)

## Step 1: Create Supabase Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Table for 'users' namespace
CREATE TABLE IF NOT EXISTS kv_users (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for 'jobs' namespace
CREATE TABLE IF NOT EXISTS kv_jobs (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for 'default' namespace (fallback)
CREATE TABLE IF NOT EXISTS kv_default (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kv_users_updated ON kv_users(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_jobs_updated ON kv_jobs(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_default_updated ON kv_default(updated_at);

-- Enable Row Level Security (RLS) - adjust policies as needed
ALTER TABLE kv_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_default ENABLE ROW LEVEL SECURITY;

-- Example policy: Allow all operations (adjust for your security needs)
CREATE POLICY "Allow all operations on kv_users" ON kv_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_jobs" ON kv_jobs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_default" ON kv_default
  FOR ALL USING (true) WITH CHECK (true);
```

## Step 2: Environment Variables

### Local Development

Create or update your `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_KV_PROXY=true
```

**Where to find these values:**
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
- **Project URL** = `VITE_SUPABASE_URL`
- **anon public** key = `VITE_SUPABASE_ANON_KEY`

### Vercel Deployment

Add the same variables in Vercel:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: Settings → Environment Variables
4. Add:
   - `VITE_SUPABASE_URL` (Production, Preview, Development)
   - `VITE_SUPABASE_ANON_KEY` (Production, Preview, Development)
   - `VITE_USE_KV_PROXY` = `true` (Production, Preview, Development)

**Note:** Vercel serverless functions can also access these without the `VITE_` prefix, but using `VITE_` keeps it consistent.

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_KV_PROXY=true  # Set to 'false' to disable proxy
```

Or for Vercel deployment, add them in the Vercel dashboard:
- Settings → Environment Variables

## Step 3: How It Works

### Key Structure
- Key: `users` → Table: `kv_users`
- Key: `jobs/123` → Table: `kv_jobs` (namespace is `jobs`)
- Key: `first-300-count` → Table: `kv_default` (no namespace)

### API Endpoints
- `GET /api/spark/kv/{key}` - Get value
- `POST /api/spark/kv/{key}` - Set value
- `PUT /api/spark/kv/{key}` - Set value (same as POST)
- `DELETE /api/spark/kv/{key}` - Delete value

### Fallback Behavior
1. **Proxy fails** → Falls back to `window.spark.kv` (original Spark KV)
2. **Both fail** → Falls back to `localStorage` (dev/offline mode)

## Step 4: Usage

The proxy is automatically used when `VITE_USE_KV_PROXY=true`. Your existing code using `window.spark.kv` will work without changes if you replace it with the wrapper:

```typescript
// Instead of:
await window.spark.kv.get('users')

// Use:
import { kvWrapper } from '@/lib/spark-kv-wrapper';
await kvWrapper.get('users')
```

Or update `src/lib/store.ts` to use `kvWrapper` instead of `window.spark.kv`.

## Step 5: Testing

1. Set environment variables
2. Create tables in Supabase
3. Test with:
   ```typescript
   await kvWrapper.set('test-key', { test: 'value' });
   const value = await kvWrapper.get('test-key');
   console.log(value); // Should log { test: 'value' }
   ```

## Troubleshooting

### "Table does not exist" error
- Make sure you've created the table in Supabase
- Check the namespace matches the table name (e.g., 'users' → `kv_users`)

### "KV unavailable" error
- Check Supabase credentials in environment variables
- Verify RLS policies allow operations
- Check browser console for detailed errors

### Parse errors
- The proxy now uses `res.text()` + safe JSON parsing
- Always returns valid JSON, never HTML
- Falls back gracefully on errors

## Additional Tables

Create tables for other namespaces as needed:
- `kv_territories` for territory data
- `kv_notifications` for notifications
- `kv_earnings` for earnings data
- etc.

Use the same pattern: `CREATE TABLE kv_{namespace} (id TEXT PRIMARY KEY, data JSONB, updated_at TIMESTAMP)`

