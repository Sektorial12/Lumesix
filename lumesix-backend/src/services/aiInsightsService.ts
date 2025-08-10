/**
 * AI Insights Engine - Advanced Analytics & Machine Learning
 * Transforms subscription data into actionable business intelligence
 */

import { RevenueCatCustomer, RevenueCatSubscription } from './revenueCatService';

export interface ChurnPrediction {
  customerId: string;
  email: string | undefined;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendedActions: string[];
  daysUntilChurn: number | null;
  confidenceScore: number;
}

export interface RevenueOptimization {
  opportunity: string;
  potentialRevenue: number;
  confidence: number;
  timeframe: string;
  priority: 'low' | 'medium' | 'high';
  implementation: string[];
  expectedImpact: {
    revenueIncrease: number;
    customerRetention: number;
    conversionRate: number;
  };
}

export interface CustomerLifetimeValue {
  customerId: string;
  email: string | undefined;
  currentLTV: number;
  predictedLTV: number;
  ltv12Month: number;
  segment: 'low' | 'medium' | 'high' | 'vip';
  factors: {
    subscriptionLength: number;
    averageMonthlySpend: number;
    engagementScore: number;
    churnRisk: number;
  };
  recommendations: string[];
}

export interface BusinessInsight {
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
  metrics: {
    current: number;
    target: number;
    improvement: number;
  };
  timeframe: string;
  createdAt: string;
}

export class AIInsightsService {
  private readonly CHURN_THRESHOLD_DAYS = 30;
  private readonly HIGH_VALUE_THRESHOLD = 100;

  /**
   * Predict customer churn using behavioral analysis
   */
  predictChurn(customers: RevenueCatCustomer[]): ChurnPrediction[] {
    console.log(`🤖 Analyzing churn risk for ${customers.length} customers...`);
    
    return customers.map(customer => {
      const churnFactors = this.analyzeChurnFactors(customer);
      const churnProbability = this.calculateChurnProbability(churnFactors);
      const riskLevel = this.determineRiskLevel(churnProbability);
      const daysUntilChurn = this.predictChurnTimeline(customer, churnProbability);
      
      return {
        customerId: customer.id,
        email: customer.attributes.email,
        churnProbability: Math.round(churnProbability * 100) / 100,
        riskLevel,
        riskFactors: churnFactors.factors,
        recommendedActions: this.generateChurnActions(riskLevel, churnFactors),
        daysUntilChurn,
        confidenceScore: churnFactors.confidence
      };
    }).sort((a, b) => b.churnProbability - a.churnProbability);
  }

  /**
   * Analyze revenue optimization opportunities
   */
  analyzeRevenueOptimization(customers: RevenueCatCustomer[]): RevenueOptimization[] {
    console.log('💰 Analyzing revenue optimization opportunities...');
    
    const opportunities: RevenueOptimization[] = [];
    
    // Upsell opportunity
    const freeUsers = customers.filter(c => this.hasFreePlan(c));
    if (freeUsers.length > 10) {
      const potentialRevenue = freeUsers.length * 0.05 * 29.99;
      opportunities.push({
        opportunity: 'Free to Paid Conversion Campaign',
        potentialRevenue,
        confidence: 0.6,
        timeframe: '1-3 months',
        priority: 'medium',
        implementation: [
          'Implement feature limitations for free users',
          'Create targeted upgrade messaging',
          'Offer time-limited upgrade discounts'
        ],
        expectedImpact: {
          revenueIncrease: potentialRevenue,
          customerRetention: 5,
          conversionRate: 5
        }
      });
    }

    // Retention opportunity
    const atRiskCustomers = this.predictChurn(customers).filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical');
    if (atRiskCustomers.length > 0) {
      const averageCustomerValue = customers.reduce((sum, c) => sum + this.calculateCurrentLTV(c), 0) / customers.length;
      const potentialRevenue = atRiskCustomers.length * averageCustomerValue * 0.3;
      
      opportunities.push({
        opportunity: 'Customer Retention Campaign',
        potentialRevenue,
        confidence: 0.8,
        timeframe: '1-2 months',
        priority: 'high',
        implementation: [
          'Deploy automated retention email sequences',
          'Implement customer success outreach',
          'Offer personalized retention incentives'
        ],
        expectedImpact: {
          revenueIncrease: potentialRevenue,
          customerRetention: 30,
          conversionRate: 0
        }
      });
    }
    
    return opportunities.sort((a, b) => b.potentialRevenue - a.potentialRevenue);
  }

