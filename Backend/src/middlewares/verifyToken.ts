import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
  role: string;
}

// 🟢 Middleware นี้ใช้ตรวจสอบ token ใน cookie
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: '❌ No token provided' });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded; // 🟢 เพิ่ม user เข้า req (userId + role)
    next();
  } catch (error) {
    res.status(401).json({ message: '❌ Invalid token' });
  }
};
