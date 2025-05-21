# ========================
# Build Stage,
# ========================
FROM node:20-alpine AS builder

# สร้าง working directory,
WORKDIR /app

# ติดตั้ง Yarn 4 ด้วย Corepack,
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# คัดลอกเฉพาะไฟล์ที่จำเป็นในการติดตั้ง dependency,
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./

# ติดตั้ง dependencies โดยใช้ yarn,
RUN yarn install --immutable

# คัดลอก source code ทั้งหมด,
COPY . .

# สร้าง production build
RUN yarn build

# ========================
# Production Stage
# ========================
FROM node:20-alpine AS runner

# ✅ ต้องเปิด Corepack และเตรียม Yarn อีกครั้งใน production container
RUN corepack enable && corepack prepare yarn@4.5.2 --activate

# ตั้งค่า NODE_ENV ให้เป็น production
ENV NODE_ENV=production

# สร้าง directory สำหรับ app จริง
WORKDIR /app

# ✅ คัดลอก Yarn ทั้งหมดที่ต้องใช้!
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.yarn /app/.yarn

# คัดลอกไฟล์ที่จำเป็นจาก build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# เปิด port ตามที่น้องใช้
EXPOSE 5173

# รัน production server
CMD ["yarn", "start"]