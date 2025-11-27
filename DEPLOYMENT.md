# FairTradeWorker - Deployment Guide

> **Death of the Middleman. Birth of the Trade Infrastructure.**

**Platform**: FairTradeWorker  
**Website**: [FairTradeWorker.com](https://FairTradeWorker.com)  
**Launch Date**: November 27, 2025

This comprehensive guide covers deploying FairTradeWorker to production using various hosting platforms optimized for React/Vite applications.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build Configuration](#build-configuration)
- [Deployment Options](#deployment-options)
  - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
  - [Option B: Netlify](#option-b-netlify)
  - [Option C: GitHub Pages](#option-c-github-pages)
- [Custom Domain Setup](#custom-domain-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

### Required Software
1. **Node.js 18+** - JavaScript runtime
2. **npm 8+** - Package manager
3. **Git** - Version control
4. **Build Tools** - Configured in package.json

### Pre-Deployment Checklist
- ✅ All dependencies installed: `npm install`
- ✅ Successful local build: `npm run build`
- ✅ All tests passing (if applicable)
- ✅ Environment variables configured
- ✅ API keys secured
- ✅ Console clean (no errors)
- ✅ TypeScript types validated

---

## Option A: Vercel (Recommended)

Vercel is the recommended platform for Vite applications due to its seamless integration and performance.

### Quick Deploy

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### When Prompted:

- **Set up and deploy?** Yes
- **Link to existing project?** No (first time) / Yes (subsequent deploys)
- **Project name:** fairtradeworker
- **In which directory is your code located?** ./
- **Override build command?** No (uses `npm run build` from package.json)
- **Override output directory?** Yes → `dist`
- **Override install command?** No

### Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites for client-side routing
- Security headers
- Asset caching

### Setting Up Custom Domain

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your domains:
   - `fairtradeworker.com`
   - `www.fairtradeworker.com`

### DNS Configuration (for Vercel)

Update your domain registrar's DNS settings:

| Type   | Name | Value               |
|--------|------|---------------------|
| A      | @    | 76.76.21.21        |
| CNAME  | www  | cname.vercel-dns.com |

---

## Option B: Netlify

Netlify provides easy deployment with excellent CDN and serverless functions support.

### Quick Deploy

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link to Netlify
netlify init

# Deploy to production
netlify deploy --prod
```

### Configuration

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects for client-side routing
- Security headers
- Asset caching

### Setting Up Custom Domain

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Domain settings**
4. Add custom domain: `fairtradeworker.com`
5. Follow DNS instructions provided

### DNS Configuration (for Netlify)

Follow the specific instructions in Netlify's dashboard, typically:

| Type   | Name | Value                          |
|--------|------|--------------------------------|
| A      | @    | 75.2.60.5 (or your assigned IP) |
| CNAME  | www  | [your-site].netlify.app        |

---

## Option C: GitHub Pages

GitHub Pages is a free hosting option that works well for static sites.

### Prerequisites

1. Your repository must be public (or you need GitHub Pro for private repos)
2. The `gh-pages` package is already included in devDependencies

### Deploy Using npm Script

```bash
# Build and deploy to GitHub Pages
npm run deploy:gh-pages
```

### Deploy Using GitHub Actions (Automatic)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to the `main` branch.

To enable:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to `main` branch to trigger deployment

### Setting Up Custom Domain (GitHub Pages)

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter: `www.fairtradeworker.com`
3. Check **Enforce HTTPS**

### DNS Configuration (for GitHub Pages)

Refer to the [official GitHub Pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) for the most current IP addresses.

As of the latest documentation:

| Type   | Name | Value                           |
|--------|------|--------------------------------|
| A      | @    | 185.199.108.153               |
| A      | @    | 185.199.109.153               |
| A      | @    | 185.199.110.153               |
| A      | @    | 185.199.111.153               |
| CNAME  | www  | FairTradeWorker.github.io     |

**Note:** The `CNAME` file is already included in the `public/` directory and will be deployed with the site. It contains:
```
www.fairtradeworker.com
```

---

## Custom Domain Setup

### Domain Provider Settings

After choosing your hosting platform, configure your domain registrar:

1. **Log in** to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. **Navigate** to DNS settings for fairtradeworker.com
3. **Add/Update** DNS records as specified by your hosting platform
4. **Wait** for DNS propagation (usually 24-48 hours, often faster)

### SSL/TLS Certificates

All three platforms provide automatic SSL certificates:

- **Vercel**: Automatic SSL via Let's Encrypt
- **Netlify**: Automatic SSL via Let's Encrypt
- **GitHub Pages**: Automatic SSL when using custom domain

---

## Post-Deployment Verification

After deployment, verify everything is working:

### 1. Website Loads

- [ ] https://www.fairtradeworker.com loads correctly
- [ ] https://fairtradeworker.com redirects to www (or vice versa)
- [ ] All pages load without errors

### 2. SSL Certificate

- [ ] Browser shows green lock icon
- [ ] No mixed content warnings
- [ ] Certificate is valid and not expired

### 3. Features Work

- [ ] Navigation works on all pages
- [ ] Video upload feature functions
- [ ] Job browser displays correctly
- [ ] Territory map loads
- [ ] User registration/login works
- [ ] API calls succeed (check browser console)

### 4. Performance

- [ ] Page load time is acceptable (<3 seconds)
- [ ] Images and assets load correctly
- [ ] No JavaScript errors in console

### Browser Console Check

Open browser Developer Tools (F12) and check:

```javascript
// Check for errors
console.error("Any errors here?")

// Network tab: All API calls should return 200/201
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Page Refresh

This is an SPA routing issue. The deployment configurations include redirects, but verify:

- **Vercel**: Check `vercel.json` rewrites
- **Netlify**: Check `netlify.toml` redirects
- **GitHub Pages**: Check `public/404.html` and `_redirects`

### API Calls Fail

- Check if environment variables are set correctly
- Verify CORS settings on your API server
- Check browser Network tab for specific errors

### DNS Not Propagating

- Use [DNS Checker](https://dnschecker.org/) to verify propagation
- Try clearing your browser cache
- Wait up to 48 hours for full propagation

---

## Environment Variables

For production deployments, you may need to set environment variables:

### Vercel
```bash
vercel env add VITE_API_URL
```

### Netlify
In Netlify dashboard: **Site settings** → **Build & deploy** → **Environment**

### GitHub Actions
In repository **Settings** → **Secrets and variables** → **Actions**

---

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/FairTradeWorker/fairtradeworker/issues)
2. Review platform-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com/)
   - [GitHub Pages Docs](https://docs.github.com/en/pages)
3. Contact support@fairtradeworker.com

---

**Website**: [FairTradeWorker.com](https://FairTradeWorker.com)  
**Launch Date**: November 27, 2025
