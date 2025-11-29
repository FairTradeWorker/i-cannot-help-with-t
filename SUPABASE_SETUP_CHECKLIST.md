# Complete Supabase Setup Checklist ✅

Follow this checklist step-by-step to set up Supabase for the KV proxy system.

## Phase 1: Create Supabase Account & Project

- [ ] **Step 1.1**: Go to https://supabase.com/dashboard
- [ ] **Step 1.2**: Click "Start your project" or "Sign in"
- [ ] **Step 1.3**: Sign up with GitHub/Google/Email (free tier is fine)
- [ ] **Step 1.4**: Click "New Project" button
- [ ] **Step 1.5**: Fill in project details:
  - [ ] **Name**: `fairtradeworker` (or your preferred name)
  - [ ] **Database Password**: Create a strong password (SAVE THIS!)
  - [ ] **Region**: Choose closest to you (e.g., `US East`, `US West`, `EU`)
  - [ ] **Pricing Plan**: Free tier (no credit card required)
- [ ] **Step 1.6**: Click "Create new project"
- [ ] **Step 1.7**: Wait 2-3 minutes for project to initialize
- [ ] **Step 1.8**: Verify project status shows "Active" (green checkmark)

## Phase 2: Get Your Credentials

- [ ] **Step 2.1**: In your project dashboard, click **Settings** (gear icon in left sidebar)
- [ ] **Step 2.2**: Click **API** in the settings menu
- [ ] **Step 2.3**: Find **Project URL** section
  - [ ] Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
  - [ ] Save it as: `VITE_SUPABASE_URL`
- [ ] **Step 2.4**: Find **Project API keys** section
  - [ ] Find **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
  - [ ] Click the eye icon to reveal it
  - [ ] Copy the full key
  - [ ] Save it as: `VITE_SUPABASE_ANON_KEY`
- [ ] **Step 2.5**: Verify you have both values:
  - [ ] `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY` = `eyJ...` (long string)

## Phase 3: Create Database Tables

- [ ] **Step 3.1**: In your project dashboard, click **SQL Editor** (left sidebar)
- [ ] **Step 3.2**: Click **New Query** button (top right)
- [ ] **Step 3.3**: Copy the entire SQL script below:

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

