import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'                               // แอดมินที่ตอบ (optional)
  },
  message: { type: String, required: true },  // เนื้อหาตอบกลับ
  repliedAt: { type: Date, default: Date.now }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true                            // ผู้รีวิว
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true                            // สินค้าที่รีวิว
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true                            // คะแนน 1–5
  },
  comment: { type: String },                 // ข้อความรีวิว
  images: [{ type: String }],                // URL รูปแนบรีวิว

  reply: replySchema                         // แอดมินตอบกลับ (optional)
}, { timestamps: true });                    // createdAt, updatedAt

export default mongoose.model('Review', reviewSchema);
