# =======================
# 📊 DASHBOARD - REACT + VITE
# =======================
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --immutable

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
