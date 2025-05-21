# ========================
# Build Stage
# ========================
FROM node:20-alpine AS builder

# สร้าง directory ชื่อ /app
WORKDIR /app

# ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# คัดลอกไฟล์ที่ใช้ build ก่อน เพื่อใช้ Docker cache ให้ build เร็วขึ้น
COPY package.json yarn.lock tsconfig.json ./

# ติดตั้ง dependencies
RUN yarn install --frozen-lockfile

# คัดลอก source code ที่เหลือ
COPY src ./src

# Compile TypeScript → เป็น JavaScript
RUN yarn build

# ========================
# Production Stage
# ========================
FROM node:20-alpine AS runner

WORKDIR /app

# ✅ ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# ✅ คัดลอกไฟล์ที่จำเป็นสำหรับ install production deps
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./.yarnrc.yml

# ✅ ติดตั้ง dependencies แบบ production (Yarn 4 Style)
RUN yarn install --immutable

# ✅ คัดลอก build output
COPY --from=builder /app/dist ./dist

# เปิด port ที่ 3000
EXPOSE 3000

# สั่งคําสั่งเพื่อ run app
CMD ["node", "dist/index.js"]