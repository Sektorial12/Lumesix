/**
 * RevenueCat Configuration
 * Add your RevenueCat API keys here
 */

// Import environment variables
import {
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_APP_ID,
} from '@env';

// Debug logging to see what keys are loaded
console.log('🔑 Environment Variables Debug:');
console.log('REVENUECAT_ANDROID_API_KEY:', REVENUECAT_ANDROID_API_KEY ? `${REVENUECAT_ANDROID_API_KEY.substring(0, 8)}...` : 'NOT SET');
console.log('REVENUECAT_IOS_API_KEY:', REVENUECAT_IOS_API_KEY ? `${REVENUECAT_IOS_API_KEY.substring(0, 8)}...` : 'NOT SET');

export const REVENUECAT_CONFIG = {
  // RevenueCat API Keys - Replace with your actual keys
  ios: {
    apiKey: REVENUECAT_IOS_API_KEY || 'appl_YOUR_IOS_API_KEY_HERE',
  },
  android: {
    apiKey: REVENUECAT_ANDROID_API_KEY || 'goog_YOUR_ANDROID_API_KEY_HERE',
  },
  
  // App configuration
  appId: REVENUECAT_APP_ID || 'lumesix-app',
  
  // Debug settings
  debug: __DEV__, // Enable debug logs in development
  
  // Features flags
  features: {
    realTimeAnalytics: true,
    webhooks: true,
    trials: true,
    familySharing: true,
  },
};

/**
 * Get the appropriate API key for the current platform
 */
export const getApiKey = (platform: 'ios' | 'android' = 'android'): string => {
  const key = REVENUECAT_CONFIG[platform].apiKey;
  
  if (!key || key.includes('YOUR_')) {
    console.warn(`⚠️ RevenueCat ${platform} API key not configured`);
    console.log('📝 To enable RevenueCat integration:');
    console.log('1. Sign up at https://app.revenuecat.com');
    console.log('2. Create a new app');
    console.log('3. Get your API keys from the RevenueCat dashboard');
    console.log('4. Update this config file or set environment variables');
    return '';
  }
  
  return key;
};

/**
 * Environment setup instructions
 */
export const SETUP_INSTRUCTIONS = {
  env: [
    'Create a .env file in your project root:',
    'REVENUECAT_IOS_API_KEY=appl_your_ios_key_here',
    'REVENUECAT_ANDROID_API_KEY=goog_your_android_key_here',
    'REVENUECAT_APP_ID=your_app_id',
  ],
  dashboard: [
    'RevenueCat Dashboard Setup:',
    '1. Go to https://app.revenuecat.com',
    '2. Create account or sign in',
    '3. Create new project → Add App',
    '4. Configure your app bundle ID/package name',
    '5. Get API keys from Project Settings → API Keys',
    '6. Add products in RevenueCat dashboard',
  ],
  testing: [
    'Testing Setup:',
    '1. Add test users in RevenueCat dashboard',
    '2. Create sandbox accounts (iOS) or test accounts (Android)',
    '3. Use RevenueCat\'s debug tools',
    '4. Check webhook endpoints for real-time events',
  ],
};

export default REVENUECAT_CONFIG;
