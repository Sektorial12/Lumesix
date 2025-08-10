import Purchases, { 
  CustomerInfo, 
  PurchasesOffering, 
  PurchasesStoreTransaction,
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform } from 'react-native';

// Import configuration
import { getApiKey, REVENUECAT_CONFIG } from '../config/revenuecat';

/**
 * RevenueCat Service Class
 * Manages SDK initialization and subscription data operations
 */
export class RevenueCatService {
  private static instance: RevenueCatService;
  private isInitialized = false;

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called when app starts
   */
  public async initializeSDK(apiKey?: string): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('RevenueCat SDK already initialized');
        return;
      }

      // Use provided API key or get from config
      const key = apiKey || getApiKey(Platform.OS as 'ios' | 'android');
      
      if (!key || key.includes('YOUR_')) {
        console.warn('⚠️ RevenueCat API key not configured. Using demo mode.');
        this.isInitialized = true; // Mark as initialized for demo
        return;
      }

      // Configure SDK
      await Purchases.setLogLevel(LOG_LEVEL.INFO);
      await Purchases.configure({ apiKey: key });
      
      this.isInitialized = true;
      console.log('✅ RevenueCat SDK initialized successfully');

      // Set up event listeners
      this.setupEventListeners();

    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat SDK:', error);
      throw error;
    }
  }

  /**
   * Get customer information and active subscriptions
   */
  public async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat SDK not initialized. Using mock data.');
        return null;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      console.log('📊 Customer info retrieved:', {
        userId: customerInfo.originalAppUserId,
        activeSubscriptions: Object.keys(customerInfo.activeSubscriptions),
        entitlements: Object.keys(customerInfo.entitlements.active),
      });

      return customerInfo;
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Get available subscription offerings
   */
  public async getOfferings(): Promise<PurchasesOffering[] | null> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat SDK not initialized. Using mock data.');
        return null;
      }

      const offerings = await Purchases.getOfferings();
      
      if (offerings.current) {
        console.log('📦 Current offering:', {
          identifier: offerings.current.identifier,
          packages: offerings.current.availablePackages.length,
        });
      }

      return offerings.current ? [offerings.current] : [];
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Get transaction history for analytics
   */
  public async getTransactionHistory(): Promise<PurchasesStoreTransaction[] | null> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat SDK not initialized. Using mock data.');
        return null;
      }

      // Note: Transaction history may require additional setup
      // This is a placeholder for when the feature is available
      console.log('📈 Transaction history requested');
      return [];
    } catch (error) {
      console.error('❌ Failed to get transaction history:', error);
      return null;
    }
  }

  /**
   * Check if user has active subscription
   */
  public async hasActiveSubscription(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      return Object.keys(customerInfo.activeSubscriptions).length > 0;
    } catch (error) {
      console.error('❌ Failed to check subscription status:', error);
      return false;
    }
  }

  /**
   * Get subscription analytics data
   * This will be expanded to fetch real analytics from RevenueCat's REST API
   */
  public async getSubscriptionAnalytics() {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (!customerInfo) {
        // Return mock data if SDK not available
        return this.getMockAnalyticsData();
      }

      // Process real RevenueCat data
      const analytics = {
        mrr: this.calculateMRR(customerInfo),
        activeSubscriptions: Object.keys(customerInfo.activeSubscriptions).length,
        churnRate: await this.calculateChurnRate(),
        conversionRate: await this.calculateConversionRate(),
        lastUpdated: new Date().toISOString(),
      };

      console.log('📊 Analytics calculated:', analytics);
      return analytics;

    } catch (error) {
      console.error('❌ Failed to get subscription analytics:', error);
      return this.getMockAnalyticsData();
    }
  }

  /**
   * Setup event listeners for subscription changes
   */
  private setupEventListeners(): void {
    // Listen for customer info updates
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('👤 Customer info updated:', {
        userId: customerInfo.originalAppUserId,
        activeSubscriptions: Object.keys(customerInfo.activeSubscriptions),
      });
    });
  }



  /**
   * Calculate Monthly Recurring Revenue from customer data
   */
  private calculateMRR(customerInfo: CustomerInfo): number {
    // This is a simplified calculation
    // In practice, you'd need to aggregate across all customers
    const activeSubscriptions = Object.keys(customerInfo.activeSubscriptions);
    
    // Mock calculation - replace with real logic
    return activeSubscriptions.length * 9.99; // Assuming $9.99 subscription
  }

  /**
   * Calculate churn rate (placeholder)
   */
  private async calculateChurnRate(): Promise<number> {
    // This would require historical data analysis
    // For now, return a mock value
    return 5.2;
  }

  /**
   * Calculate conversion rate (placeholder)
   */
  private async calculateConversionRate(): Promise<number> {
    // This would require trial-to-paid conversion data
    // For now, return a mock value
    return 12.8;
  }

  /**
   * Get mock analytics data for development/demo
   */
  private getMockAnalyticsData() {
    return {
      mrr: 14560,
      activeSubscriptions: 1456,
      churnRate: 5.2,
      conversionRate: 12.8,
      arpu: 9.99,
      ltv: 156.75,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Check if SDK is properly initialized
   */
  public isSDKReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const revenueCatService = RevenueCatService.getInstance();

// Export types for use in components
export type { CustomerInfo, PurchasesOffering };
