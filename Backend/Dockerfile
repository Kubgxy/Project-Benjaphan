# =======================
# 🧠 BACKEND - EXPRESS + TS
# =======================
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
