/**
 * Storage Utilities
 * AsyncStorage wrapper with error handling and type safety
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  REVENUECAT_API_KEY: 'revenuecat_api_key',
  APP_NAME: 'app_name',
  USER_SETTINGS: 'user_settings',
  LAST_SYNC: 'last_sync',
  CACHED_DASHBOARD_DATA: 'cached_dashboard_data',
  CACHED_INSIGHTS: 'cached_insights',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Generic storage operations with error handling
 */
class StorageService {
  /**
   * Store data with error handling
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve data with error handling and type safety
   */
  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return defaultValue || null;
      }
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get multiple items at once
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const keyValuePairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      
      keyValuePairs.forEach(([key, value]) => {
        try {
          result[key] = value ? JSON.parse(value) : null;
        } catch (parseError) {
          console.error(`Error parsing value for key ${key}:`, parseError);
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return keys.reduce((acc, key) => ({ ...acc, [key]: null }), {});
    }
  }

  /**
   * Set multiple items at once
   */
  async setMultiple<T>(items: Array<[string, T]>): Promise<boolean> {
    try {
      const keyValuePairs: Array<[string, string]> = items.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple items:', error);
      return false;
    }
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Specific storage functions for common operations
export const onboardingStorage = {
  async setCompleted(completed: boolean): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  },

  async isCompleted(): Promise<boolean> {
    const completed = await storageService.getItem<boolean>(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      false
    );
    return completed || false;
  },

  async setRevenueCatApiKey(apiKey: string): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.REVENUECAT_API_KEY, apiKey);
  },

  async getRevenueCatApiKey(): Promise<string | null> {
    return storageService.getItem<string>(STORAGE_KEYS.REVENUECAT_API_KEY);
  },

  async setAppName(appName: string): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.APP_NAME, appName);
  },

  async getAppName(): Promise<string | null> {
    return storageService.getItem<string>(STORAGE_KEYS.APP_NAME);
  },
};

export const userStorage = {
  async setSettings(settings: any): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.USER_SETTINGS, settings);
  },

  async getSettings(): Promise<any> {
    return storageService.getItem(STORAGE_KEYS.USER_SETTINGS, {
      notifications: {
        pushEnabled: true,
        churnAlerts: true,
        revenueUpdates: true,
        weeklyReports: true,
      },
      preferences: {
        darkMode: false,
        autoRefresh: true,
        currency: 'USD',
        timezone: 'UTC',
      },
    });
  },

  async setPreferences(preferences: any): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  async getPreferences(): Promise<any> {
    return storageService.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      darkMode: false,
      autoRefresh: true,
      currency: 'USD',
    });
  },
};

export const cacheStorage = {
  async setDashboardData(data: any): Promise<boolean> {
    const cacheData = {
      data,
      timestamp: new Date().toISOString(),
    };
    return storageService.setItem(STORAGE_KEYS.CACHED_DASHBOARD_DATA, cacheData);
  },

  async getDashboardData(): Promise<{ data: any; timestamp: string } | null> {
    return storageService.getItem(STORAGE_KEYS.CACHED_DASHBOARD_DATA);
  },

  async setInsights(insights: any[]): Promise<boolean> {
    const cacheData = {
      data: insights,
      timestamp: new Date().toISOString(),
    };
    return storageService.setItem(STORAGE_KEYS.CACHED_INSIGHTS, cacheData);
  },

  async getInsights(): Promise<{ data: any[]; timestamp: string } | null> {
    return storageService.getItem(STORAGE_KEYS.CACHED_INSIGHTS);
  },

  async setLastSync(timestamp: string): Promise<boolean> {
    return storageService.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
  },

  async getLastSync(): Promise<string | null> {
    return storageService.getItem<string>(STORAGE_KEYS.LAST_SYNC);
  },

  /**
   * Check if cached data is still valid (within specified minutes)
   */
  isCacheValid(cacheTimestamp: string, validityMinutes: number = 5): boolean {
    const cacheTime = new Date(cacheTimestamp).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - cacheTime) / (1000 * 60);
    
    return diffMinutes < validityMinutes;
  },
};

export default storageService;