  /**
   * Calculate Customer Lifetime Value with predictions
   */
  calculateCustomerLTV(customers: RevenueCatCustomer[]): CustomerLifetimeValue[] {
    console.log('📈 Calculating Customer Lifetime Value predictions...');
    
    return customers.map(customer => {
      const currentLTV = this.calculateCurrentLTV(customer);
      const predictedLTV = this.predictFutureLTV(customer);
      const ltv12Month = this.predict12MonthLTV(customer);
      const factors = this.analyzeLTVFactors(customer);
      const segment = this.segmentCustomer(predictedLTV);
      
      return {
        customerId: customer.id,
        email: customer.attributes.email,
        currentLTV: Math.round(currentLTV * 100) / 100,
        predictedLTV: Math.round(predictedLTV * 100) / 100,
        ltv12Month: Math.round(ltv12Month * 100) / 100,
        segment,
        factors,
        recommendations: this.generateLTVRecommendations(segment, factors)
      };
    }).sort((a, b) => b.predictedLTV - a.predictedLTV);
  }

  /**
   * Generate comprehensive business insights
   */
  generateBusinessInsights(customers: RevenueCatCustomer[]): BusinessInsight[] {
    console.log('🧠 Generating AI-powered business insights...');
    
    const insights: BusinessInsight[] = [];
    
    // Churn insight
    const churnPredictions = this.predictChurn(customers);
    const highRiskCustomers = churnPredictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical');
    
    if (highRiskCustomers.length > 0) {
      const averageLTV = customers.reduce((sum, c) => sum + this.calculateCurrentLTV(c), 0) / customers.length;
      const potentialLoss = highRiskCustomers.length * averageLTV;
      
      insights.push({
        id: `churn_${Date.now()}`,
        type: 'churn',
        priority: highRiskCustomers.length > customers.length * 0.1 ? 'critical' : 'high',
        title: `${highRiskCustomers.length} Customers at High Churn Risk`,
        description: `AI identified ${highRiskCustomers.length} customers with high churn probability. Immediate action could prevent $${potentialLoss.toFixed(2)} revenue loss.`,
        impact: {
          revenue: potentialLoss,
          users: highRiskCustomers.length,
          confidence: 85
        },
        recommendations: [
          'Deploy targeted retention campaigns',
          'Offer personalized incentives to high-risk customers',
          'Implement proactive customer success outreach'
        ],
        metrics: {
          current: (highRiskCustomers.length / customers.length) * 100,
          target: 5,
          improvement: ((highRiskCustomers.length / customers.length) * 100) - 5
        },
        timeframe: '1-2 weeks',
        createdAt: new Date().toISOString()
      });
    }

    // Revenue growth insight
    const freeUsers = customers.filter(c => this.hasFreePlan(c));
    if (freeUsers.length > 10) {
      const conversionOpportunity = freeUsers.length * 0.05 * 29.99;
      const totalRevenue = customers.reduce((sum, c) => sum + this.calculateCurrentLTV(c), 0);
      const averageMonthlyRevenue = totalRevenue / 12;
      
      insights.push({
        id: `revenue_${Date.now()}`,
        type: 'revenue',
        priority: 'high',
        title: `$${conversionOpportunity.toFixed(0)} Revenue Opportunity Identified`,
        description: `Converting 5% of ${freeUsers.length} free users could generate $${conversionOpportunity.toFixed(2)} monthly revenue.`,
        impact: {
          revenue: conversionOpportunity * 12,
          users: Math.round(freeUsers.length * 0.05),
          confidence: 70
        },
        recommendations: [
          'Implement freemium conversion campaigns',
          'Add usage-based upgrade prompts',
          'Offer time-limited upgrade discounts'
        ],
        metrics: {
          current: averageMonthlyRevenue,
          target: averageMonthlyRevenue + conversionOpportunity,
          improvement: (conversionOpportunity / averageMonthlyRevenue) * 100
        },
        timeframe: '2-3 months',
        createdAt: new Date().toISOString()
      });
    }
    
    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Helper methods
  private analyzeChurnFactors(customer: RevenueCatCustomer) {
    const factors: string[] = [];
    let riskScore = 0;
    
    const lastSeenDays = this.daysSince(customer.last_seen);
    const customerAge = this.daysSince(customer.first_seen);
    
    if (lastSeenDays > 14) {
      factors.push('Inactive for over 2 weeks');
      riskScore += 0.3;
    }
    if (lastSeenDays > 30) {
      factors.push('Inactive for over 1 month');
      riskScore += 0.4;
    }
    
    const activeSubscriptions = this.getActiveSubscriptions(customer);
    if (activeSubscriptions.length === 0) {
      factors.push('No active subscriptions');
      riskScore += 0.8;
    }
    
    if (customerAge < 30 && lastSeenDays > 7) {
      factors.push('New customer with low engagement');
      riskScore += 0.5;
    }
    
    return {
      riskScore: Math.min(riskScore, 1.0),
      factors,
      confidence: this.calculateConfidence(factors.length, customerAge)
    };
  }

  private calculateChurnProbability(churnFactors: any): number {
    const baseRate = 0.05;
    const riskMultiplier = 1 + (churnFactors.riskScore * 10);
    return Math.min(baseRate * riskMultiplier, 0.95);
  }

  private determineRiskLevel(probability: number): 'low' | 'medium' | 'high' | 'critical' {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.3) return 'medium';
    return 'low';
  }

