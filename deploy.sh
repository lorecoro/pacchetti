#!/bin/bash
set -e

cd /srv/nodeapp

echo "Stopping app..."
./pm2 stop Pacchetti

echo "Updating code..."
cd /srv/nodeapp/pacchetti
git pull origin main

echo "Installing dependencies..."
npm ci

echo "Generating Prisma client..."
npx prisma generate

echo "Keeping previous build for rollback..."
rm -rf .next.previous
mv .next .next.previous

echo "Building app..."
npm run build

echo "Reloading PM2..."
cd /srv/nodeapp
./pm2 reload ecosystem.config.yml

echo "Deployment completed successfully."
