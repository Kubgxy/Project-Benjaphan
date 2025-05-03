// import { Request, Response } from 'express';
// // import Order from '../Models/Order';
// // import Product from '../Models/Product';

// import Order from '../Models_GPT/Order'; // Model
// import Product from '../Models_GPT/Product'; // Model

// import { v4 as uuidv4 } from 'uuid';

// export const createOrder = async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   const {
//     items, // [{ productId, quantity, size }]
//     shippingInfo,
//     paymentMethod,
//   } = req.body;

//   if (!userId || !items || !shippingInfo ) {
//     res.status(400).json({ message: 'Missing required fields' });
//     return;
//   }

//   try {
//     let subtotal = 0;
//     const orderItems = [];

//     // validate and prepare items
//     for (const item of items) {
//       const product = await Product.findOne({ id_product: item.productId });
//       if (!product) {
//         res.status(404).json({ message: `Product not found: ${item.productId}` });
//         return;
//       }

//       const totalItemPrice = product.price * item.quantity;
//       subtotal += totalItemPrice;

//       orderItems.push({
//         productId: item.productId,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         size: item.size,
//         images: product.images,
//       });
//     }

//     const shippingFee = 50;
//     const total = subtotal + shippingFee ;

//     const orderId = `ORD-${uuidv4()}`;

//     const newOrder = await Order.create({
//       orderId,
//       userId,
//       items: orderItems,
//       subtotal,
//       shippingFee,
//       total,
//       shippingInfo,
//       paymentMethod,
//       paymentStatus: 'pending',
//       orderStatus: 'pending',
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       orderId: newOrder.orderId,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const getOrderById = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.userId;
//     if (!userId) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return 
//     }

//     if (!/^ORD-[\w-]+$/.test(req.params.orderId)) {
//       res.status(400).json({ message: 'Invalid orderId format' });
//       return 
//     }

//     const order = await Order.findOne({ orderId: req.params.orderId, userId }).lean();
//     if (!order) {
//       res.status(404).json({ message: 'Order not found' });
//       return 
//     }

//     const { _id, __v, ...safeOrder } = order;
//     res.json(safeOrder);
//   } catch (error) {
//     console.error('❌ getOrderById error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getOrdersByUser = async (req: Request, res: Response) => {
//   const userId = req.user?.userId;

//   if (!userId) {
//     res.status(401).json({ message: 'Unauthorized' });
//     return 
//   }

//   try {
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })
//       .select(
//         'orderId total orderStatus paymentStatus createdAt items subtotal shippingFee'
//       );

//     if (!orders || orders.length === 0) {
//       res.status(200).json({ success: true, orders: [] });
//       return 
//     }

//     // Optional: map เพื่อ clean response (เช่นลบ __v, _id)  
//     const cleanedOrders = orders.map((order) => ({
//       orderId: order.orderId,
//       total: order.total,
//       subtotal: order.subtotal,
//       shippingFee: order.shippingFee,
//       orderStatus: order.orderStatus,
//       paymentStatus: order.paymentStatus,
//       createdAt: order.createdAt,
//       items: order.items.map((item: any) => ({
//         productId: item.productId, // string code
//         name: item.name,
//         images: item.images,
//         price: item.price,
//         quantity: item.quantity,
//         size: item.size,
//       })),
//     }));

//     res.status(200).json({ success: true, orders: cleanedOrders });
//     return 
//   } catch (error) {
//     console.error('❌ getOrdersByUser error:', error);
//     res.status(500).json({ message: 'Server error', error });
//     return 
//   }
// };

  