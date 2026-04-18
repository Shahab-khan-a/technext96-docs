# Firebase Deployment Script for Next.js App (Windows PowerShell)
# This script builds and deploys to Firebase App Hosting

Write-Host "🚀 Starting Firebase Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path .env.production)) {
    Write-Host "⚠️  .env.production not found. Creating from .env.local..." -ForegroundColor Yellow
    if (Test-Path .env.local) {
        Copy-Item .env.local .env.production
        Write-Host "✅ .env.production created" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Build the Next.js app
Write-Host "🔨 Building Next.js application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Check the errors above." -ForegroundColor Red
    exit 1
}

# Deploy to Firebase App Hosting
Write-Host "☁️  Deploying to Firebase App Hosting..." -ForegroundColor Cyan
firebase deploy --only apphosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "Your app is now live on Firebase App Hosting!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed! Check the errors above." -ForegroundColor Red
    exit 1
}
