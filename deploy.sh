#!/bin/bash

# Firebase Deployment Script for Next.js App
# This script builds and deploys to Firebase App Hosting

echo "🚀 Starting Firebase Deployment..."
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Creating .env.production from .env.local..."
    cp .env.local .env.production
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js app
echo "🔨 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

# Deploy to Firebase App Hosting
echo "☁️  Deploying to Firebase App Hosting..."
firebase deploy --only apphosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "Your app is now live on Firebase Hosting!"
else
    echo "❌ Deployment failed! Check the errors above."
    exit 1
fi
