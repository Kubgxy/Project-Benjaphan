import express from 'express';
import { createOrder, getOrderById, getOrdersByUser } from '../controllers/order.controller';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.post('/createOrder', verifyToken, createOrder); // POST /orders
router.get('/getOrderById/:orderId', verifyToken, getOrderById); // GET /orders/:orderId
router.get('/getOrdersByUser', verifyToken, getOrdersByUser); // GET /orders/user

export default router;
