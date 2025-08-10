/**
 * Authentication Routes
 * /api/auth endpoints for user registration, login, profile management
 */

import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import authService from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Rate limiting for auth endpoints (relaxed for development)
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 requests per 5 minutes (development friendly)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.'
  }
});

/**
 * POST /api/auth/register
 * Register a new Lumesix customer
 */
router.post('/register', 
  registerLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name is required and must be less than 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name is required and must be less than 50 characters')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, firstName, lastName } = req.body;
      
      const { user, token } = await authService.register({
        email,
        password,
        firstName,
        lastName
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to Lumesix.',
        user: user.getPublicProfile(),
        token
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post('/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      
      const { user, token } = await authService.login({ email, password });

      return res.json({
        success: true,
        message: 'Login successful',
        user: user.getPublicProfile(),
        token
      });

    } catch (error: any) {
      console.error('Login error:', error);
      
      return res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }
);

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile (requires authentication)
 */
router.put('/profile',
  authenticate,
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { firstName, lastName } = req.body;
      
      const user = await authService.updateProfile(req.user.userId, {
        firstName,
        lastName
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: user.getPublicProfile()
      });

    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error occurred'
      });
    }
  }
);

/**
 * POST /api/auth/change-password
 * Change user password (requires authentication)
 */
router.post('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(req.user.userId, currentPassword, newPassword);

      return res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error: any) {
      console.error('Password change error:', error);
      
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
);

export default router;
