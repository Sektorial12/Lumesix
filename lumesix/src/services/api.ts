/**
 * API Service
 * Handles communication with the Lumesix backend
 */

interface ApiConfig {
  baseUrl: string;
  timeout: number;
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
    this.config = {
      baseUrl: config?.baseUrl || 'http://localhost:3000/api/v1',
      timeout: config?.timeout || 10000,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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

  // Dashboard endpoints
  async getDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/analytics');
  }

  // Insights endpoints
  async getInsights(filter?: string): Promise<Insight[]> {
    const queryParam = filter ? `?type=${filter}` : '';
    return this.request<Insight[]>(`/insights${queryParam}`);
  }

  async getInsightById(id: string): Promise<Insight> {
    return this.request<Insight>(`/insights/${id}`);
  }

  // Metrics endpoints
  async getMetrics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<MetricData[]> {
    return this.request<MetricData[]>(`/metrics?period=${period}`);
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

  async getMockMetrics(): Promise<MetricData[]> {
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
