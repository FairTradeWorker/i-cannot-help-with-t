# Quick Supabase Setup (5 Minutes)

## Step 1: Create Supabase Account & Project

1. Go to: https://supabase.com/dashboard
2. Click "Start your project" → Sign up (free, no credit card)
3. Click "New Project"
4. Fill in:
   - **Name**: `fairtradeworker` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait ~2 minutes for setup

## Step 2: Get Your Credentials

1. In your project dashboard, click **Settings** (gear icon) → **API**
2. Copy these two values:

   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Create Database Tables

1. In your project dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste this SQL:

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

-- Enable Row Level Security (RLS)
ALTER TABLE kv_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_default ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for your security needs)
CREATE POLICY "Allow all operations on kv_users" ON kv_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_jobs" ON kv_jobs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_default" ON kv_default
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Add Environment Variables

### Local Development

Create/update `.env` file in project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_KV_PROXY=true
```

### Vercel Deployment

1. Go to: https://vercel.com/dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add each variable:
   - `VITE_SUPABASE_URL` = (your Project URL)
   - `VITE_SUPABASE_ANON_KEY` = (your anon key)
   - `VITE_USE_KV_PROXY` = `true`
4. Select all environments (Production, Preview, Development)
5. Click **Save**

## Step 5: Test It

Restart your dev server:

```bash
npm run dev
```

The KV proxy will now use Supabase instead of Spark KV!

## Troubleshooting

**"Table does not exist"**
- Make sure you ran the SQL script in Step 3
- Check the table exists in: Database → Tables

**"KV unavailable"**
- Check your `.env` file has the correct values
- Make sure you copied the **anon public** key (not the service_role key)
- Restart your dev server after changing `.env`

**Still using Spark KV?**
- Check `VITE_USE_KV_PROXY=true` is set
- Check browser console for errors
- The proxy falls back to Spark KV if Supabase fails

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Project Dashboard: https://supabase.com/dashboard
- SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

