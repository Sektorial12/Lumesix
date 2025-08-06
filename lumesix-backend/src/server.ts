/**
 * Simple Lumesix Backend Server for Testing
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'lumesix-backend'
  });
});

// API status
app.get('/api/v1/status', (req, res) => {
  res.json({
    message: 'Lumesix API is running!',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Lumesix Backend running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

export default app;
