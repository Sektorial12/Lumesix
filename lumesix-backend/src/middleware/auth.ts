/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    plan: string;
  };
}

/**
 * JWT Authentication Middleware
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Check if user has required plan
 */
export const requirePlan = (requiredPlan: 'free' | 'pro' | 'enterprise') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
      return;
    }

    const planHierarchy = { free: 1, pro: 2, enterprise: 3 };
    const userPlanLevel = planHierarchy[req.user.plan as keyof typeof planHierarchy];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      res.status(403).json({
        success: false,
        message: `${requiredPlan} plan required for this feature.`,
        requiredPlan,
        userPlan: req.user.plan
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token invalid, but continue without auth
        console.log('Invalid token in optional auth, continuing...');
      }
    }

    next();
  } catch (error) {
    next();
  }
};
