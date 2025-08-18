#!/bin/sh

echo "⏳ Waiting for database to be ready..."
until nc -z database 3306; do
  sleep 1
done

echo "✅ Database is up. Running Prisma migration..."
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

echo "🔧 Generating Prisma client..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

echo "🚀 Starting app..."
exec node apps/admin/server.js
