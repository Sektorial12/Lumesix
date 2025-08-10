/**
 * RevenueCat Integration Routes
 * Handles customer RevenueCat API key management and data fetching
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { authenticate, AuthRequest } from '../middleware/auth';
import authService from '../services/authService';
import RevenueCatService from '../services/revenueCatService';

const router = Router();

// Rate limiting for RevenueCat API calls (more restrictive due to external API)
const revenueCatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 RevenueCat requests per windowMs
  message: {
    success: false,
    message: 'Too many RevenueCat API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all RevenueCat routes
router.use(revenueCatRateLimit);

/**
 * POST /api/revenuecat/connect
 * Connect user's RevenueCat account by validating and storing API key
 */
router.post('/connect',
  authenticate,
  [
    body('apiKey')
      .isLength({ min: 10 })
      .withMessage('RevenueCat API key must be at least 10 characters')
      .matches(/^sk_/)
      .withMessage('Please provide a valid RevenueCat secret API key (starts with sk_)')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid API key format',
          errors: errors.array()
        });
      }

      const { apiKey } = req.body;
      const userId = req.user!.userId;

      console.log(`🔄 Validating RevenueCat API key for user: ${userId}`);

      // Check if this is a demo/test key
      const isDemoKey = apiKey === 'sk_demo_123456789' || 
                       apiKey === 'sk_test_123456789' || 
                       apiKey === 'sk_test_demo_key_12345';
      
      if (isDemoKey) {
        console.log(`🎭 Demo/test API key detected for user: ${userId}`);
        // Store the demo key for demo purposes
        await authService.updateRevenueCatConnection(userId, apiKey);
      } else {
        // Create RevenueCat service instance to validate real key
        const revenueCatService = new RevenueCatService(apiKey);
        const validation = await revenueCatService.validateApiKey();

        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            message: 'Invalid RevenueCat API key',
            details: validation.message
          });
        }

        // Store the validated API key securely
        await authService.updateRevenueCatConnection(userId, apiKey);
      }

      console.log(`✅ RevenueCat API key connected for user: ${userId}`);

      return res.json({
        success: true,
        message: 'RevenueCat account connected successfully!',
        connected: true,
        validatedAt: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('❌ RevenueCat connection error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to connect RevenueCat account',
        details: error.message
      });
    }
  }
);

/**
 * DELETE /api/revenuecat/disconnect
 * Disconnect user's RevenueCat account by removing API key
 */
router.delete('/disconnect',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      console.log(`🔄 Disconnecting RevenueCat account for user: ${userId}`);

      // Remove the API key from user profile
      await authService.updateRevenueCatConnection(userId, null);

      console.log(`✅ RevenueCat account disconnected for user: ${userId}`);

      return res.json({
        success: true,
        message: 'RevenueCat account disconnected successfully',
        connected: false,
        disconnectedAt: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('❌ RevenueCat disconnection error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to disconnect RevenueCat account',
        details: error.message
      });
    }
  }
);

/**
 * GET /api/revenuecat/status
 * Check RevenueCat connection status for current user
 */
router.get('/status',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const hasApiKey = !!(user.revenueCatApiKey);
      let validConnection = false;
      let lastValidated: string | null = null;
      
      console.log(`📊 RevenueCat status check for ${user.email}: hasApiKey=${hasApiKey}, apiKey=${user.revenueCatApiKey?.substring(0, 10)}...`);

      // Check if this is a demo/test key
      const isDemoKey = user.revenueCatApiKey === 'sk_demo_123456789' || 
                       user.revenueCatApiKey === 'sk_test_123456789' ||
                       user.revenueCatApiKey === 'sk_test_demo_key_12345';

      // If user has an API key, test its validity
      if (hasApiKey && user.revenueCatApiKey) {
        if (isDemoKey) {
          console.log(`🎭 Demo/test API key detected for status check`);
          validConnection = true; // Demo keys are always "valid"
          lastValidated = new Date().toISOString();
        } else {
          try {
            const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
            const validation = await revenueCatService.validateApiKey();
            validConnection = validation.valid;
            lastValidated = new Date().toISOString();
          } catch (error) {
            console.error('RevenueCat API key validation error:', error);
            validConnection = false;
          }
        }
      }

      // Add no-cache headers to prevent status caching issues
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      return res.json({
        success: true,
        connected: hasApiKey,
        valid: validConnection,
        lastValidated,
        message: hasApiKey 
          ? (validConnection ? 'RevenueCat account connected and valid' : 'RevenueCat API key invalid')
          : 'No RevenueCat account connected'
      });

    } catch (error: any) {
      console.error('❌ RevenueCat status check error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to check RevenueCat status',
        details: error.message
      });
    }
  }
);

