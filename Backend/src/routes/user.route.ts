import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller';
import { updateMe, getUserProfile } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { upload } from '../middlewares/upload.middleware';


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
user.post('/logout', logoutUser);
user.get('/getuser', verifyToken, getUserProfile);
user.patch('/edituser',verifyToken, upload.single('avatar'),  updateMe);

export default user;
