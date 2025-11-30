# ⚡ Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies

```bash
npm install
cd mobile && npm install && cd ..
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

**Minimum Required:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=generate-with-openssl-rand-base64-32
```

### 3. Run Database Migration

1. Open Supabase SQL Editor
2. Copy `supabase/migrations/20250101000001_complete_schema.sql`
3. Run it

### 4. Start Development

```bash
# Start web app
npm run dev

# In another terminal, start mobile
cd mobile
npm start
```

### 5. Test

- Web: http://localhost:5173
- Mobile: Scan QR code with Expo Go

---

**That's it!** 🚀

For full deployment, see `DEPLOYMENT_GUIDE.md`

