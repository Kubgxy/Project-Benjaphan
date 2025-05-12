import express from "express";
import {
  selectItemsForCheckout,
  getCheckoutSummary,
  createOrder,
  getOrderById,
  uploadSlip,
  cancelOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
//   updatePaymentStatus,
} from "../controllers/order.controller";
import { verifyToken } from "../middlewares/verifyToken";

import { slipUpload } from "../middlewares/slipUpload.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const order = express.Router();

// POST /api/order/selectItems
order.post("/selectItems", verifyToken, selectItemsForCheckout);
// GET /api/order/checkoutSummary
order.get("/checkoutSummary", verifyToken, getCheckoutSummary);

// POST /api/order/createOrder
order.post("/createOrder", verifyToken, createOrder);
// GET /api/order/getOrderById/:id
order.get("/getOrderById/:id", verifyToken, getOrderById);
// GET /api/order/getOrdersByUser
order.get("/getOrdersByUser", verifyToken, getOrdersByUser);

// POST /api/order/uploadSlip/:orderId
order.post(
  "/uploadSlip/:orderId",
  verifyToken,
  slipUpload.single("slip"), // ✅ ชื่อ field ที่ Frontend ส่งมาต้องเป็น 'slip'
  uploadSlip
);

// PATCH /api/order/cancel/:orderId
order.patch("/cancelOrder/:orderId", verifyToken, cancelOrder);

// GET /api/order/getAllOrders
order.get("/getAllOrders", verifyToken, verifyAdmin, getAllOrders);

// PATCH /api/order/updateStatus/:orderId
order.patch("/updateStatus/:orderId", verifyToken, verifyAdmin, updateOrderStatus);

// PATCH /api/order/updatePaymentStatus/:orderId
// order.patch("/updatePaymentStatus/:orderId", verifyToken, verifyAdmin, updatePaymentStatus);

export default order;
