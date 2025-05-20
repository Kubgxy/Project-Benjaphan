# ========================
# 1. Build Stage Grok3
# ========================
FROM node:20-alpine AS builder

# สร้าง working directory
WORKDIR /app

# ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# สร้าง .yarnrc.yml เพื่อเปิดใช้งาน cache
RUN echo "nodeLinker: node-modules\nnpmRegistryServer: https://registry.yarnpkg.com\ncacheFolder: .yarn/cache" > .yarnrc.yml

# คัดลอกเฉพาะไฟล์ที่จำเป็นในการติดตั้ง dependency
COPY package.json yarn.lock ./

# สร้างโฟลเดอร์สำหรับ cache
RUN mkdir -p /app/.yarn/cache

# ติดตั้ง dependencies โดยใช้ yarn
RUN echo "✅ INSTALL START" && date && yarn install --immutable --immutable-cache && echo "✅ INSTALL DONE" && date

# คัดลอก source code ทั้งหมด
COPY . .

# สร้าง production build
RUN echo "✅ BUILD START" && date && yarn build && echo "✅ BUILD DONE" && date

# ========================
# 2. Production Stage
# ========================
FROM node:20-alpine AS runner

# ตั้งค่า NODE_ENV ให้เป็น production
ENV NODE_ENV=production

# สร้าง directory สำหรับ app จริง
WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นจาก build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# เปิด port
EXPOSE 5173

# รัน production server
CMD ["yarn", "start"]