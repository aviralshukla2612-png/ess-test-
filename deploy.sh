#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Starting Live Deployment..."
echo "=========================================="

# 0. Check listening ports on the host
echo "🔍 Checking active listening ports on host server..."
if command -v ss >/dev/null 2>&1; then
    echo "Active listening TCP ports:"
    ss -tuln | grep LISTEN || true
elif command -v netstat >/dev/null 2>&1; then
    echo "Active listening TCP ports:"
    netstat -tuln | grep LISTEN || true
fi

# 1. Fetch & pull latest code from git
echo "📥 Fetching and pulling latest changes from Git repository..."
git pull origin main

# 2. Build and restart Docker containers in detached mode
echo "🐳 Rebuilding and starting Docker containers..."
docker compose down
docker compose up --build -d

# 3. Wait for PostgreSQL & Backend initialization
echo "⏳ Waiting for database and backend services to initialize..."
sleep 5

# 4. Apply Prisma database schema & seed initial data
echo "🗄️ Applying Prisma database schema push..."
docker compose exec -T backend npx prisma db push

echo "🌱 Seeding initial data..."
docker compose exec -T backend npm run prisma:seed || echo "⚠️ Seed script completed with warnings or data already exists."

# 5. Clean up dangling docker images to free server disk space
echo "🧹 Pruning unused Docker images..."
docker image prune -f

echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="
docker compose ps
