/**
 * Mock data for Lumesix frontend development
 * Based on backend service interfaces
 */

export const mockInsights = [
  {
    id: 'churn_1',
    type: 'churn_prediction',
    title: 'High Churn Risk: User #1234',
    description: 'Subscriber has 82% probability of churning in the next 5 days.',
    confidenceScore: 0.82,
    impactScore: 'high',
    recommendedAction: 'Send retention offer with a 25% discount.',
    supportingData: {
      subscriberId: 'user_1234',
      riskFactors: ['Expiring soon', 'Below average revenue'],
      revenue: 9.99,
    },
    createdAt: new Date('2025-08-04T10:00:00Z'),
    expiresAt: new Date('2025-08-11T10:00:00Z'),
  },
  {
    id: 'price_1',
    type: 'price_optimization',
    title: 'Price Optimization for "premium_monthly"',
    description: 'Consider decreasing price from $9.99 to $8.99 to maximize revenue.',
    confidenceScore: 0.75,
    impactScore: 'medium',
    recommendedAction: 'Test price change to $8.99 - expected +12% revenue change.',
    supportingData: {
      productId: 'premium_monthly',
      currentPrice: 9.99,
      recommendedPrice: 8.99,
      expectedImpact: { revenueChange: 0.12 },
    },
    createdAt: new Date('2025-08-02T14:30:00Z'),
    expiresAt: new Date('2025-09-02T14:30:00Z'),
  },
  {
    id: 'cohort_1',
    type: 'cohort_analysis',
    title: 'July Cohort Performing Well',
    description: 'The July 2025 cohort has 15% better retention than the June 2025 cohort.',
    confidenceScore: 0.9,
    impactScore: 'high',
    recommendedAction: 'Analyze marketing campaigns from July to replicate success.',
    supportingData: {
      bestCohort: { month: '2025-07', retentionRate: 0.65 },
      worstCohort: { month: '2025-06', retentionRate: 0.5 },
    },
    createdAt: new Date('2025-08-01T11:00:00Z'),
    expiresAt: new Date('2025-08-15T11:00:00Z'),
  },
  {
    id: 'seasonal_1',
    type: 'seasonal_pattern',
    title: 'Summer Signup Dip',
    description: 'Observed a 20% decrease in new subscriptions during summer months.',
    confidenceScore: 0.7,
    impactScore: 'medium',
    recommendedAction: 'Plan a "Summer Sale" marketing campaign for next year.',
    supportingData: {
      peakMonth: 'December',
      lowMonth: 'July',
      variation: -0.2,
    },
    createdAt: new Date('2025-07-28T09:00:00Z'),
    expiresAt: new Date('2025-09-28T09:00:00Z'),
  },
];

export const mockChartData = {
  mrr: {
    data: [
      { date: '2025-05-01', value: 12000 },
      { date: '2025-06-01', value: 12500 },
      { date: '2025-07-01', value: 13800 },
      { date: '2025-08-01', value: 14200 },
    ],
  },
  activeSubscriptions: {
    data: [
      { date: '2025-05-01', value: 1150 },
      { date: '2025-06-01', value: 1250 },
      { date: '2025-07-01', value: 1380 },
      { date: '2025-08-01', value: 1420 },
    ],
  },
};

export const mockKpis = {
  mrr: {
    value: 14200,
    change: 0.05, // 5% increase from last month
  },
  activeSubscriptions: {
    value: 1420,
    change: 0.03, // 3% increase
  },
  churnRate: {
    value: 0.04, // 4%
    change: -0.1, // 10% decrease from last month (which is good)
  },
};

export const mockHistory = [
  { id: '1', name: 'Apple Music', date: 'Jun 12, 10:30 pm', amount: -36.00, color: '#bee3f8' },
  { id: '2', name: 'Apple Music', date: 'Jun 08, 14:40 pm', amount: -12.00, color: '#fed7d7' },
  { id: '3', name: 'Spotify', date: 'Jun 01, 09:00 am', amount: -8.99, color: '#c6f6d5' },
];
