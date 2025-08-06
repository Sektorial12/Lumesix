/**
 * Test script for AI Insights Engine
 */

import { insightsEngine } from './services/insights';

// Mock subscription data for testing
const mockSubscriptions = [
  {
    id: 'sub_1',
    userId: 'user_1',
    status: 'active' as const,
    revenue: 9.99,
    purchaseDate: new Date('2025-07-01'),
    expirationDate: new Date('2025-08-10'), // Expiring soon
    productId: 'premium_monthly',
    platform: 'ios' as const
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    status: 'active' as const,
    revenue: 19.99,
    purchaseDate: new Date('2025-06-15'),
    expirationDate: new Date('2025-09-15'),
    productId: 'premium_monthly',
    platform: 'android' as const
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    status: 'cancelled' as const,
    revenue: 9.99,
    purchaseDate: new Date('2025-05-01'),
    expirationDate: new Date('2025-07-01'),
    productId: 'premium_monthly',
    platform: 'ios' as const
  },
  {
    id: 'sub_4',
    userId: 'user_4',
    status: 'active' as const,
    revenue: 99.99,
    purchaseDate: new Date('2025-01-01'),
    expirationDate: new Date('2026-01-01'),
    productId: 'premium_annual',
    platform: 'ios' as const
  }
];

async function testInsightsEngine() {
  console.log('🧪 Testing AI Insights Engine...\n');

  try {
    // Test 1: Churn Predictions
    console.log('1. Testing Churn Predictions...');
    const churnInsights = await insightsEngine.generateChurnPredictions(mockSubscriptions);
    console.log(`✅ Generated ${churnInsights.length} churn insights`);
    if (churnInsights.length > 0 && churnInsights[0]) {
      console.log(`   Sample insight: ${churnInsights[0].title}`);
      console.log(`   Confidence: ${churnInsights[0].confidenceScore}`);
    }

    // Test 2: Price Optimization
    console.log('\n2. Testing Price Optimization...');
    const priceInsights = await insightsEngine.generatePriceOptimizations(mockSubscriptions);
    console.log(`✅ Generated ${priceInsights.length} price optimization insights`);
    if (priceInsights.length > 0 && priceInsights[0]) {
      console.log(`   Sample insight: ${priceInsights[0].title}`);
      console.log(`   Recommended action: ${priceInsights[0].recommendedAction}`);
    }

    // Test 3: Cohort Analysis
    console.log('\n3. Testing Cohort Analysis...');
    const cohortInsights = await insightsEngine.generateCohortInsights(mockSubscriptions);
    console.log(`✅ Generated ${cohortInsights.length} cohort insights`);
    if (cohortInsights.length > 0 && cohortInsights[0]) {
      console.log(`   Sample insight: ${cohortInsights[0].title}`);
    }

    // Test 4: Seasonal Patterns
    console.log('\n4. Testing Seasonal Pattern Detection...');
    const seasonalInsights = await insightsEngine.generateSeasonalInsights(mockSubscriptions);
    console.log(`✅ Generated ${seasonalInsights.length} seasonal insights`);
    if (seasonalInsights.length > 0 && seasonalInsights[0]) {
      console.log(`   Sample insight: ${seasonalInsights[0].title}`);
    }

    console.log('\n🎉 All AI Insights Engine tests passed!');
    
    // Summary
    const totalInsights = churnInsights.length + priceInsights.length + cohortInsights.length + seasonalInsights.length;
    console.log(`\n📊 Summary:`);
    console.log(`   Total insights generated: ${totalInsights}`);
    console.log(`   Churn predictions: ${churnInsights.length}`);
    console.log(`   Price optimizations: ${priceInsights.length}`);
    console.log(`   Cohort analyses: ${cohortInsights.length}`);
    console.log(`   Seasonal patterns: ${seasonalInsights.length}`);

  } catch (error) {
    console.error('❌ AI Insights Engine test failed:', error);
    process.exit(1);
  }
}

// Run tests
testInsightsEngine();
