/**
 * Lumesix Backend API Server
 * AI-Powered Subscription Analytics for Mobile Apps
 * RevenueCat Shipaton 2025 Hackathon
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import revenueCatRoutes from './routes/revenuecat';
import aiInsightsRoutes from './routes/aiInsights';
import docsRoutes from './routes/docs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumesix';

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Server will continue without database (using mock data)');
  }
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/revenuecat', revenueCatRoutes);
app.use('/api/ai-insights', aiInsightsRoutes);
app.use('/docs', docsRoutes);
app.use('/docs', docsRoutes); // Alternative path

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0',
    service: 'lumesix-backend'
  });
});

// API routes
app.get('/api/v1/status', (req, res) => {
  res.json({
    message: 'Lumesix API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      analytics: '/api/v1/analytics',
      insights: '/api/v1/insights',
      revenuecat: '/api/v1/revenuecat'
    }
  });
});

// Placeholder routes for future implementation
app.get('/api/v1/analytics', (req, res) => {
  res.json({ message: 'Analytics endpoint - Coming soon!' });
});

app.get('/api/v1/insights', (req, res) => {
  res.json({ message: 'AI Insights endpoint - Coming soon!' });
});

app.get('/api/v1/revenuecat', (req, res) => {
  res.json({ message: 'RevenueCat integration endpoint - Coming soon!' });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist.`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`✅ Lumesix Backend Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log('');
    console.log('📝 Available endpoints:');
    console.log('POST /api/auth/register - Register new user');
    console.log('POST /api/auth/login - User login');
    console.log('GET  /api/auth/profile - Get user profile');
    console.log('PUT  /api/auth/profile - Update profile');
    console.log('POST /api/auth/change-password - Change password');
    console.log('');
    console.log('📊 RevenueCat Routes:');
    console.log('  POST /api/revenuecat/connect - Connect RevenueCat account');
    console.log('  GET  /api/revenuecat/status - Check connection status');
    console.log('  GET  /api/revenuecat/dashboard - Get analytics dashboard');
    console.log('  GET  /api/revenuecat/customers - Get customer list');
    console.log('  GET  /api/revenuecat/products - Get product catalog');
    console.log('  DELETE /api/revenuecat/disconnect - Disconnect account');
    console.log();
    console.log('🤖 AI Insights Routes:');
    console.log('  GET  /api/ai-insights/churn-prediction - Predict customer churn');
    console.log('  GET  /api/ai-insights/revenue-optimization - Analyze revenue opportunities');
    console.log('  GET  /api/ai-insights/customer-ltv - Calculate Customer Lifetime Value');
    console.log('  GET  /api/ai-insights/business-insights - Generate AI business insights');
    console.log('  GET  /api/ai-insights/dashboard - Complete AI insights dashboard');
    console.log();
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📄 SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

startServer().catch(console.error);

export default app;
