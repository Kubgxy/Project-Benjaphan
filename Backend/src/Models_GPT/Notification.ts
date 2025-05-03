import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true                           // ผู้ใช้เจ้าของ notification
  },
  type: {
    type: String,
    enum: ['order', 'promotion', 'system'],  // ประเภทแจ้งเตือน
    required: true
  },
  message: { type: String, required: true }, // เนื้อหาแจ้งเตือน
  link: { type: String },                    // URL หรือ path ที่เชื่อมไปหน้าอื่น (optional)
  isRead: { type: Boolean, default: false }, // อ่านแล้วหรือยัง
}, { collection: 'Notifications', timestamps: true });                    // createdAt, updatedAt

export default mongoose.model('Notification', notificationSchema);
