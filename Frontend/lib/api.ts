export function getBaseUrl() {
  const isServer = typeof window === "undefined";

  return isServer
    ? "http://backend:3000"      // 👉 ฝั่ง SSR รันใน container → ใช้ชื่อ service
    : "http://localhost:3000";   // 👉 ฝั่ง browser รันในเครื่องเรา → ใช้ localhost
}