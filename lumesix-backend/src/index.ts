/**
 * Lumesix Backend API Server
 * AI-Powered Subscription Analytics for Mobile Apps
 * RevenueCat Shipaton 2025 Hackathon
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
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
app.listen(PORT, () => {
  console.log(`🚀 Lumesix Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Status: http://localhost:${PORT}/api/v1/status`);
  console.log(`📱 Ready for RevenueCat Shipaton 2025!`);
});

export default app;
