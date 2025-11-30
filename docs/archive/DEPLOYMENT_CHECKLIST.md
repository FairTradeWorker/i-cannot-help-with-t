# ✅ Deployment Checklist

## Quick Reference Checklist

### Pre-Deployment

- [ ] Supabase project created
- [ ] Database migration run
- [ ] Stripe account created
- [ ] Upstash Redis created
- [ ] Expo project created
- [ ] JWT secret generated

### Backend Deployment

- [ ] Vercel project created
- [ ] Environment variables added:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] JWT_SECRET
  - [ ] UPSTASH_REDIS_REST_URL
  - [ ] UPSTASH_REDIS_REST_TOKEN
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_PUBLISHABLE_KEY
- [ ] Backend deployed to Vercel
- [ ] Health check passes

### Mobile App Configuration

- [ ] mobile/.env file created
- [ ] EXPO_PUBLIC_API_BASE set
- [ ] EXPO_PUBLIC_SUPABASE_URL set
- [ ] EXPO_PUBLIC_SUPABASE_ANON_KEY set
- [ ] EXPO_PUBLIC_PROJECT_ID set

### Testing

- [ ] Health endpoint works
- [ ] Signup works
- [ ] Login works
- [ ] Job creation works
- [ ] Messaging works
- [ ] Notifications work

### Security

- [ ] All secrets are secure
- [ ] RLS policies enabled
- [ ] Rate limiting active
- [ ] CORS configured

---

**Status**: Ready when all checked! ✅

