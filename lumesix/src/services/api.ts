/**
 * API Service  
 * Handles communication with the Lumesix backend and AI insights integration
 * Updated for Phase 1.9: Real backend integration with authentication
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { revenueCatService } from './revenuecat';

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    plan: string;
    revenueCatConnected: boolean;
    createdAt: string;
    lastLogin: string;
    isVerified: boolean;
  };
  message?: string;
}

interface RevenueCatConnectionResponse {
  success: boolean;
  connected: boolean;
  valid?: boolean;
  lastValidated?: string;
  data?: any;
  message?: string;
}

interface AIInsight {
  id: string;
  type: 'churn' | 'revenue' | 'growth' | 'pricing' | 'retention';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: {
    revenue: number;
    users: number;
    confidence: number;
  };
  recommendations: string[];
  timeframe: string;
  createdAt: string;
}

interface DashboardData {
  mrr: number;
  activeSubscribers: number;
  churnRate: number;
  conversionRate: number;
  lastUpdated: string;
}

interface Insight {
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

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

class ApiService {
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    // Use 10.0.2.2 for Android emulator, localhost for iOS simulator
    const defaultBaseUrl = Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000/api' 
      : 'http://localhost:3000/api';
    
    this.config = {
      baseUrl: config?.baseUrl || defaultBaseUrl,
      timeout: config?.timeout || 10000,
    };
    
    console.log(`🌐 API Service initialized for ${Platform.OS} with base URL: ${this.config.baseUrl}`);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    // Get auth token if required
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (requireAuth) {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Using auth token for request');
      } else {
        console.warn('⚠️ No auth token found for authenticated request');
      }
    }

    try {
      console.log(`📮 Making API request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  // ===== AUTHENTICATION METHODS =====

  /**
   * Register new user
   */
  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    // Store auth token if login successful
    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      console.log('🔑 Auth token stored successfully');
    } else {
      console.error('❌ Login failed - no token received:', response);
    }

    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/profile', { method: 'GET' }, true);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  // ===== REVENUECAT INTEGRATION =====

  /**
   * Connect RevenueCat account
   */
  async connectRevenueCat(apiKey: string): Promise<RevenueCatConnectionResponse> {
    return this.request<RevenueCatConnectionResponse>('/revenuecat/connect', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    }, true);
  }

  /**
   * Get RevenueCat connection status
   */
  async getRevenueCatStatus(): Promise<RevenueCatConnectionResponse> {
    return this.request<RevenueCatConnectionResponse>('/revenuecat/status', { method: 'GET' }, true);
  }

  /**
   * Get RevenueCat dashboard data
   */
  async getRevenueCatDashboard(): Promise<any> {
    return this.request<any>('/revenuecat/dashboard', { method: 'GET' }, true);
  }

  // ===== AI INSIGHTS METHODS =====

  /**
   * Get AI insights dashboard
   */
  async getAIInsightsDashboard(): Promise<any> {
    return this.request<any>('/ai-insights/dashboard', { method: 'GET' }, true);
  }

  /**
   * Get churn predictions
   */
  async getChurnPredictions(): Promise<any> {
    return this.request<any>('/ai-insights/churn-prediction', { method: 'GET' }, true);
  }

  /**
   * Get revenue optimization insights
   */
  async getRevenueOptimization(): Promise<any> {
    return this.request<any>('/ai-insights/revenue-optimization', { method: 'GET' }, true);
  }

  /**
   * Get business insights
   */
  async getBusinessInsights(): Promise<AIInsight[]> {
    const response = await this.request<{ success: boolean; data: { insights: AIInsight[] } }>(
      '/ai-insights/business-insights', 
      { method: 'GET' }, 
      true
    );
    return response.data?.insights || [];
  }

  /**
   * Get dashboard data with key metrics
   * Now integrates real backend data and AI insights
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Check if user is authenticated and has RevenueCat connected
      const isAuthenticated = await this.isLoggedIn();
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      // Try to get real RevenueCat data from backend
      try {
        const revenueCatData = await this.getRevenueCatDashboard();
        if (revenueCatData.success && revenueCatData.data) {
          console.log('📊 Using backend RevenueCat live data for dashboard');
          return {
            mrr: revenueCatData.data.mrr || 0,
            activeSubscribers: revenueCatData.data.totalActiveSubscribers || 0,
            churnRate: revenueCatData.data.churnRate || 0,
            conversionRate: revenueCatData.data.conversionRate || 0,
            lastUpdated: new Date().toISOString(),
          };
        }
      } catch (revenueCatError) {
        console.warn('RevenueCat data not available, user may not have connected account');
      }

      // Fallback: Use local RevenueCat SDK if available
      const localRevenueCatData = await revenueCatService.getSubscriptionAnalytics();
      if (localRevenueCatData && revenueCatService.isSDKReady()) {
        console.log('📊 Using local RevenueCat SDK data for dashboard');
        return {
          mrr: localRevenueCatData.mrr,
          activeSubscribers: localRevenueCatData.activeSubscriptions,
          churnRate: localRevenueCatData.churnRate,
          conversionRate: localRevenueCatData.conversionRate,
          lastUpdated: localRevenueCatData.lastUpdated,
        };
      }

      // Final fallback: mock data with authentication prompt
      console.log('🔍 Using mock data - user needs to connect RevenueCat account');
      return {
        mrr: 0,
        activeSubscribers: 0,
        churnRate: 0,
        conversionRate: 0,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('Failed to fetch dashboard data:', error);
      
      // Return empty data for unauthenticated users
      return {
        mrr: 0,
        activeSubscribers: 0,
        churnRate: 0,
        conversionRate: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // Insights endpoints
  async getInsights(filter?: string): Promise<Insight[]> {
    const queryParam = filter ? `?type=${filter}` : '';
    return this.request<Insight[]>(`/insights${queryParam}`);
  }

  async getInsightById(id: string): Promise<Insight> {
    return this.request<Insight>(`/insights/${id}`);
  }

  /**
   * Get metrics data for specific periods
   * Enhanced with RevenueCat subscription analytics
   */
  async getMetrics(period: '7d' | '30d' | '90d' | '12m' = '30d'): Promise<MetricData[]> {
    try {
      // Try RevenueCat data first for real-time metrics
      const revenueCatData = await revenueCatService.getSubscriptionAnalytics();
      
      if (revenueCatData && revenueCatService.isSDKReady()) {
        console.log(`📈 Using RevenueCat live metrics for ${period}`);
        return this.formatRevenueCatMetrics(revenueCatData, period);
      }

      // Fallback to backend API
      const response = await this.request<MetricData[]>(`/metrics?period=${period}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch metrics data, using mock data:', error);
      
      return this.getMockMetrics(period);
    }
  }

  async getChartData(
    metric: string,
    period: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<any[]> {
    return this.request<any[]>(`/charts/${metric}?period=${period}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  /**
   * Format RevenueCat analytics data into MetricData format
   */
  private formatRevenueCatMetrics(revenueCatData: any, period: string): MetricData[] {
    return [
      {
        label: 'Monthly Recurring Revenue',
        value: revenueCatData.mrr,
        change: 12.3, // This would be calculated from historical data
        trend: 'up' as const,
      },
      {
        label: 'Active Subscribers',
        value: revenueCatData.activeSubscriptions,
        change: 8.7,
        trend: 'up' as const,
      },
      {
        label: 'Churn Rate',
        value: revenueCatData.churnRate,
        change: -2.1, // Negative is good for churn
        trend: 'down' as const,
      },
      {
        label: 'Conversion Rate',
        value: revenueCatData.conversionRate,
        change: 3.2,
        trend: 'up' as const,
      },
    ];
  }

  // Mock data methods (for development when backend is not available)
  async getMockDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      mrr: 14560,
      activeSubscribers: 1456,
      churnRate: 0.052,
      conversionRate: 0.164,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getMockInsights(): Promise<Insight[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        type: 'churn',
        title: 'High Churn Risk Detected',
        description: '23 subscribers show patterns indicating 85% churn probability in the next 7 days',
        confidence: 0.85,
        impact: 'high',
        actionable: true,
        recommendation: 'Send targeted retention campaign with 20% discount offer',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'price',
        title: 'Price Optimization Opportunity',
        description: 'Premium tier could be increased by $2.99 with minimal impact on conversions',
        confidence: 0.78,
        impact: 'high',
        actionable: true,
        recommendation: 'A/B test price increase for new subscribers',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'cohort',
        title: 'Q4 Cohort Outperforming',
        description: 'Users acquired in Q4 2024 have 40% higher retention than average',
        confidence: 0.92,
        impact: 'medium',
        actionable: true,
        recommendation: 'Analyze Q4 acquisition channels and double down on successful strategies',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getMockMetrics(period?: string): Promise<MetricData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      { label: 'MRR', value: 14560, change: 12.3, trend: 'up' },
      { label: 'ARR', value: 174720, change: 15.8, trend: 'up' },
      { label: 'ARPU', value: 9.99, change: 1.5, trend: 'up' },
      { label: 'LTV', value: 89.91, change: 8.2, trend: 'up' },
      { label: 'CAC', value: 12.50, change: -5.3, trend: 'down' },
      { label: 'Churn Rate', value: 5.2, change: -0.8, trend: 'down' },
      { label: 'Retention (30d)', value: 78.5, change: 3.2, trend: 'up' },
      { label: 'Conversion Rate', value: 16.4, change: 2.1, trend: 'up' },
    ];
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types
export type { DashboardData, Insight, MetricData };
