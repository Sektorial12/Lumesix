/**
 * API Documentation Routes
 * Simple documentation endpoint for the Lumesix Backend API
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/docs
 * Display API documentation
 */
router.get('/', (req: Request, res: Response) => {
  const apiDocs = {
    name: "Lumesix Backend API",
    version: "1.0.0",
    description: "AI-Powered Subscription Analytics API",
    baseUrl: "http://localhost:3000",
    
    authentication: {
      type: "JWT Bearer Token",
      description: "Include JWT token in Authorization header: 'Bearer <token>'"
    },

    endpoints: {
      health: {
        method: "GET",
        path: "/health",
        description: "Server health check",
        authentication: false,
        example: "curl http://localhost:3000/health"
      },

      register: {
        method: "POST",
        path: "/api/auth/register", 
        description: "Register new user account",
        authentication: false,
        body: {
          email: "string (required)",
          password: "string (required, min 6 chars)",
          firstName: "string (required)",
          lastName: "string (required)"
        },
        example: `curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'`
      },

      login: {
        method: "POST",
        path: "/api/auth/login",
        description: "Login with email and password",
        authentication: false,
        body: {
          email: "string (required)",
          password: "string (required)"
        },
        example: `curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123"}'`
      },

      profile: {
        method: "GET",
        path: "/api/auth/profile",
        description: "Get current user profile",
        authentication: true,
        example: `curl http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer <your_jwt_token>"`
      },

      updateProfile: {
        method: "PUT", 
        path: "/api/auth/profile",
        description: "Update user profile",
        authentication: true,
        body: {
          firstName: "string (optional)",
          lastName: "string (optional)",
          revenueCatApiKey: "string (optional)"
        },
        example: `curl -X PUT http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"firstName":"Jane","lastName":"Smith"}'`
      },

      changePassword: {
        method: "POST",
        path: "/api/auth/change-password",
        description: "Change user password",
        authentication: true,
        body: {
          currentPassword: "string (required)",
          newPassword: "string (required, min 6 chars)"
        },
        example: `curl -X POST http://localhost:3000/api/auth/change-password \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"currentPassword":"oldpass","newPassword":"newpass123"}'`
      }
    },

    responses: {
      success: {
        structure: {
          success: true,
          message: "Success message",
          data: "Response data (varies by endpoint)"
        }
      },
      error: {
        structure: {
          success: false,
          message: "Error description",
          errors: "Validation errors (if applicable)"
        }
      }
    },

    status: {
      server: "✅ Running",
      database: "⚠️  MongoDB connection may be offline - using fallback mode", 
      authentication: "✅ JWT system active",
      rateLimiting: "✅ Active (100 requests per 15 minutes)"
    }
  };

  return res.json(apiDocs);
});

export default router;
