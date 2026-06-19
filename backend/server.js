import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './src/routes/auth.js';
import profileRoutes from './src/routes/profile.js';
import productRoutes from './src/routes/product.js';
import investmentRoutes from './src/routes/investment.js';
import transactionRoutes from './src/routes/transaction.js';
import vipRoutes from './src/routes/vip.js';
import notificationRoutes from './src/routes/notification.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import { supabase } from './src/services/supabase.js';
export { supabase };

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all React Native requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate Limiter (increased for development and testing)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // High limit for dev testing
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OilFund Premium Backend running on port ${PORT} (Listening on all interfaces)`);
});

export default app;
