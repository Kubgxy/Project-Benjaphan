import { Request, Response } from 'express';
import Cart from '../Models_GPT/Cart';

// ✅ POST /api/order/selectItems
export const selectItemsForCheckout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: '❌ No items provided' });
      return 
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items } },  // อัปเดต array ทั้งชุดที่เลือก
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: '✅ Selected items saved for checkout',
      cart,
    });
  } catch (error) {
    console.error('❌ Error selecting items for checkout:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ GET /api/order/checkoutSummary
export const getCheckoutSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
    res.status(404).json({ message: '❌ No items found for checkout' });
      return 
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + ((item.priceAtAdded || 0) * item.quantity),
      0
    );
    
    const shipping = 50;  // หรือ logic คำนวณจริง
    const total = subtotal + shipping;
    
    res.status(200).json({
      success: true,
      message: '✅ Checkout summary retrieved',
      items: cart.items,
      subtotal,
      shipping,
      total,
    });
    
  } catch (error) {
    console.error('❌ Error fetching checkout summary:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
