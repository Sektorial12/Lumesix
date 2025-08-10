/**
 * RevenueCat Service - Backend Integration
 * Handles customer RevenueCat API integration with secure key management
 */

import axios from 'axios';

export interface RevenueCatCustomer {
  id: string;
  attributes: {
    email?: string;
    $idfa?: string;
    $idfv?: string;
    $androidId?: string;
  };
  deleted: boolean;
  first_seen: string;
  last_seen: string;
  management_url?: string;
  non_subscriptions: Record<string, any[]>;
  other_purchases: Record<string, any[]>;
  subscriptions: Record<string, RevenueCatSubscription>;
}

export interface RevenueCatSubscription {
  auto_resume_date?: string;
  billing_issues_detected_at?: string;
  expires_date?: string;
  grace_period_expires_date?: string;
  is_sandbox: boolean;
  original_purchase_date: string;
  ownership_type: 'PURCHASED' | 'FAMILY_SHARED' | 'PROMOTIONAL';
  period_type: 'INTRO' | 'NORMAL' | 'TRIAL';
  purchase_date: string;
  refunded_at?: string;
  store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'PROMOTIONAL';
  unsubscribe_detected_at?: string;
}

export interface RevenueCatProduct {
  created_at: string;
  display_name: string;
  identifier: string;
  store_identifier: string;
  type: 'subscription' | 'non_subscription';
}

export interface DashboardMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  subscriptionGrowth: number;
  retentionRate: number;
  lifetimeValue: number;
}

