/**
 * Test script for RevenueCat API Client
 */

import { RevenueCatClient, mockRevenueCatData } from './services/revenuecat';

async function testRevenueCatClient() {
  console.log('🧪 Testing RevenueCat API Client...\n');

  try {
    // Test 1: Client instantiation
    console.log('1. Testing Client Instantiation...');
    const client = new RevenueCatClient(
      { apiKey: 'test_api_key' },
      'test_project_id'
    );
    console.log('✅ RevenueCat client created successfully');

    // Test 2: Mock data validation
    console.log('\n2. Testing Mock Data...');
    console.log('✅ Active subscriptions mock data:', mockRevenueCatData.activeSubscriptions.data.length, 'data points');
    console.log('✅ MRR mock data:', mockRevenueCatData.mrr.data.length, 'data points');
    console.log('✅ Conversions mock data:', mockRevenueCatData.conversions.data.length, 'data points');

    // Test 3: Method signatures (without actual API calls)
    console.log('\n3. Testing Method Signatures...');
    
    // Check if methods exist
    const methods = [
      'getSubscriber',
      'getActiveSubscriptionsChart',
      'getMRRChart',
      'getConversionChart',
      'getTransactions',
      'testConnection',
      'getAnalyticsData'
    ];

    methods.forEach(method => {
      if (typeof (client as any)[method] === 'function') {
        console.log(`✅ Method ${method} exists`);
      } else {
        throw new Error(`❌ Method ${method} missing`);
      }
    });

    // Test 4: Mock data structure validation
    console.log('\n4. Testing Data Structure...');
    
    // Validate active subscriptions structure
    const activeSubs = mockRevenueCatData.activeSubscriptions.data[0];
    if (activeSubs && activeSubs.date && typeof activeSubs.value === 'number') {
      console.log('✅ Active subscriptions data structure valid');
    } else {
      throw new Error('❌ Active subscriptions data structure invalid');
    }

    // Validate MRR structure
    const mrrData = mockRevenueCatData.mrr.data[0];
    if (mrrData && mrrData.date && typeof mrrData.value === 'number') {
      console.log('✅ MRR data structure valid');
    } else {
      throw new Error('❌ MRR data structure invalid');
    }

    // Validate conversions structure
    const conversionData = mockRevenueCatData.conversions.data[0];
    if (conversionData && conversionData.date && typeof conversionData.value === 'number') {
      console.log('✅ Conversions data structure valid');
    } else {
      throw new Error('❌ Conversions data structure invalid');
    }

    console.log('\n🎉 All RevenueCat API Client tests passed!');

    // Summary
    console.log('\n📊 Summary:');
    console.log('   Client instantiation: ✅');
    console.log('   Mock data validation: ✅');
    console.log('   Method signatures: ✅');
    console.log('   Data structures: ✅');
    console.log(`   Available methods: ${methods.length}`);

  } catch (error) {
    console.error('❌ RevenueCat API Client test failed:', error);
    process.exit(1);
  }
}

// Run tests
testRevenueCatClient();
