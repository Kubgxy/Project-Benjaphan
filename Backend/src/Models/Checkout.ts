import mongoose, { Schema, Document } from 'mongoose'

export interface ISelectedCheckout extends Document {
  userId: mongoose.Types.ObjectId
  items: {
    productId: string
    size: string
    quantity: number
  }[]
  updatedAt: Date
}

const selectedCheckoutSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        size: { type: String },
        quantity: { type: Number },
      },
    ],
  },
  { collection: 'Checkout', timestamps: true }
)

export default mongoose.model<ISelectedCheckout>('SelectedCheckout', selectedCheckoutSchema)
