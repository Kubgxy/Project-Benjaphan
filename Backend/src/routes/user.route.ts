import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/verifyToken';

const user = Router();

// 🟢 Protected Route (เฉพาะคนที่ login แล้ว)
user.get('/me', verifyToken, (req, res) => {
  res.status(200).json({
    message: '👋 Hello, you are authenticated!',
    user: req.user // 🟢 แสดง user จาก token ที่ decode แล้ว
  });
});

user.post('/register', registerUser);
user.post('/login', loginUser);

export default user;