  private predictChurnTimeline(customer: RevenueCatCustomer, churnProbability: number): number | null {
    if (churnProbability < 0.3) return null;
    
    const lastSeenDays = this.daysSince(customer.last_seen);
    const activeSubscriptions = this.getActiveSubscriptions(customer);
    
    if (activeSubscriptions.length === 0) return 0;
    
    const avgSubscriptionDays = this.calculateAverageSubscriptionLength(activeSubscriptions);
    const urgencyFactor = churnProbability * 2;
    
    return Math.max(1, Math.round(avgSubscriptionDays * (1 - urgencyFactor)));
  }

  private generateChurnActions(riskLevel: string, churnFactors: any): string[] {
    const actions: string[] = [];
    
    switch (riskLevel) {
      case 'critical':
        actions.push('Immediate personal outreach required');
        actions.push('Offer retention discount or upgrade incentive');
        actions.push('Schedule customer success call');
        break;
      case 'high':
        actions.push('Send targeted retention email campaign');
        actions.push('Offer feature tutorial or training');
        actions.push('Provide usage analytics and value demonstration');
        break;
      case 'medium':
        actions.push('Include in engagement campaign');
        actions.push('Send feature tips and best practices');
        actions.push('Monitor usage patterns closely');
        break;
      default:
        actions.push('Include in general newsletter');
        actions.push('Track engagement metrics');
        break;
    }
    
    return actions;
  }

  private calculateCurrentLTV(customer: RevenueCatCustomer): number {
    let totalRevenue = 0;
    const subscriptions = Object.values(customer.subscriptions || {});
    const nonSubscriptions = Object.values(customer.non_subscriptions || {}).flat();
    
    subscriptions.forEach(sub => {
      totalRevenue += this.estimateSubscriptionRevenue(sub);
    });
    
    nonSubscriptions.forEach(purchase => {
      totalRevenue += this.estimateOneTimePurchaseValue(purchase);
    });
    
    return totalRevenue;
  }

  private predictFutureLTV(customer: RevenueCatCustomer): number {
    const currentLTV = this.calculateCurrentLTV(customer);
    const customerAge = this.daysSince(customer.first_seen);
    const recentActivity = this.daysSince(customer.last_seen);
    
    let growthMultiplier = 1.0;
    
    if (recentActivity < 7) growthMultiplier += 0.5;
    if (customerAge > 365) growthMultiplier += 0.4;
    
    const activeSubscriptions = this.getActiveSubscriptions(customer);
    growthMultiplier += activeSubscriptions.length * 0.2;
    
    return currentLTV * growthMultiplier;
  }

  private predict12MonthLTV(customer: RevenueCatCustomer): number {
    const monthlyValue = this.estimateMonthlyValue(customer);
    const churnProbability = this.calculateChurnProbability(this.analyzeChurnFactors(customer));
    const retentionProbability = 1 - churnProbability;
    
    let total = 0;
    for (let month = 1; month <= 12; month++) {
      const monthlyRetention = Math.pow(retentionProbability, month);
      total += monthlyValue * monthlyRetention;
    }
    
    return total;
  }

