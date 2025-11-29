#!/bin/bash

# Supabase KV Setup Script
# This script helps you set up Supabase for the KV proxy system

set -e

echo "🚀 Supabase KV Setup"
echo "===================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo "  OR"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Or set up manually at: https://supabase.com/dashboard"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "📝 Please log in to Supabase:"
    supabase login
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a new Supabase project (if you don't have one):"
echo "   Visit: https://supabase.com/dashboard/new"
echo ""
echo "2. Get your project credentials:"
echo "   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
echo "   - Copy 'Project URL' → VITE_SUPABASE_URL"
echo "   - Copy 'anon public' key → VITE_SUPABASE_ANON_KEY"
echo ""
echo "3. Run the SQL script to create tables:"
echo "   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new"
echo "   - Copy and paste the SQL from SUPABASE_KV_SETUP.md"
echo ""
echo "4. Add environment variables to .env:"
echo "   VITE_SUPABASE_URL=your_project_url"
echo "   VITE_SUPABASE_ANON_KEY=your_anon_key"
echo "   VITE_USE_KV_PROXY=true"
echo ""
echo "5. For Vercel deployment, add the same variables in:"
echo "   Vercel Dashboard → Project Settings → Environment Variables"
echo ""

read -p "Do you want to open the Supabase dashboard? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://supabase.com/dashboard" 2>/dev/null || \
    xdg-open "https://supabase.com/dashboard" 2>/dev/null || \
    echo "Please visit: https://supabase.com/dashboard"
fi

echo ""
echo "✨ Setup complete! Follow the steps above to finish configuration."

