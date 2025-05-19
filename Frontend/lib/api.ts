export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // 👉 ฝั่ง browser
    return ""; // ใช้ path สั้นเช่น /api/... ผ่าน NGINX ได้เลย
  } else {
    // 👉 ฝั่ง SSR หรือ Node
    return process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:3000";
  }
}
