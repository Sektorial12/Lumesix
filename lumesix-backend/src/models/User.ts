/**
 * User Model - Lumesix Customer Account System
 * Represents customers who use Lumesix to analyze their subscription data
 */

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  revenueCatApiKey?: string;
  revenueCatAppId?: string;
  revenueCatConnected: boolean;
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(password: string): Promise<boolean>;
  getPublicProfile(): object;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  
  revenueCatApiKey: {
    type: String,
    select: false
  },
  
  revenueCatAppId: {
    type: String
  },
  
  revenueCatConnected: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.password;
      delete ret.revenueCatApiKey;
      delete ret.__v;
      return ret;
    }
  }
});

userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ plan: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    plan: this.plan,
    isVerified: this.isVerified,
    revenueCatConnected: this.revenueCatConnected,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

export default mongoose.model<IUser>('User', userSchema);
