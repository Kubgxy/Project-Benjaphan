 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// โหลดค่า .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI as string;

// Middleware
app.use(cors());
app.use(express.json()); // ให้รองรับ JSON Request
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
// Use routes
app.use('/api/user', user);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
