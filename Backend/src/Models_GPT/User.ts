import mongoose from 'mongoose';

// 📦 ที่อยู่ย่อย (เก็บหลายที่)
const addressSchema = new mongoose.Schema({
  label: { type: String },                      // เช่น "บ้าน", "ออฟฟิศ"
  addressLine: { type: String },               // ที่อยู่เต็มบรรทัด
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  country: { type: String, default: "Thailand" }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },

  email: { type: String, required: true, unique: true }, // Email (ใช้ login)
  password: { type: String },                           // Hash password

  phoneNumber: { type: String },                        // เบอร์โทร (optional)
  avatar: { type: String },                            // URL รูปโปรไฟล์

  addresses: [addressSchema],                          // Array ที่อยู่ (หลายรายการ)

  role: {                                              // สิทธิ์ผู้ใช้
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },

  provider: {                                          // ประเภท login: local / google / facebook
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  providerId: { type: String },                        // ID ที่ได้จาก provider (เช่น Google)

  points: { type: Number, default: 0 },               // ระบบสะสมแต้ม
  level: { type: String, default: 'standard' },       // Membership level เช่น standard, gold, platinum

  isVerified: { type: Boolean, default: false },      // อีเมลยืนยันแล้วหรือยัง

  cartId: {                                           // Ref ไปหา Cart schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  wishlistId: {                                       // Ref ไปหา Wishlist schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist'
  },

  orders: [{                                          // Ref ไปหา Order schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  notifications: [{                                   // Ref ไปหา Notification schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]

}, { timestamps: true });                             // createdAt, updatedAt

export default mongoose.model('User', userSchema);
