/**
 * Authentication Service
 * Handles user registration, login, token management
 */

import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User, { IUser } from '../models/User';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'lumesix-secret-key-change-in-production';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<{ user: IUser; token: string }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      const user = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName
      });

      await user.save();

      const token = this.generateToken({
        userId: (user._id as Types.ObjectId).toString(),
        email: user.email,
        plan: user.plan
      });

      console.log(`✅ New user registered: ${user.email}`);
      return { user, token };

    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(loginData: LoginData): Promise<{ user: IUser; token: string }> {
    try {
      console.log(`🔍 Login attempt for: ${loginData.email}`);
      const user = await User.findOne({ email: loginData.email }).select('+password');
      
      if (!user) {
        console.log(`❌ User not found: ${loginData.email}`);
        throw new Error('Invalid email or password');
      }
      
      console.log(`✅ User found: ${user.email}, active: ${user.isActive}`);

      if (!user.isActive) {
        console.log(`❌ Account inactive: ${user.email}`);
        throw new Error('Account is deactivated. Please contact support.');
      }

      console.log(`🔐 Comparing password for: ${user.email}`);
      const isValidPassword = await user.comparePassword(loginData.password);
      console.log(`🔑 Password valid: ${isValidPassword}`);
      
      if (!isValidPassword) {
        console.log(`❌ Invalid password for: ${user.email}`);
        throw new Error('Invalid email or password');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = this.generateToken({
        userId: (user._id as Types.ObjectId).toString(),
        email: user.email,
        plan: user.plan
      });

      console.log(`✅ User logged in: ${user.email}`);
      return { user, token };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(payload: TokenPayload): string {
    return jwt.sign(
      payload as object, 
      this.JWT_SECRET as string, 
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.error('❌ Get user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      const allowedUpdates = {
        firstName: updates.firstName,
        lastName: updates.lastName,
      };

      const user = await User.findByIdAndUpdate(
        userId,
        allowedUpdates,
        { new: true, runValidators: true }
      );

      if (user) {
        console.log(`✅ Profile updated for user: ${user.email}`);
      }

      return user;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      console.log(`✅ Password changed for user: ${user.email}`);
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error;
    }
  }

  /**
   * Update RevenueCat connection info for user
   */
  async updateRevenueCatConnection(userId: string, apiKey: string | null): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          revenueCatApiKey: apiKey,
          revenueCatConnected: apiKey !== null
        },
        { new: true }
      );

      if (user) {
        console.log(`✅ RevenueCat connected for user: ${user.email}`);
      }

      return user;
    } catch (error) {
      console.error('❌ RevenueCat connection error:', error);
      throw error;
    }
  }
}

export default new AuthService();
