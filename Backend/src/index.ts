 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
// โหลดค่า .env
dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174' ],
  credentials: true              
}));
app.use(express.json()); 
app.use(cookieParser());

// Connect MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Test route
app.get('/', (_req, res) => {
  res.send('🎉 Hello from E-commerce Backend with Yarn + MongoDB!');
});

// Import routes
import user from './routes/user.route';
import product from './routes/product.route';
import cart from './routes/cart.route';
// Use routes
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/cart', cart);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
