import express from 'express';
import { selectItemsForCheckout, getCheckoutSummary } from '../controllers/order.controller';
import { verifyToken } from '../middlewares/verifyToken';

const order = express.Router();

// POST /api/order/selectItems
order.post('/selectItems', verifyToken, selectItemsForCheckout);
// GET /api/order/checkoutSummary
order.get('/checkoutSummary', verifyToken, getCheckoutSummary);

export default order;
