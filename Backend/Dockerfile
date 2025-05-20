# ========================
# 1. Build Stage
# ========================
FROM node:20-alpine AS builder

# สร้าง working directory
WORKDIR /app

# ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# คัดลอกเฉพาะไฟล์ที่จำเป็นในการติดตั้ง dependency
COPY package.json yarn.lock ./

# ติดตั้ง dependencies โดยใช้ yarn
# RUN yarn install --frozen-lockfile
RUN echo "✅ INSTALL START" && date && yarn install --frozen-lockfile && echo "✅ INSTALL DONE" && date

# คัดลอก source code ทั้งหมด
# COPY . .
COPY src ./src

# สร้าง production build
# RUN yarn build
RUN echo "✅ BUILD START" && date && yarn build && echo "✅ BUILD DONE" && date

# ========================
# 2. Production Stage
# ========================
FROM node:20-alpine AS runner
WORKDIR /app

# ✅ ติดตั้ง Yarn 4 ด้วย Corepack
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# ✅ คัดลอกไฟล์ที่จำเป็นสำหรับ install production deps
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./.yarnrc.yml

# ✅ ติดตั้ง dependencies แบบ production (Yarn 4 Style)
RUN yarn install --immutable

# ✅ คัดลอก build output
COPY --from=builder /app/dist ./dist

# เปิด port ที่ 3000
EXPOSE 3000

# สั่งคําสั่งเพื่อ run app
CMD ["node", "dist/index.js"]