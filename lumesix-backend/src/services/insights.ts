/**
 * AI Insights Engine for Lumesix
 * Generates actionable insights from subscription data
 */

interface SubscriptionData {
  id: string;
  userId: string;
  status: 'active' | 'expired' | 'cancelled' | 'billing_retry';
  revenue: number;
  purchaseDate: Date;
  expirationDate: Date;
  productId: string;
  platform: 'ios' | 'android' | 'web';
}

interface Insight {
  id: string;
  type: 'churn_prediction' | 'price_optimization' | 'cohort_analysis' | 'seasonal_pattern';
  title: string;
  description: string;
  confidenceScore: number; // 0.0 to 1.0
  impactScore: 'low' | 'medium' | 'high';
  recommendedAction: string;
  supportingData: any;
  createdAt: Date;
  expiresAt: Date;
}

interface ChurnPrediction {
  subscriberId: string;
  churnProbability: number;
  riskFactors: string[];
  daysUntilChurn: number;
  recommendedActions: string[];
}

interface PriceOptimization {
  currentPrice: number;
  recommendedPrice: number;
  expectedImpact: {
    conversionIncrease: number;
    revenueChange: number;
  };
  confidence: number;
}

export class InsightsEngine {
  /**
   * Generate churn prediction insights
   */
  async generateChurnPredictions(subscriptions: SubscriptionData[]): Promise<Insight[]> {
    const insights: Insight[] = [];
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

    for (const subscription of activeSubscriptions) {
      const churnRisk = this.calculateChurnRisk(subscription, subscriptions);
      
      if (churnRisk.churnProbability > 0.7) {
        insights.push({
          id: `churn_${subscription.id}`,
          type: 'churn_prediction',
          title: `High Churn Risk Detected`,
          description: `Subscriber has ${Math.round(churnRisk.churnProbability * 100)}% probability of churning in the next ${churnRisk.daysUntilChurn} days`,
          confidenceScore: churnRisk.churnProbability,
          impactScore: this.getImpactScore(subscription.revenue),
          recommendedAction: churnRisk.recommendedActions.join('; '),
          supportingData: {
            subscriberId: subscription.id,
            riskFactors: churnRisk.riskFactors,
            revenue: subscription.revenue
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      }
    }

    return insights;
  }

  /**
   * Generate price optimization insights
   */
  async generatePriceOptimizations(subscriptions: SubscriptionData[]): Promise<Insight[]> {
    const insights: Insight[] = [];
    const productGroups = this.groupByProduct(subscriptions);

    for (const [productId, productSubs] of Object.entries(productGroups)) {
      const optimization = this.calculatePriceOptimization(productSubs);
      
      if (optimization.confidence > 0.6 && Math.abs(optimization.expectedImpact.revenueChange) > 0.1) {
        const action = optimization.recommendedPrice > optimization.currentPrice ? 'increase' : 'decrease';
        
        insights.push({
          id: `price_${productId}`,
          type: 'price_optimization',
          title: `Price Optimization Opportunity`,
          description: `Consider ${action}ing price from $${optimization.currentPrice} to $${optimization.recommendedPrice}`,
          confidenceScore: optimization.confidence,
          impactScore: this.getRevenueImpactScore(optimization.expectedImpact.revenueChange),
          recommendedAction: `Test price change to $${optimization.recommendedPrice} - expected ${optimization.expectedImpact.revenueChange > 0 ? '+' : ''}${Math.round(optimization.expectedImpact.revenueChange * 100)}% revenue change`,
          supportingData: {
            productId,
            currentPrice: optimization.currentPrice,
            recommendedPrice: optimization.recommendedPrice,
            expectedImpact: optimization.expectedImpact,
            subscriberCount: productSubs.length
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
      }
    }

    return insights;
  }

  /**
   * Generate cohort analysis insights
   */
  async generateCohortInsights(subscriptions: SubscriptionData[]): Promise<Insight[]> {
    const insights: Insight[] = [];
    const cohorts = this.analyzeCohorts(subscriptions);

    // Find best and worst performing cohorts
    const sortedCohorts = Object.entries(cohorts).sort((a, b) => b[1].retentionRate - a[1].retentionRate);
    
    if (sortedCohorts.length >= 2) {
      const bestCohort = sortedCohorts[0];
      const worstCohort = sortedCohorts[sortedCohorts.length - 1];
      
      if (bestCohort && worstCohort && bestCohort[1] && worstCohort[1]) {
        insights.push({
          id: `cohort_analysis_${Date.now()}`,
          type: 'cohort_analysis',
          title: `Cohort Performance Variation Detected`,
          description: `${bestCohort[0]} cohort has ${Math.round((bestCohort[1].retentionRate - worstCohort[1].retentionRate) * 100)}% better retention than ${worstCohort[0]}`,
          confidenceScore: 0.85,
          impactScore: 'high',
          recommendedAction: `Analyze what made ${bestCohort[0]} successful and apply those strategies to new user acquisition`,
          supportingData: {
            bestCohort: bestCohort[1],
            worstCohort: worstCohort[1],
            allCohorts: cohorts
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
        });
      }
    }

    return insights;
  }

  /**
   * Generate seasonal pattern insights
   */
  async generateSeasonalInsights(subscriptions: SubscriptionData[]): Promise<Insight[]> {
    const insights: Insight[] = [];
    const monthlyData = this.analyzeSeasonalPatterns(subscriptions);

    // Find seasonal trends
    const highestMonth = Object.entries(monthlyData).reduce((a, b) => 
      a[1].revenue > b[1].revenue ? a : b
    );
    const lowestMonth = Object.entries(monthlyData).reduce((a, b) => 
      a[1].revenue < b[1].revenue ? a : b
    );

    const seasonalVariation = (highestMonth[1].revenue - lowestMonth[1].revenue) / lowestMonth[1].revenue;

    if (seasonalVariation > 0.2) { // 20% variation
      insights.push({
        id: `seasonal_${Date.now()}`,
        type: 'seasonal_pattern',
        title: `Seasonal Revenue Pattern Detected`,
        description: `Revenue peaks in ${highestMonth[0]} (${Math.round(seasonalVariation * 100)}% higher than ${lowestMonth[0]})`,
        confidenceScore: 0.75,
        impactScore: 'medium',
        recommendedAction: `Plan marketing campaigns and pricing strategies around seasonal trends`,
        supportingData: {
          monthlyData,
          peakMonth: highestMonth[0],
          lowMonth: lowestMonth[0],
          variation: seasonalVariation
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      });
    }

    return insights;
  }

  /**
   * Calculate churn risk for a subscription
   */
  private calculateChurnRisk(subscription: SubscriptionData, allSubscriptions: SubscriptionData[]): ChurnPrediction {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Days since last purchase
    const daysSinceLastPurchase = (Date.now() - subscription.purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastPurchase > 30) {
      riskFactors.push('Long time since last purchase');
      riskScore += 0.3;
    }

    // Days until expiration
    const daysUntilExpiration = (subscription.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiration < 7) {
      riskFactors.push('Expiring soon');
      riskScore += 0.4;
    }

    // Low revenue subscriber
    const avgRevenue = allSubscriptions.reduce((sum, s) => sum + s.revenue, 0) / allSubscriptions.length;
    if (subscription.revenue < avgRevenue * 0.5) {
      riskFactors.push('Below average revenue');
      riskScore += 0.2;
    }

    // Platform risk (example: Android users churn more)
    if (subscription.platform === 'android') {
      riskFactors.push('Platform risk factor');
      riskScore += 0.1;
    }

    const recommendedActions = [];
    if (riskScore > 0.5) {
      recommendedActions.push('Send retention offer');
      recommendedActions.push('Engage with personalized content');
    }
    if (daysUntilExpiration < 7) {
      recommendedActions.push('Send renewal reminder');
    }

    return {
      subscriberId: subscription.id,
      churnProbability: Math.min(riskScore, 1.0),
      riskFactors,
      daysUntilChurn: Math.max(daysUntilExpiration, 1),
      recommendedActions
    };
  }

  /**
   * Calculate price optimization for a product
   */
  private calculatePriceOptimization(subscriptions: SubscriptionData[]): PriceOptimization {
    const currentPrice = subscriptions[0]?.revenue || 9.99;
    const conversionRate = 0.12; // Mock conversion rate
    
    // Simple optimization logic (in real app, this would be more sophisticated)
    const priceElasticity = -1.2; // Price elasticity of demand
    const optimalPriceMultiplier = 1 + (priceElasticity * 0.1);
    const recommendedPrice = Math.round(currentPrice * optimalPriceMultiplier * 100) / 100;
    
    const expectedConversionChange = (recommendedPrice - currentPrice) / currentPrice * priceElasticity;
    const expectedRevenueChange = (1 + expectedConversionChange) * (recommendedPrice / currentPrice) - 1;

    return {
      currentPrice,
      recommendedPrice,
      expectedImpact: {
        conversionIncrease: expectedConversionChange,
        revenueChange: expectedRevenueChange
      },
      confidence: 0.7
    };
  }

  /**
   * Group subscriptions by product
   */
  private groupByProduct(subscriptions: SubscriptionData[]): Record<string, SubscriptionData[]> {
    return subscriptions.reduce((groups, subscription) => {
      const product = subscription.productId;
      if (!groups[product]) {
        groups[product] = [];
      }
      groups[product].push(subscription);
      return groups;
    }, {} as Record<string, SubscriptionData[]>);
  }

  /**
   * Analyze cohorts by acquisition month
   */
  private analyzeCohorts(subscriptions: SubscriptionData[]): Record<string, any> {
    const cohorts: Record<string, any> = {};
    
    subscriptions.forEach(sub => {
      const cohortMonth = sub.purchaseDate.toISOString().slice(0, 7); // YYYY-MM
      
      if (!cohorts[cohortMonth]) {
        cohorts[cohortMonth] = {
          totalSubscribers: 0,
          activeSubscribers: 0,
          totalRevenue: 0,
          retentionRate: 0
        };
      }
      
      cohorts[cohortMonth].totalSubscribers++;
      cohorts[cohortMonth].totalRevenue += sub.revenue;
      
      if (sub.status === 'active') {
        cohorts[cohortMonth].activeSubscribers++;
      }
    });

    // Calculate retention rates
    Object.keys(cohorts).forEach(month => {
      cohorts[month].retentionRate = cohorts[month].activeSubscribers / cohorts[month].totalSubscribers;
    });

    return cohorts;
  }

  /**
   * Analyze seasonal patterns
   */
  private analyzeSeasonalPatterns(subscriptions: SubscriptionData[]): Record<string, any> {
    const monthlyData: Record<string, any> = {};
    
    subscriptions.forEach(sub => {
      const month = sub.purchaseDate.toLocaleString('default', { month: 'long' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          revenue: 0,
          subscriptions: 0
        };
      }
      
      monthlyData[month].revenue += sub.revenue;
      monthlyData[month].subscriptions++;
    });

    return monthlyData;
  }

  /**
   * Get impact score based on revenue
   */
  private getImpactScore(revenue: number): 'low' | 'medium' | 'high' {
    if (revenue > 50) return 'high';
    if (revenue > 20) return 'medium';
    return 'low';
  }

  /**
   * Get revenue impact score
   */
  private getRevenueImpactScore(change: number): 'low' | 'medium' | 'high' {
    const absChange = Math.abs(change);
    if (absChange > 0.2) return 'high';
    if (absChange > 0.1) return 'medium';
    return 'low';
  }
}

// Export singleton instance
export const insightsEngine = new InsightsEngine();