export class RevenueCatService {
  private apiKey: string;
  private apiClient: any;
  private readonly baseURL = 'https://api.revenuecat.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Platform': 'server'
      },
      timeout: 30000 // 30 seconds timeout
    });

    // Add request/response interceptors for logging and error handling
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config: any) => {
        console.log(`🔄 RevenueCat API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: any) => {
        console.error('❌ RevenueCat Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response: any) => {
        console.log(`✅ RevenueCat API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: any) => {
        console.error('❌ RevenueCat Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.response?.data?.message || error.message
        });
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Invalid RevenueCat API key. Please check your credentials.');
        case 403:
          return new Error('RevenueCat API access forbidden. Check your API key permissions.');
        case 404:
          return new Error('RevenueCat resource not found.');
        case 429:
          return new Error('RevenueCat API rate limit exceeded. Please try again later.');
        case 500:
        case 502:
        case 503:
          return new Error('RevenueCat service temporarily unavailable. Please try again.');
        default:
          return new Error(`RevenueCat API error: ${data?.message || error.message}`);
      }
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new Error('Unable to connect to RevenueCat API. Please check your internet connection.');
    }
    
    return new Error(`RevenueCat service error: ${error.message}`);
  }

  /**
   * Validate RevenueCat API key by making a test request
   */
  async validateApiKey(): Promise<{ valid: boolean; message: string }> {
    try {
      await this.apiClient.get('/subscribers', {
        params: { limit: 1 }
      });
      return { valid: true, message: 'API key is valid' };
    } catch (error: any) {
      return { 
        valid: false, 
        message: error.message || 'API key validation failed'
      };
    }
  }

  /**
   * Get all customers/subscribers
   */
  async getCustomers(limit = 100, startingAfter?: string): Promise<{
    customers: RevenueCatCustomer[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    try {
      const params: any = { limit };
      if (startingAfter) {
        params.starting_after = startingAfter;
      }

      const response = await this.apiClient.get('/subscribers', { params });
      
      return {
        customers: response.data.subscribers || [],
        hasMore: response.data.has_more || false,
        nextCursor: response.data.next_page || undefined
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get specific customer by ID
   */
  async getCustomer(customerId: string): Promise<RevenueCatCustomer> {
    try {
      const response = await this.apiClient.get(`/subscribers/${customerId}`);
      return response.data.subscriber;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<RevenueCatProduct[]> {
    try {
      const response = await this.apiClient.get('/products');
      return response.data.products || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate comprehensive dashboard metrics from customer data
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      console.log('🔄 Calculating dashboard metrics from RevenueCat data...');
      
      // Get all customers with pagination
      let allCustomers: RevenueCatCustomer[] = [];
      let hasMore = true;
      let cursor: string | undefined;
      
      while (hasMore) {
        const { customers, hasMore: more, nextCursor } = await this.getCustomers(1000, cursor);
        allCustomers = [...allCustomers, ...customers];
        hasMore = more;
        cursor = nextCursor;
      }

      return this.calculateMetricsFromCustomers(allCustomers);
    } catch (error) {
      console.error('❌ Error calculating dashboard metrics:', error);
      throw error;
    }
  }

  private calculateMetricsFromCustomers(customers: RevenueCatCustomer[]): DashboardMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let totalRevenue = 0;
    let monthlyRecurringRevenue = 0;
    let activeSubscriptions = 0;
    let totalCustomers = customers.length;
    let recentChurned = 0;
    let recentActive = 0;
    let customerRevenues: number[] = [];

    customers.forEach(customer => {
      let customerRevenue = 0;
      let hasActiveSubscription = false;
      let isRecentCustomer = false;

      const firstSeenDate = new Date(customer.first_seen);
      const lastSeenDate = new Date(customer.last_seen);
      
      if (firstSeenDate >= thirtyDaysAgo) {
        isRecentCustomer = true;
      }

      // Process subscriptions
      Object.values(customer.subscriptions || {}).forEach(subscription => {
        const expiresDate = subscription.expires_date ? new Date(subscription.expires_date) : null;
        const isActive = !expiresDate || expiresDate > now;
        
        if (isActive) {
          hasActiveSubscription = true;
          activeSubscriptions++;
          
          // Estimate monthly revenue (simplified)
          // This would need product pricing data for accurate calculations
          const estimatedMonthlyValue = this.estimateSubscriptionValue(subscription);
          monthlyRecurringRevenue += estimatedMonthlyValue;
          customerRevenue += estimatedMonthlyValue;
        }

        // Add to total revenue (simplified - would need actual transaction data)
        const subscriptionRevenue = this.estimateLifetimeSubscriptionRevenue(subscription);
        totalRevenue += subscriptionRevenue;
        customerRevenue += subscriptionRevenue;
      });

      // Process non-subscriptions (one-time purchases)
      Object.values(customer.non_subscriptions || {}).forEach(purchases => {
        purchases.forEach(purchase => {
          // Estimate one-time purchase value
          const purchaseValue = this.estimatePurchaseValue(purchase);
          totalRevenue += purchaseValue;
          customerRevenue += purchaseValue;
        });
      });

      customerRevenues.push(customerRevenue);

      // Churn analysis for recent customers
      if (isRecentCustomer) {
        if (hasActiveSubscription || lastSeenDate >= thirtyDaysAgo) {
          recentActive++;
        } else {
          recentChurned++;
        }
      }
    });

    // Calculate metrics
    const churnRate = recentActive + recentChurned > 0 
      ? (recentChurned / (recentActive + recentChurned)) * 100 
      : 0;

    const averageRevenuePerUser = totalCustomers > 0 
      ? totalRevenue / totalCustomers 
      : 0;

    const retentionRate = 100 - churnRate;

    // Calculate growth (simplified)
    const subscriptionGrowth = this.calculateSubscriptionGrowth(customers);

    const lifetimeValue = averageRevenuePerUser * (retentionRate > 0 ? (100 / (100 - retentionRate)) : 1);

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRecurringRevenue: Math.round(monthlyRecurringRevenue * 100) / 100,
      activeSubscriptions,
      churnRate: Math.round(churnRate * 100) / 100,
      averageRevenuePerUser: Math.round(averageRevenuePerUser * 100) / 100,
      subscriptionGrowth: Math.round(subscriptionGrowth * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
      lifetimeValue: Math.round(lifetimeValue * 100) / 100
    };
  }

  private estimateSubscriptionValue(subscription: RevenueCatSubscription): number {
    // This is a simplified estimation
    // In reality, you'd need product pricing data from RevenueCat
    switch (subscription.store) {
      case 'APP_STORE':
      case 'PLAY_STORE':
        return subscription.period_type === 'TRIAL' ? 0 : 9.99; // Estimated monthly value
      case 'STRIPE':
        return 19.99; // Estimated monthly value for web subscriptions
      default:
        return 4.99;
    }
  }

  private estimateLifetimeSubscriptionRevenue(subscription: RevenueCatSubscription): number {
    const monthlyValue = this.estimateSubscriptionValue(subscription);
    const startDate = new Date(subscription.original_purchase_date);
    const endDate = subscription.expires_date ? new Date(subscription.expires_date) : new Date();
    
    const monthsActive = Math.max(1, 
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    return monthlyValue * monthsActive;
  }

  private estimatePurchaseValue(purchase: any): number {
    // Simplified one-time purchase value estimation
    return 2.99; // Default estimated value
  }

  private calculateSubscriptionGrowth(customers: RevenueCatCustomer[]): number {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let currentPeriodActive = 0;
    let previousPeriodActive = 0;

    customers.forEach(customer => {
      const firstSeen = new Date(customer.first_seen);
      
      Object.values(customer.subscriptions || {}).forEach(subscription => {
        const expiresDate = subscription.expires_date ? new Date(subscription.expires_date) : null;
        const isCurrentlyActive = !expiresDate || expiresDate > now;
        
        if (isCurrentlyActive && firstSeen >= thirtyDaysAgo) {
          currentPeriodActive++;
        } else if (isCurrentlyActive && firstSeen >= sixtyDaysAgo && firstSeen < thirtyDaysAgo) {
          previousPeriodActive++;
        }
      });
    });

    if (previousPeriodActive === 0) return currentPeriodActive > 0 ? 100 : 0;
    
    return ((currentPeriodActive - previousPeriodActive) / previousPeriodActive) * 100;
  }
}

export default RevenueCatService;
