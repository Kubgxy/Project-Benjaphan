import express from 'express';
import { addToCart, getCartUser, getAllCarts, updateCartItem } from '../controllers/cart.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const cart = express.Router();

// For User
cart.post('/addToCart', verifyToken, addToCart);
cart.get('/getCart', verifyToken, getCartUser);
cart.post('/updateCartItem', verifyToken, updateCartItem);
 
// For Admin
cart.get('/getAllCarts', verifyAdmin, getAllCarts);

export default cart;
