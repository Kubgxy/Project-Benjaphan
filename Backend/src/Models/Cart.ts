import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;                       // ✅ แก้เป็น string
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[];
}

export interface ICart extends Document {
  userID: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema<ICart>(
  {
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },         
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        images: [{ type: String, required: true }],
      },
    ],
  },
  { timestamps: true, collection: 'CartUser' }
);

export default mongoose.model<ICart>('CartUser', CartSchema);
