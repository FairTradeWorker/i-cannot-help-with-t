# Supabase KV Setup Script (PowerShell)
# This script helps you set up Supabase for the KV proxy system

Write-Host "🚀 Supabase KV Setup" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "Install it with:" -ForegroundColor Yellow
    Write-Host "  npm install -g supabase" -ForegroundColor White
    Write-Host "  OR" -ForegroundColor White
    Write-Host "  Visit: https://supabase.com/dashboard" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a new Supabase project (if you don't have one):" -ForegroundColor White
Write-Host "   Visit: https://supabase.com/dashboard/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Get your project credentials:" -ForegroundColor White
Write-Host "   - Go to: Project Settings → API" -ForegroundColor Gray
Write-Host "   - Copy 'Project URL' → VITE_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - Copy 'anon public' key → VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Run the SQL script to create tables:" -ForegroundColor White
Write-Host "   - Go to: SQL Editor → New Query" -ForegroundColor Gray
Write-Host "   - Copy and paste the SQL from SUPABASE_KV_SETUP.md" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Add environment variables to .env:" -ForegroundColor White
Write-Host "   VITE_SUPABASE_URL=your_project_url" -ForegroundColor Gray
Write-Host "   VITE_SUPABASE_ANON_KEY=your_anon_key" -ForegroundColor Gray
Write-Host "   VITE_USE_KV_PROXY=true" -ForegroundColor Gray
Write-Host ""
Write-Host "5. For Vercel deployment, add the same variables in:" -ForegroundColor White
Write-Host "   Vercel Dashboard → Project Settings → Environment Variables" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Do you want to open the Supabase dashboard? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Start-Process "https://supabase.com/dashboard"
}

Write-Host ""
Write-Host "✨ Setup complete! Follow the steps above to finish configuration." -ForegroundColor Green