-- Table for 'territories' namespace
CREATE TABLE IF NOT EXISTS kv_territories (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for 'notifications' namespace
CREATE TABLE IF NOT EXISTS kv_notifications (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for 'earnings' namespace
CREATE TABLE IF NOT EXISTS kv_earnings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for 'first-300' namespace (First 300 system)
CREATE TABLE IF NOT EXISTS kv_first_300 (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kv_users_updated ON kv_users(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_jobs_updated ON kv_jobs(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_default_updated ON kv_default(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_territories_updated ON kv_territories(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_notifications_updated ON kv_notifications(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_earnings_updated ON kv_earnings(updated_at);
CREATE INDEX IF NOT EXISTS idx_kv_first_300_updated ON kv_first_300(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_default ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_first_300 ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for your security needs)
CREATE POLICY "Allow all operations on kv_users" ON kv_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_jobs" ON kv_jobs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_default" ON kv_default
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_territories" ON kv_territories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_notifications" ON kv_notifications
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_earnings" ON kv_earnings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on kv_first_300" ON kv_first_300
  FOR ALL USING (true) WITH CHECK (true);
```

- [ ] **Step 3.4**: Paste the SQL into the query editor
- [ ] **Step 3.5**: Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
- [ ] **Step 3.6**: Verify success message: "Success. No rows returned"
- [ ] **Step 3.7**: Verify tables were created:
  - [ ] Click **Table Editor** (left sidebar)
  - [ ] You should see these tables:
    - [ ] `kv_users`
    - [ ] `kv_jobs`
    - [ ] `kv_default`
    - [ ] `kv_territories`
    - [ ] `kv_notifications`
    - [ ] `kv_earnings`
    - [ ] `kv_first_300`

## Phase 4: Configure Local Environment

- [ ] **Step 4.1**: Navigate to your project root directory
- [ ] **Step 4.2**: Check if `.env` file exists:
  - [ ] If it exists, open it
  - [ ] If it doesn't exist, create a new file named `.env`
- [ ] **Step 4.3**: Add these lines to `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_KV_PROXY=true
```

- [ ] **Step 4.4**: Replace the placeholder values:
  - [ ] Replace `https://your-project-id.supabase.co` with your actual Project URL
  - [ ] Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual anon key
- [ ] **Step 4.5**: Save the `.env` file
- [ ] **Step 4.6**: Verify `.env` is in `.gitignore` (to avoid committing secrets):
  - [ ] Check `.gitignore` file
  - [ ] If `.env` is not listed, add it

## Phase 5: Configure Vercel Deployment

- [ ] **Step 5.1**: Go to https://vercel.com/dashboard
- [ ] **Step 5.2**: Select your `fairtradeworker` project
- [ ] **Step 5.3**: Click **Settings** (top navigation)
- [ ] **Step 5.4**: Click **Environment Variables** (left sidebar)
- [ ] **Step 5.5**: Add first variable:
  - [ ] Click **Add New**
  - [ ] **Key**: `VITE_SUPABASE_URL`
  - [ ] **Value**: Your Project URL (from Step 2.3)
  - [ ] Select all environments: ☑ Production ☑ Preview ☑ Development
  - [ ] Click **Save**
- [ ] **Step 5.6**: Add second variable:
  - [ ] Click **Add New**
  - [ ] **Key**: `VITE_SUPABASE_ANON_KEY`
  - [ ] **Value**: Your anon key (from Step 2.4)
  - [ ] Select all environments: ☑ Production ☑ Preview ☑ Development
  - [ ] Click **Save**
- [ ] **Step 5.7**: Add third variable:
  - [ ] Click **Add New**
  - [ ] **Key**: `VITE_USE_KV_PROXY`
  - [ ] **Value**: `true`
  - [ ] Select all environments: ☑ Production ☑ Preview ☑ Development
  - [ ] Click **Save**
- [ ] **Step 5.8**: Verify all 3 variables are listed:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_USE_KV_PROXY`

## Phase 6: Test the Setup

- [ ] **Step 6.1**: Restart your local dev server:
  ```bash
  # Stop current server (Ctrl+C)
  npm run dev
  ```
- [ ] **Step 6.2**: Open browser console (F12)
- [ ] **Step 6.3**: Test KV operations in console:
  ```javascript
  // Test set
  await fetch('/api/spark/kv/test-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: { test: 'Hello Supabase!' } })
  });

  // Test get
  const response = await fetch('/api/spark/kv/test-key');
  const data = await response.json();
  console.log('Retrieved:', data);
  ```
- [ ] **Step 6.4**: Verify in Supabase:
  - [ ] Go to Supabase dashboard → **Table Editor**
  - [ ] Click `kv_default` table
  - [ ] You should see a row with `id = "test-key"` and `data = {"test": "Hello Supabase!"}`
- [ ] **Step 6.5**: Verify no errors in browser console
- [ ] **Step 6.6**: Check that your app still works normally

## Phase 7: Verify Integration

- [ ] **Step 7.1**: Check that `src/lib/store.ts` can use KV (it should work automatically)
- [ ] **Step 7.2**: Test a real operation:
  - [ ] Create a test user or job
  - [ ] Verify it appears in Supabase tables
- [ ] **Step 7.3**: Check Vercel deployment:
  - [ ] Push to main branch
  - [ ] Wait for Vercel deployment
  - [ ] Test on production URL
  - [ ] Verify KV operations work in production

## Troubleshooting Checklist

If something doesn't work:

- [ ] **Issue: "Table does not exist"**
  - [ ] Go back to Phase 3
  - [ ] Verify SQL script ran successfully
  - [ ] Check Table Editor to see if tables exist
  - [ ] Re-run SQL script if needed

- [ ] **Issue: "KV unavailable" or 500 errors**
  - [ ] Check `.env` file has correct values (Phase 4)
  - [ ] Verify you copied the **anon public** key (not service_role)
  - [ ] Restart dev server after changing `.env`
  - [ ] Check browser console for detailed error messages
  - [ ] Verify Supabase project is active (not paused)

- [ ] **Issue: "CORS error" or "405 Method Not Allowed"**
  - [ ] Check `vercel.json` has the rewrites (should already be done)
  - [ ] Verify API route exists at `api/spark/kv/[...key].ts`
  - [ ] Check Vercel deployment logs

- [ ] **Issue: Still using Spark KV instead of Supabase**
  - [ ] Verify `VITE_USE_KV_PROXY=true` in `.env`
  - [ ] Check browser console for proxy errors
  - [ ] The system falls back to Spark KV if Supabase fails (this is expected)

- [ ] **Issue: Data not persisting**
  - [ ] Check Supabase Table Editor to see if data is being written
  - [ ] Verify RLS policies allow operations (Phase 3)
  - [ ] Check browser console for errors

## Completion Checklist

- [ ] All Phase 1 steps completed (Account & Project)
- [ ] All Phase 2 steps completed (Credentials)
- [ ] All Phase 3 steps completed (Database Tables)
- [ ] All Phase 4 steps completed (Local Environment)
- [ ] All Phase 5 steps completed (Vercel Environment)
- [ ] All Phase 6 steps completed (Testing)
- [ ] All Phase 7 steps completed (Integration)
- [ ] App is working with Supabase KV
- [ ] Production deployment is working

## Next Steps After Setup

- [ ] Monitor Supabase dashboard for usage
- [ ] Set up database backups (Supabase handles this automatically)
- [ ] Consider adding more specific RLS policies for security
- [ ] Add more tables as needed (e.g., `kv_ratings`, `kv_messages`)

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Supabase Dashboard: https://supabase.com/dashboard
- Project SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
- Vercel Dashboard: https://vercel.com/dashboard

**Estimated Time**: 10-15 minutes

