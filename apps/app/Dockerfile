# -----------------------------
# !Base: Alpine + Turbo
# -----------------------------
  FROM node:20.18-alpine AS base
  WORKDIR /repo
  RUN apk update && apk add --no-cache libc6-compat openssl
  RUN npm install -g turbo
  
  # -----------------------------
  # !Builder: Copy everything + prune for "app"
  # -----------------------------
  FROM base AS builder
  COPY . .
  RUN npm install --legacy-peer-deps
  RUN turbo prune app --docker
  
  # -----------------------------
  # !Installer: install only pruned deps
  # -----------------------------
  FROM base AS installer
  WORKDIR /repo
  COPY --from=builder /repo/out/json/ ./
  RUN npm install --legacy-peer-deps
  
  # -----------------------------
  # !Builder again: copy full source + generate + build app
  # -----------------------------
  COPY --from=builder /repo/out/full/ ./
  ENV DATABASE_URL="mysql://root@database:3306/igraphical"
  ENV AUTH_APP="app"
  ENV NEXT_PUBLIC_BASE_URL="https://igraphical.ir"
  # don't remove this line, it's used as a public key in the app. so it must be in the image and there is no problem to have it in the image, expose it to the public:
  ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le9kg0rAAAAAOta9iSjq0LS-96mcHHsNwOTphjG"
  RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
  RUN npm run build --workspace=app
  
  # -----------------------------
  # !Runner: clean runtime + run next server
  # -----------------------------
  FROM node:20.18-alpine AS runner
  WORKDIR /app
  RUN apk update && apk add --no-cache nano
  RUN apk add --no-cache mysql mysql-client

  ENV DATABASE_URL="mysql://root@database:3306/igraphical"
  ENV AUTH_APP="app"
  
  # Create user and set permissions
  RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
  
  COPY apps/app/entrypoint.sh /app/entrypoint.sh
  RUN chmod +x /app/entrypoint.sh
  
  RUN mkdir -p /app/backups && chown -R nextjs:nodejs /app/backups

  USER nextjs
  
  # ✅ Copy build output
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/.next/standalone ./
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/.next/static ./apps/app/.next/static
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/public ./apps/app/public
  
  # ✅ Copy Prisma runtime files
  COPY --from=installer --chown=nextjs:nodejs /repo/packages/database/generated/client/libquery_engine-linux-musl-openssl-3.0.x.so.node \
    /app/apps/app/.next/server/libquery_engine-linux-musl-openssl-3.0.x.so.node
  
  # ✅ Copy Prisma client & schema
  COPY --from=installer /repo/packages/database/prisma /app/packages/database/prisma
  COPY --from=installer /repo/node_modules/@prisma /app/node_modules/@prisma
  COPY --from=installer /repo/node_modules/.prisma /app/node_modules/.prisma
  COPY --from=installer /repo/node_modules/@prisma/client /app/node_modules/@prisma/client
  
  # ✅ Just in case: regenerate client (optional, but useful if schema changed externally)
  RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
 


  CMD ["/app/entrypoint.sh"]