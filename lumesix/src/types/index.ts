/**
 * Type Definitions
 * Shared types across the application
 */

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Insights: undefined;
  Metrics: undefined;
  Settings: undefined;
};

// Data Types
export interface DashboardData {
  mrr: number;
  activeSubscribers: number;
  churnRate: number;
  conversionRate: number;
  lastUpdated: string;
}

export interface Insight {
  id: string;
  type: 'churn' | 'price' | 'cohort' | 'seasonal';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
  createdAt: string;
}

export interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ChartData {
  period: string;
  value: number;
  label?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastLoginAt: string;
}

export interface UserSettings {
  notifications: {
    pushEnabled: boolean;
    churnAlerts: boolean;
    revenueUpdates: boolean;
    weeklyReports: boolean;
  };
  preferences: {
    darkMode: boolean;
    autoRefresh: boolean;
    currency: string;
    timezone: string;
  };
}

// API Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// RevenueCat Types
export interface RevenueCatConfig {
  apiKey: string;
  projectId: string;
  appUserId?: string;
}

export interface SubscriptionData {
  id: string;
  userId: string;
  productId: string;
  purchaseDate: string;
  expirationDate?: string;
  isActive: boolean;
  revenue: number;
  platform: 'ios' | 'android';
}

// Component Props Types
export interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  onPress?: () => void;
  style?: any;
  variant?: 'primary' | 'secondary';
}

export interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  type: 'churn' | 'price' | 'cohort' | 'seasonal';
  recommendation?: string;
  onPress?: () => void;
}

// Filter Types
export type InsightFilter = 'all' | 'churn' | 'price' | 'cohort' | 'seasonal';
export type MetricPeriod = '7d' | '30d' | '90d' | '1y';

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Constants
export const INSIGHT_TYPES = {
  CHURN: 'churn',
  PRICE: 'price',
  COHORT: 'cohort',
  SEASONAL: 'seasonal',
} as const;

export const IMPACT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const METRIC_PERIODS = {
  SEVEN_DAYS: '7d',
  THIRTY_DAYS: '30d',
  NINETY_DAYS: '90d',
  ONE_YEAR: '1y',
} as const;
