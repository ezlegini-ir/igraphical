#!/bin/sh

echo "⏳ Waiting for database to be ready..."
until nc -z database 3306; do
  sleep 1
done

# echo "🛡 Creating database backup before migration..."

# mysqldump --host=database --user=root --protocol=tcp igraphical > /app/backups/igraphical_backup_$(date +%F_%T).sql

# if [ $? -eq 0 ]; then
#   echo "✅ Backup created successfully."
# else
#   echo "❌ Failed to create backup. Exiting to prevent data loss."
#   exit 1
# fi

echo "✅ Database is up. Running Prisma migration..."
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

echo "🔧 Generating Prisma client..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

echo "🚀 Starting app..."
exec node apps/admin/server.js
