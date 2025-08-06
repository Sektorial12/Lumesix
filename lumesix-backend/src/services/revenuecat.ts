/**
 * RevenueCat API Client
 * Handles all RevenueCat API interactions for Lumesix
 */

import axios from 'axios';

interface RevenueCatConfig {
  apiKey: string;
  baseUrl?: string;
}

interface SubscriberInfo {
  app_user_id: string;
  original_app_user_id: string;
  subscriptions: Record<string, any>;
  non_subscriptions: Record<string, any>;
  first_seen: string;
  last_seen: string;
  management_url: string;
}

interface ChartData {
  data: Array<{
    date: string;
    value: number;
  }>;
}

interface TransactionData {
  transactions: Array<{
    id: string;
    revenue: number;
    currency: string;
    product_id: string;
    purchased_at: string;
    app_user_id: string;
  }>;
}

export class RevenueCatClient {
  private client: any;
  private projectId: string;

  constructor(config: RevenueCatConfig, projectId: string) {
    this.projectId = projectId;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.revenuecat.com/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Lumesix/1.0.0'
      },
      timeout: 10000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error('RevenueCat API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get subscriber information
   */
  async getSubscriber(appUserId: string): Promise<SubscriberInfo> {
    const response = await this.client.get(
      `/subscribers/${appUserId}`
    );
    return response.data;
  }

  /**
   * Get active subscriptions chart data
   */
  async getActiveSubscriptionsChart(
    startDate?: string,
    endDate?: string
  ): Promise<ChartData> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await this.client.get(
      `/projects/${this.projectId}/charts/active_subscriptions?${params}`
    );
    return response.data;
  }

  /**
   * Get Monthly Recurring Revenue (MRR) chart data
   */
  async getMRRChart(
    startDate?: string,
    endDate?: string
  ): Promise<ChartData> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await this.client.get(
      `/projects/${this.projectId}/charts/mrr?${params}`
    );
    return response.data;
  }

  /**
   * Get conversion rate chart data
   */
  async getConversionChart(
    startDate?: string,
    endDate?: string
  ): Promise<ChartData> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await this.client.get(
      `/projects/${this.projectId}/charts/conversion?${params}`
    );
    return response.data;
  }

  /**
   * Get transaction data
   */
  async getTransactions(
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<TransactionData> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('limit', limit.toString());

    const response = await this.client.get(
      `/projects/${this.projectId}/transactions?${params}`
    );
    return response.data;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get project info or make a simple API call
      await this.client.get(`/projects/${this.projectId}/charts/active_subscriptions`);
      return true;
    } catch (error) {
      console.error('RevenueCat connection test failed:', error);
      return false;
    }
  }

  /**
   * Get comprehensive analytics data for AI processing
   */
  async getAnalyticsData(days: number = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    try {
      const [activeSubscriptions, mrr, conversions, transactions] = await Promise.all([
        this.getActiveSubscriptionsChart(startDate, endDate),
        this.getMRRChart(startDate, endDate),
        this.getConversionChart(startDate, endDate),
        this.getTransactions(startDate, endDate, 1000)
      ]);

      return {
        activeSubscriptions,
        mrr,
        conversions,
        transactions,
        dateRange: { startDate, endDate },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      throw new Error('Unable to fetch RevenueCat analytics data');
    }
  }
}

// Factory function to create RevenueCat client
export function createRevenueCatClient(projectId: string): RevenueCatClient {
  const apiKey = process.env.REVENUECAT_API_KEY;
  
  if (!apiKey) {
    throw new Error('REVENUECAT_API_KEY environment variable is required');
  }

  return new RevenueCatClient({ apiKey }, projectId);
}

// Mock data for development/testing
export const mockRevenueCatData = {
  activeSubscriptions: {
    data: [
      { date: '2025-07-01', value: 1250 },
      { date: '2025-07-15', value: 1380 },
      { date: '2025-08-01', value: 1420 },
      { date: '2025-08-04', value: 1456 }
    ]
  },
  mrr: {
    data: [
      { date: '2025-07-01', value: 12500 },
      { date: '2025-07-15', value: 13800 },
      { date: '2025-08-01', value: 14200 },
      { date: '2025-08-04', value: 14560 }
    ]
  },
  conversions: {
    data: [
      { date: '2025-07-01', value: 0.12 },
      { date: '2025-07-15', value: 0.15 },
      { date: '2025-08-01', value: 0.14 },
      { date: '2025-08-04', value: 0.16 }
    ]
  }
};