/**
 * GET /api/revenuecat/dashboard
 * Get comprehensive dashboard metrics from user's RevenueCat data
 */
router.get('/dashboard',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      if (!user || !user.revenueCatApiKey) {
        return res.status(400).json({
          success: false,
          message: 'RevenueCat account not connected. Please connect your account first.',
          requiresConnection: true
        });
      }

      console.log(`🔄 Fetching dashboard metrics for user: ${userId}`);

      const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
      const metrics = await revenueCatService.getDashboardMetrics();

      console.log(`✅ Dashboard metrics fetched for user: ${userId}`);

      return res.json({
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: {
          ...metrics,
          dataSource: 'revenuecat',
          lastUpdated: new Date().toISOString(),
          userId: userId
        }
      });

    } catch (error: any) {
      console.error('❌ Dashboard metrics error:', error);
      
      // Handle specific RevenueCat errors
      if (error.message.includes('Invalid RevenueCat API key')) {
        return res.status(401).json({
          success: false,
          message: 'RevenueCat API key is invalid. Please reconnect your account.',
          requiresReconnection: true
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard metrics',
        details: error.message
      });
    }
  }
);

/**
 * GET /api/revenuecat/customers
 * Get customer list from user's RevenueCat account
 */
router.get('/customers',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      if (!user || !user.revenueCatApiKey) {
        return res.status(400).json({
          success: false,
          message: 'RevenueCat account not connected',
          requiresConnection: true
        });
      }

      const { limit = 50, cursor } = req.query;

      console.log(`🔄 Fetching customers for user: ${userId}`);

      const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
      const result = await revenueCatService.getCustomers(
        Math.min(Number(limit), 100), // Cap at 100 for performance
        cursor as string
      );

      console.log(`✅ Fetched ${result.customers.length} customers for user: ${userId}`);

      return res.json({
        success: true,
        message: 'Customers retrieved successfully',
        data: {
          customers: result.customers,
          hasMore: result.hasMore,
          nextCursor: result.nextCursor,
          count: result.customers.length,
          dataSource: 'revenuecat',
          lastUpdated: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('❌ Customers fetch error:', error);
      
      if (error.message.includes('Invalid RevenueCat API key')) {
        return res.status(401).json({
          success: false,
          message: 'RevenueCat API key is invalid',
          requiresReconnection: true
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        details: error.message
      });
    }
  }
);

/**
 * GET /api/revenuecat/products
 * Get products from user's RevenueCat account
 */
router.get('/products',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      if (!user || !user.revenueCatApiKey) {
        return res.status(400).json({
          success: false,
          message: 'RevenueCat account not connected',
          requiresConnection: true
        });
      }

      console.log(`🔄 Fetching products for user: ${userId}`);

      const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
      const products = await revenueCatService.getProducts();

      console.log(`✅ Fetched ${products.length} products for user: ${userId}`);

      return res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: {
          products,
          count: products.length,
          dataSource: 'revenuecat',
          lastUpdated: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('❌ Products fetch error:', error);
      
      if (error.message.includes('Invalid RevenueCat API key')) {
        return res.status(401).json({
          success: false,
          message: 'RevenueCat API key is invalid',
          requiresReconnection: true
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        details: error.message
      });
    }
  }
);

export default router;
