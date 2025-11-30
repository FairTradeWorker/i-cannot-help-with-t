# Troubleshooting Guide

This guide covers common issues you may encounter when setting up, developing, or deploying FairTradeWorker.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Environment Configuration](#environment-configuration)
- [Build Errors](#build-errors)
- [Runtime Issues](#runtime-issues)
- [Mobile-Specific Issues](#mobile-specific-issues)
- [Database Issues](#database-issues)
- [Payment Integration](#payment-integration)
- [Common Error Messages](#common-error-messages)

---

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install.

**Solutions**:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**
   ```bash
   node --version  # Should be 18.x or higher
   ```
   
   If outdated, update Node.js:
   ```bash
   # Using nvm
   nvm install 18
   nvm use 18
   ```

3. **Use legacy peer deps** (if peer dependency conflicts)
   ```bash
   npm install --legacy-peer-deps
   ```

### Permission errors on npm install

**Problem**: `EACCES: permission denied`

**Solutions**:

1. **Fix npm permissions**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Use nvm** (recommended)
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   ```

### Mobile dependencies fail

**Problem**: `cd mobile && npm install` fails.

**Solutions**:

1. **Install Expo CLI globally**
   ```bash
   npm install -g expo-cli
   ```

2. **Clear mobile node_modules**
   ```bash
   cd mobile
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Environment Configuration

### Missing environment variables

**Problem**: App fails with "Missing required environment variable"

**Solution**:

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Fill in required values:
   ```bash
   # Minimum required
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-secret-key
   ```

### Environment variables not loading

**Problem**: Variables are set but app doesn't see them.

**Solutions**:

1. **Restart dev server** after `.env` changes
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

2. **Check variable prefix** - Vite requires `VITE_` prefix for client-side variables
   ```bash
   # Correct
   VITE_SUPABASE_URL=...
   
   # Wrong (won't work in browser)
   SUPABASE_URL=...
   ```

3. **Verify file location** - `.env` must be in project root

### JWT_SECRET issues

**Problem**: Authentication fails with JWT errors.

**Solution**: Generate a secure secret:
```bash
openssl rand -base64 32
```

---

## Build Errors

### TypeScript errors

**Problem**: `tsc --noEmit` fails with type errors.

**Solutions**:

1. **Check for missing types**
   ```bash
   npm install --save-dev @types/node @types/react
   ```

2. **Fix common type issues**:
   ```typescript
   // Error: Type 'X' is not assignable to type 'Y'
   // Solution: Add explicit type annotation
   const data: ExpectedType = response.data;
   ```

3. **Run type check**
   ```bash
   npm run typecheck
   ```

### Vite build fails

**Problem**: `npm run build` fails.

**Solutions**:

1. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

2. **Check for circular dependencies**
   ```bash
   npm install madge --save-dev
   npx madge --circular src/
   ```

3. **Increase memory limit** (for large builds)
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### ESLint errors blocking build

**Problem**: Lint errors prevent build.

**Solution**:
```bash
# Fix auto-fixable issues
npm run lint:fix

# Or temporarily ignore (not recommended for production)
ESLINT_NO_DEV_ERRORS=true npm run build
```

---

## Runtime Issues

### API connection failures

**Problem**: API calls return network errors.

**Solutions**:

1. **Check API URL**
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL);
   ```

2. **Verify CORS settings** on your backend

3. **Check browser network tab** for specific error details

### Authentication issues

**Problem**: Login fails or user session lost.

**Solutions**:

1. **Clear localStorage**
   ```javascript
   localStorage.clear();
   ```

2. **Check JWT expiration** - tokens may have expired

3. **Verify Supabase auth settings** in dashboard

### Pages return 404 on refresh

**Problem**: Direct URL access returns 404 (SPA routing issue).

**Solutions**:

1. **Vercel**: Check `vercel.json` has rewrites:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

2. **Netlify**: Check `netlify.toml`:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

### Slow initial load

**Problem**: App takes too long to load.

**Solutions**:

1. **Enable code splitting**
   ```typescript
   const Component = lazy(() => import('./Component'));
   ```

2. **Check bundle size**
   ```bash
   npm run build
   # Check dist folder size
   ```

3. **Optimize images** - use WebP format, proper sizing

---

## Mobile-Specific Issues

### Expo start fails

**Problem**: `npm start` in mobile directory fails.

**Solutions**:

1. **Clear Expo cache**
   ```bash
   expo start --clear
   ```

2. **Update Expo CLI**
   ```bash
   npm install -g expo-cli@latest
   ```

3. **Check Expo SDK version** compatibility in `app.json`

### iOS Simulator won't start

**Problem**: `npm run ios` fails on macOS.

**Solutions**:

1. **Install Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

2. **Accept Xcode license**
   ```bash
   sudo xcodebuild -license accept
   ```

3. **Reset simulator**
   - Open Simulator app
   - Device > Erase All Content and Settings

### Android Emulator issues

**Problem**: `npm run android` fails.

**Solutions**:

1. **Check Android Studio setup**
   - Ensure Android SDK is installed
   - Create AVD (Android Virtual Device)

2. **Set ANDROID_HOME**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Start emulator manually**
   ```bash
   emulator -list-avds
   emulator -avd YOUR_AVD_NAME
   ```

### Metro bundler crashes

**Problem**: Metro crashes during development.

**Solutions**:

1. **Clear Metro cache**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Kill existing Metro processes**
   ```bash
   pkill -f metro
   ```

---

## Database Issues

### Supabase connection fails

**Problem**: Cannot connect to Supabase.

**Solutions**:

1. **Verify credentials** in Supabase dashboard

2. **Check URL format**
   ```bash
   # Correct
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   
   # Wrong (no trailing slash!)
   VITE_SUPABASE_URL=https://xxxx.supabase.co/
   ```

3. **Check RLS policies** - Row Level Security may block access

### Migration errors

**Problem**: Database migration fails.

**Solutions**:

1. **Run migrations in order**
   ```sql
   -- Check migration status in Supabase dashboard
   SELECT * FROM supabase_migrations.schema_migrations;
   ```

2. **Reset database** (development only!)
   ```bash
   # In Supabase dashboard: Project Settings > Database > Reset
   ```

### Data not persisting

**Problem**: Changes don't save to database.

**Solutions**:

1. **Check RLS policies** in Supabase

2. **Verify auth token** is being sent with requests

3. **Check browser network tab** for response errors

---

## Payment Integration

### Stripe connection issues

**Problem**: Payment processing fails.

**Solutions**:

1. **Verify API keys**
   ```bash
   # Use test keys for development
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. **Check webhook signature** for webhook events

3. **Use Stripe CLI** for local testing
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

### Payment intent fails

**Problem**: `create-intent` returns error.

**Solutions**:

1. **Check amount format** (cents, not dollars)
   ```javascript
   // Correct: 1000 cents = $10
   amount: 1000
   
   // Wrong: This would be $1000!
   amount: 1000.00
   ```

2. **Verify currency** is supported

---

## Common Error Messages

### "Module not found"

**Problem**: Import statement can't find module.

**Solutions**:
```bash
# Check if package is installed
npm list package-name

# Install if missing
npm install package-name
```

### "CORS error"

**Problem**: Cross-origin request blocked.

**Solutions**:
1. Check API CORS configuration
2. Verify request URL matches allowed origins
3. For development, use proxy in `vite.config.ts`

### "Rate limit exceeded"

**Problem**: Too many API requests.

**Solutions**:
1. Wait for rate limit window to reset
2. Check `X-RateLimit-Reset` header for reset time
3. Implement request debouncing/throttling

### "JWT expired"

**Problem**: Authentication token expired.

**Solutions**:
1. Implement token refresh logic
2. Redirect to login on 401 errors
3. Increase token expiration time (development only)

### "Network request failed"

**Problem**: API call fails without specific error.

**Solutions**:
1. Check internet connection
2. Verify API server is running
3. Check for firewall/proxy issues
4. Review browser console for details

---

## Getting More Help

If your issue isn't covered here:

1. **Search GitHub Issues**: [github.com/FairTradeWorker/fairtradeworker/issues](https://github.com/FairTradeWorker/fairtradeworker/issues)
2. **Start a Discussion**: [github.com/FairTradeWorker/fairtradeworker/discussions](https://github.com/FairTradeWorker/fairtradeworker/discussions)
3. **Contact Support**: support@fairtradeworker.com

When reporting issues, include:
- Error message (full text)
- Steps to reproduce
- Environment (OS, Node version, browser)
- Relevant configuration files

---

*Last updated: November 2025*
