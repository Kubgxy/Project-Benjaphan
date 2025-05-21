# ========================
# Build Stage
# ========================
FROM node:20-alpine AS builder

# สร้าง working directory
WORKDIR /app

# ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# คัดลอกเฉพาะไฟล์ที่จำเป็นในการติดตั้ง dependency
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml

# ติดตั้ง dependencies
RUN yarn install --frozen-lockfile

# คัดลอก source code
COPY . .

# สร้าง production build
RUN yarn build

# ========================
# Production Stage
# ========================
FROM node:20-alpine AS runner

# สร้าง directory สำหรับ app
WORKDIR /app

# คัดลอก build output และ serve มา
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# เพิ่ม path serve จาก node_modules
ENV PATH="/app/node_modules/.bin:$PATH"

# เปิดพอร์ต
EXPOSE 5174

# สั่งเสิร์ฟไฟล์ dist ด้วย serve
CMD ["serve", "-s", "dist", "-l", "5174"]