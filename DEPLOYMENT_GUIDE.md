# 🚀 Deployment Guide - FairTradeWorker

## ✅ **Step-by-Step Deployment Instructions**

---

## 📋 **Prerequisites**

- [ ] Vercel account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Stripe account (test mode works)
- [ ] Upstash Redis account (free tier works)
- [ ] Expo account (for mobile app)

---

## 🔧 **Step 1: Supabase Setup** (15 minutes)

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `fairtradeworker`
   - Database Password: (create strong password)
   - Region: (choose closest)
4. Wait ~2 minutes for setup

### 1.2 Get Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

### 1.3 Run Database Migration

1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy contents of `supabase/migrations/20250101000001_complete_schema.sql`
4. Paste and click **Run** (or Cmd/Ctrl + Enter)
5. Wait for success message

### 1.4 Verify Tables Created

1. Go to **Database** → **Tables**
2. Verify these tables exist:
   - ✅ users
   - ✅ jobs
   - ✅ bids
   - ✅ messages
   - ✅ territories
   - ✅ notifications
   - ✅ payments
   - ✅ subscriptions

---

## 🔐 **Step 2: JWT Secret Setup** (2 minutes)

Generate a secure JWT secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use online generator
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

**Save this key** - you'll need it for environment variables.

---

## 💳 **Step 3: Stripe Setup** (10 minutes)

### 3.1 Create Stripe Account

1. Go to https://stripe.com
2. Sign up (use test mode for now)
3. Go to **Developers** → **API keys**

### 3.2 Get API Keys

Copy:
- **Publishable key**: `pk_test_...`
- **Secret key**: `sk_test_...` (keep secret!)

### 3.3 Set Up Webhook (Optional for now)

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy **Signing secret**: `whsec_...`

---

## 🔄 **Step 4: Upstash Redis Setup** (5 minutes)

### 4.1 Create Redis Database

1. Go to https://console.upstash.com
2. Click **Create Database**
3. Fill in:
   - Name: `fairtradeworker-rate-limit`
   - Type: **Regional**
   - Region: (choose closest)
4. Click **Create**

### 4.2 Get Credentials

1. Click on your database
2. Go to **Details** tab
3. Copy:
   - **UPSTASH_REDIS_REST_URL**: `https://...upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `...`

---

## 📱 **Step 5: Expo Setup** (10 minutes)

### 5.1 Install Expo CLI

```bash
npm install -g expo-cli
```

### 5.2 Create Expo Project

```bash
cd mobile
npx expo login
npx expo init --template blank-typescript
```

### 5.3 Get Project ID

1. Go to https://expo.dev
2. Create new project or use existing
3. Copy **Project ID**

---

## 🌐 **Step 6: Deploy Backend to Vercel** (15 minutes)

### 6.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 6.2 Deploy

```bash
# From project root
vercel login
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name: `fairtradeworker`
- Directory: `.`
- Override settings? **No**

### 6.3 Get Deployment URL

After deployment, Vercel will give you a URL like:
```
https://fairtradeworker.vercel.app
```

**Save this URL** - you'll need it for environment variables.

---

## 🔑 **Step 7: Configure Environment Variables** (10 minutes)

### 7.1 Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

#### Required Variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_KV_PROXY=true

JWT_SECRET=your-jwt-secret-from-step-2
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-from-step-2

UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
VITE_UPSTASH_REDIS_REST_URL=https://...upstash.io
VITE_UPSTASH_REDIS_REST_TOKEN=...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

VITE_SENTRY_DSN=https://... (optional)
```

5. Select **all environments** (Production, Preview, Development)
6. Click **Save**

### 7.2 Redeploy

After adding variables, redeploy:

```bash
vercel --prod
```

Or trigger redeploy from Vercel dashboard.

---

## 📱 **Step 8: Configure Mobile App** (5 minutes)

### 8.1 Create Mobile Environment File

Create `mobile/.env`:

```bash
EXPO_PUBLIC_API_BASE=https://your-domain.vercel.app/api
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 8.2 Update API Base URL

The mobile app will automatically use `EXPO_PUBLIC_API_BASE` if set.

---

## ✅ **Step 9: Test Everything** (30 minutes)

### 9.1 Test Backend APIs

1. Health check:
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. Test signup:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test1234","name":"Test User"}'
   ```

### 9.2 Test Mobile App

1. Start Expo:
   ```bash
   cd mobile
   npm start
   ```

2. Scan QR code with Expo Go app
3. Test login/signup
4. Test job creation
5. Test messaging

---

## 🎯 **Step 10: Production Checklist** (15 minutes)

### Backend ✅
- [ ] All environment variables set
- [ ] Database migration run successfully
- [ ] Health check endpoint works
- [ ] API endpoints respond correctly
- [ ] Rate limiting works
- [ ] Authentication works

### Mobile App ✅
- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Authentication flow works
- [ ] Jobs load correctly
- [ ] Messages send/receive
- [ ] Push notifications work

### Security ✅
- [ ] JWT secret is strong and unique
- [ ] Service role key is secure
- [ ] API keys are not exposed
- [ ] RLS policies are enabled
- [ ] Rate limiting is active

---

## 🐛 **Troubleshooting**

### Backend Issues

**"Database connection failed"**
- Check Supabase URL and keys
- Verify database is running
- Check RLS policies

**"Rate limit error"**
- Check Redis credentials
- Verify Upstash Redis is active
- Check rate limit configuration

**"Authentication failed"**
- Verify JWT_SECRET is set
- Check token expiration
- Verify user exists in database

### Mobile App Issues

**"API calls failing"**
- Check EXPO_PUBLIC_API_BASE is set
- Verify backend is deployed
- Check network connectivity

**"Authentication not working"**
- Verify API base URL
- Check token storage
- Verify backend auth endpoints

---

## 📚 **Additional Resources**

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs
- Expo Docs: https://docs.expo.dev
- Upstash Docs: https://docs.upstash.com

---

## ✅ **You're Done!**

Once all steps are complete, your app is live and ready for users!

**Backend**: `https://your-domain.vercel.app`  
**Mobile**: Available via Expo  
**Database**: Supabase  
**Status**: ✅ **LIVE**  

---

*Happy deploying!* 🚀