  private analyzeLTVFactors(customer: RevenueCatCustomer) {
    const customerAge = this.daysSince(customer.first_seen);
    const monthlySpend = this.estimateMonthlyValue(customer);
    const recentActivity = this.daysSince(customer.last_seen);
    const engagementScore = Math.max(0, 100 - (recentActivity * 2));
    const churnFactors = this.analyzeChurnFactors(customer);
    
    return {
      subscriptionLength: Math.round(customerAge),
      averageMonthlySpend: Math.round(monthlySpend * 100) / 100,
      engagementScore: Math.round(engagementScore),
      churnRisk: Math.round(churnFactors.riskScore * 100)
    };
  }

  private segmentCustomer(predictedLTV: number): 'low' | 'medium' | 'high' | 'vip' {
    if (predictedLTV >= 500) return 'vip';
    if (predictedLTV >= 200) return 'high';
    if (predictedLTV >= 50) return 'medium';
    return 'low';
  }

  private generateLTVRecommendations(segment: string, factors: any): string[] {
    const recommendations: string[] = [];
    
    switch (segment) {
      case 'vip':
        recommendations.push('Assign dedicated customer success manager');
        recommendations.push('Offer exclusive features and early access');
        break;
      case 'high':
        recommendations.push('Include in high-value customer segment');
        recommendations.push('Offer premium support and priority features');
        break;
      case 'medium':
        recommendations.push('Focus on feature adoption and engagement');
        recommendations.push('Provide educational content and best practices');
        break;
      default:
        recommendations.push('Implement engagement campaigns');
        recommendations.push('Focus on onboarding and initial value delivery');
        break;
    }
    
    if (factors.engagementScore < 50) {
      recommendations.push('Implement re-engagement campaign');
    }
    
    return recommendations;
  }

  // Utility methods
  private daysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getActiveSubscriptions(customer: RevenueCatCustomer): RevenueCatSubscription[] {
    const now = new Date();
    return Object.values(customer.subscriptions || {}).filter(sub => {
      const expiresDate = sub.expires_date ? new Date(sub.expires_date) : null;
      return !expiresDate || expiresDate > now;
    });
  }

  private hasFreePlan(customer: RevenueCatCustomer): boolean {
    return this.getActiveSubscriptions(customer).length === 0;
  }

  private isChurned(customer: RevenueCatCustomer): boolean {
    const lastSeenDays = this.daysSince(customer.last_seen);
    const activeSubscriptions = this.getActiveSubscriptions(customer);
    return lastSeenDays > 60 && activeSubscriptions.length === 0;
  }

  private hasBillingIssues(customer: RevenueCatCustomer): boolean {
    return Object.values(customer.subscriptions || {}).some(sub => sub.billing_issues_detected_at);
  }

  private hasRecentDowngrade(customer: RevenueCatCustomer): boolean {
    // Simplified - would need subscription history to properly detect
    return false;
  }

  private calculateConfidence(factorCount: number, customerAge: number): number {
    let confidence = 0.5;
    confidence += Math.min(factorCount * 0.1, 0.3);
    confidence += Math.min(customerAge / 365 * 0.2, 0.2);
    return Math.min(Math.round(confidence * 100), 95);
  }

  private calculateAverageSubscriptionLength(subscriptions: RevenueCatSubscription[]): number {
    if (subscriptions.length === 0) return 30;
    
    const lengths = subscriptions.map(sub => {
      const start = new Date(sub.original_purchase_date);
      const end = sub.expires_date ? new Date(sub.expires_date) : new Date();
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    });
    
    return lengths.reduce((sum, days) => sum + days, 0) / lengths.length;
  }

  private estimateSubscriptionRevenue(subscription: RevenueCatSubscription): number {
    switch (subscription.store) {
      case 'APP_STORE':
      case 'PLAY_STORE':
        return subscription.period_type === 'TRIAL' ? 0 : 120; // Estimated annual value
      case 'STRIPE':
        return 240; // Higher value for web subscriptions
      default:
        return 60;
    }
  }

  private estimateOneTimePurchaseValue(purchase: any): number {
    return 2.99; // Default estimated value
  }

  private estimateMonthlyValue(customer: RevenueCatCustomer): number {
    return this.calculateCurrentLTV(customer) / 12;
  }
}

export default AIInsightsService;
