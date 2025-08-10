/**
 * AI Insights Routes - Machine Learning Powered Analytics Endpoints
 */

import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, AuthRequest } from '../middleware/auth';
import AIInsightsService from '../services/aiInsightsService';
import { RevenueCatService } from '../services/revenueCatService';
import User from '../models/User';

const router = Router();

// Rate limiting for AI insights - more compute intensive
const insightsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    success: false,
    message: 'Too many AI insight requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all AI insights routes
router.use(insightsRateLimit);

// Apply authentication to all routes
router.use(authenticate);

const aiInsightsService = new AIInsightsService();
// RevenueCat service will be instantiated per request with user's API key

/**
 * POST /api/ai-insights/churn-prediction
 * Predict customer churn using AI/ML algorithms
 */
router.get('/churn-prediction', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.revenueCatApiKey) {
      res.status(400).json({
        success: false,
        message: 'RevenueCat account not connected. Please connect your account first.',
      });
      return;
    }

    console.log(`🤖 Generating churn predictions for user: ${user.email}`);

    // Fetch customer data from RevenueCat
    const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
    const customersResponse = await revenueCatService.getCustomers(100);
    
    if (!customersResponse.customers || customersResponse.customers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Unable to fetch customer data for churn prediction'
      });
      return;
    }

    const customers = customersResponse.customers;
    
    // Generate churn predictions
    const churnPredictions = aiInsightsService.predictChurn(customers);

    res.json({
      success: true,
      data: {
        predictions: churnPredictions,
        summary: {
          totalCustomers: customers.length,
          highRiskCustomers: churnPredictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
          averageChurnProbability: churnPredictions.reduce((sum, p) => sum + p.churnProbability, 0) / churnPredictions.length,
          generatedAt: new Date().toISOString()
        }
      },
      message: 'Churn predictions generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating churn predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate churn predictions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-insights/revenue-optimization
 * Analyze revenue optimization opportunities
 */
router.get('/revenue-optimization', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.revenueCatApiKey) {
      res.status(400).json({
        success: false,
        message: 'RevenueCat account not connected. Please connect your account first.',
      });
      return;
    }

    console.log(`💰 Analyzing revenue optimization for user: ${user.email}`);

    const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
    const customersResponse = await revenueCatService.getCustomers(100);
    
    if (!customersResponse.customers || customersResponse.customers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Unable to fetch customer data for revenue optimization analysis'
      });
      return;
    }

    const customers = customersResponse.customers;
    
    // Analyze revenue optimization opportunities
    const opportunities = aiInsightsService.analyzeRevenueOptimization(customers);
    const totalPotential = opportunities.reduce((sum, opp) => sum + opp.potentialRevenue, 0);

    res.json({
      success: true,
      data: {
        opportunities,
        summary: {
          totalOpportunities: opportunities.length,
          totalPotentialRevenue: Math.round(totalPotential * 100) / 100,
          highPriorityOpportunities: opportunities.filter(o => o.priority === 'high').length,
          averageConfidence: opportunities.reduce((sum, o) => sum + o.confidence, 0) / opportunities.length,
          generatedAt: new Date().toISOString()
        }
      },
      message: 'Revenue optimization analysis completed successfully'
    });

  } catch (error: any) {
    console.error('Error analyzing revenue optimization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze revenue optimization opportunities',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-insights/customer-ltv
 * Calculate Customer Lifetime Value predictions
 */
router.get('/customer-ltv', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user || !user.revenueCatApiKey) {
      res.status(400).json({
        success: false,
        message: 'RevenueCat account not connected. Please connect your account first.',
      });
      return;
    }

    console.log(`📈 Calculating Customer LTV predictions for user: ${user.email}`);

    const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
    const customersResponse = await revenueCatService.getCustomers(100);
    
    if (!customersResponse.customers || customersResponse.customers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Unable to fetch customer data for LTV calculation'
      });
      return;
    }

    const customers = customersResponse.customers;
    
    // Calculate Customer Lifetime Values
    const ltvAnalysis = aiInsightsService.calculateCustomerLTV(customers);
    
    // Calculate summary statistics
    const totalCurrentLTV = ltvAnalysis.reduce((sum, ltv) => sum + ltv.currentLTV, 0);
    const totalPredictedLTV = ltvAnalysis.reduce((sum, ltv) => sum + ltv.predictedLTV, 0);
    const segmentCounts = ltvAnalysis.reduce((counts, ltv) => {
      counts[ltv.segment] = (counts[ltv.segment] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        customerLTV: ltvAnalysis,
        summary: {
          totalCustomers: customers.length,
          totalCurrentLTV: Math.round(totalCurrentLTV * 100) / 100,
          totalPredictedLTV: Math.round(totalPredictedLTV * 100) / 100,
          averageCurrentLTV: Math.round((totalCurrentLTV / customers.length) * 100) / 100,
          averagePredictedLTV: Math.round((totalPredictedLTV / customers.length) * 100) / 100,
          segmentDistribution: segmentCounts,
          generatedAt: new Date().toISOString()
        }
      },
      message: 'Customer LTV analysis completed successfully'
    });

  } catch (error: any) {
    console.error('Error calculating Customer LTV:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate Customer Lifetime Value',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-insights/business-insights
 * Generate comprehensive AI-powered business insights
 */
router.get('/business-insights', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    
    let customers: any[] = [];
    let usingDemoData = false;
    
    if (!user || !user.revenueCatApiKey) {
      console.log(`🎭 Creating demo AI insights for user without RevenueCat connection`);
      usingDemoData = true;
    } else {
      console.log(`🧐 Generating business insights for user: ${user.email}`);
      
      try {
        const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
        const customersResponse = await revenueCatService.getCustomers(100);
        
        if (customersResponse.customers && customersResponse.customers.length > 0) {
          customers = customersResponse.customers;
        } else {
          console.log(`🎭 No customer data available, using demo insights`);
          usingDemoData = true;
        }
      } catch (error) {
        console.log(`🎭 RevenueCat error, falling back to demo insights:`, error);
        usingDemoData = true;
      }
    }
    
    // Generate demo insights when real data isn't available
    if (usingDemoData) {
      const demoInsights = [
        {
          id: 'demo-churn-1',
          type: 'churn_prevention',
          priority: 'high',
          title: 'High Churn Risk Detected',
          description: '23% of your premium subscribers show early churn signals based on usage patterns and billing history.',
          impact: {
            confidence: 87,
            revenue: 2850,
            users: 45
          },
          actionItems: [
            'Send targeted retention email campaign to at-risk users',
            'Offer 15% discount for next billing cycle',
            'Implement usage reminder notifications'
          ],
          timeframe: '7-14 days',
          category: 'retention'
        },
        {
          id: 'demo-revenue-1',
          type: 'revenue_optimization',
          priority: 'high',
          title: 'Pricing Tier Optimization',
          description: 'Analysis shows 34% of basic plan users exceed usage limits regularly, indicating upsell opportunity.',
          impact: {
            confidence: 92,
            revenue: 1650,
            users: 28
          },
          actionItems: [
            'Create targeted upsell campaign for high-usage basic users',
            'Add usage analytics dashboard to encourage upgrades',
            'Implement usage-based upgrade prompts'
          ],
          timeframe: '30 days',
          category: 'growth'
        },
        {
          id: 'demo-cohort-1',
          type: 'cohort_analysis',
          priority: 'medium',
          title: 'Seasonal Retention Pattern',
          description: 'Users acquired in Q4 show 15% higher retention rates, suggesting optimal acquisition timing.',
          impact: {
            confidence: 78,
            revenue: 980,
            users: 62
          },
          actionItems: [
            'Increase marketing spend during Q4 acquisition window',
            'Analyze Q4 onboarding differences for optimization',
            'Create seasonal engagement campaigns'
          ],
          timeframe: '90 days',
          category: 'strategy'
        }
      ];
      
      const summary = {
        totalInsights: demoInsights.length,
        criticalInsights: 0,
        highPriorityInsights: 2,
        totalPotentialRevenue: 5480,
        averageConfidence: 85.7,
        generatedAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: {
          insights: demoInsights,
          summary,
          demo: true,
          message: 'Demo insights - Connect your RevenueCat account for personalized analytics'
        },
        message: 'Demo business insights generated successfully'
      });
      return;
    }
    
    // Generate comprehensive business insights
    const insights = aiInsightsService.generateBusinessInsights(customers);
    
    const insightsByPriority = insights.reduce((groups, insight) => {
      groups[insight.priority] = (groups[insight.priority] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);

    const totalPotentialRevenue = insights.reduce((sum, insight) => sum + insight.impact.revenue, 0);

    res.json({
      success: true,
      data: {
        insights,
        summary: {
          totalInsights: insights.length,
          criticalInsights: insightsByPriority.critical || 0,
          highPriorityInsights: insightsByPriority.high || 0,
          totalPotentialRevenue: Math.round(totalPotentialRevenue * 100) / 100,
          averageConfidence: insights.reduce((sum, i) => sum + i.impact.confidence, 0) / insights.length,
          generatedAt: new Date().toISOString()
        }
      },
      message: 'Business insights generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating business insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate business insights',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-insights/dashboard
 * Get comprehensive AI insights dashboard data
 */
router.get('/dashboard', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    
    let customers: any[] = [];
    let usingDemoData = false;
    
    if (!user || !user.revenueCatApiKey) {
      console.log(`🎭 Creating demo AI dashboard for user without RevenueCat connection`);
      usingDemoData = true;
    } else {
      console.log(`📊 Generating AI insights dashboard for user: ${user.email}`);
      
      try {
        const revenueCatService = new RevenueCatService(user.revenueCatApiKey);
        const customersResponse = await revenueCatService.getCustomers(100);
        
        if (customersResponse.customers && customersResponse.customers.length > 0) {
          customers = customersResponse.customers;
        } else {
          console.log(`🎭 No customer data available, using demo dashboard`);
          usingDemoData = true;
        }
      } catch (error) {
        console.log(`🎭 RevenueCat error, falling back to demo dashboard:`, error);
        usingDemoData = true;
      }
    }
    
    // Generate demo dashboard when real data isn't available
    if (usingDemoData) {
      const demoDashboard = {
        summary: {
          totalCustomers: 247,
          highRiskChurn: 23,
          revenueOpportunity: 8750,
          averageLTV: 145.50,
          criticalInsights: 2,
          lastUpdated: new Date().toISOString()
        },
        churnPredictions: [
          {
            customerId: 'demo-customer-1',
            riskLevel: 'high',
            churnProbability: 0.78,
            daysToChurn: 14,
            recommendedActions: ['Send retention email', 'Offer discount']
          },
          {
            customerId: 'demo-customer-2', 
            riskLevel: 'medium',
            churnProbability: 0.45,
            daysToChurn: 28,
            recommendedActions: ['Engagement campaign', 'Feature education']
          }
        ],
        revenueOpportunities: [
          {
            type: 'upsell',
            description: 'Basic to Premium upgrade opportunity',
            potentialRevenue: 2400,
            affectedCustomers: 28,
            confidence: 0.87
          },
          {
            type: 'retention',
            description: 'Win-back campaign for churned users',
            potentialRevenue: 1650,
            affectedCustomers: 15,
            confidence: 0.72
          }
        ],
        ltvAnalysis: {
          segments: [
            { segment: 'Premium', avgLTV: 245.80, count: 67 },
            { segment: 'Basic', avgLTV: 89.20, count: 134 },
            { segment: 'Trial', avgLTV: 12.50, count: 46 }
          ],
          trends: {
            growth: '+12.5%',
            retention: '85.3%'
          }
        }
      };
      
      res.json({
        success: true,
        data: demoDashboard,
        demo: true,
        message: 'Demo AI insights dashboard - Connect RevenueCat for personalized data'
      });
      return;
    }
    
    // Generate all AI insights for dashboard
    const [churnPredictions, revenueOpportunities, ltvAnalysis, businessInsights] = await Promise.all([
      Promise.resolve(aiInsightsService.predictChurn(customers)),
      Promise.resolve(aiInsightsService.analyzeRevenueOptimization(customers)),
      Promise.resolve(aiInsightsService.calculateCustomerLTV(customers)),
      Promise.resolve(aiInsightsService.generateBusinessInsights(customers))
    ]);

    // Compile dashboard summary
    const highRiskChurn = churnPredictions.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical');
    const totalRevenueOpportunity = revenueOpportunities.reduce((sum, opp) => sum + opp.potentialRevenue, 0);
    const averageLTV = ltvAnalysis.reduce((sum, ltv) => sum + ltv.predictedLTV, 0) / ltvAnalysis.length;
    const criticalInsights = businessInsights.filter(i => i.priority === 'critical');

    res.json({
      success: true,
      data: {
        summary: {
          totalCustomers: customers.length,
          highRiskChurnCustomers: highRiskChurn.length,
          totalRevenueOpportunity: Math.round(totalRevenueOpportunity * 100) / 100,
          averageCustomerLTV: Math.round(averageLTV * 100) / 100,
          criticalInsightsCount: criticalInsights.length,
          generatedAt: new Date().toISOString()
        },
        churnRisk: {
          totalPredictions: churnPredictions.length,
          highRisk: highRiskChurn.length,
          topRiskyCustomers: churnPredictions.slice(0, 5)
        },
        revenueOptimization: {
          totalOpportunities: revenueOpportunities.length,
          totalPotential: Math.round(totalRevenueOpportunity * 100) / 100,
          topOpportunities: revenueOpportunities.slice(0, 3)
        },
        customerLTV: {
          averageLTV: Math.round(averageLTV * 100) / 100,
          topCustomers: ltvAnalysis.slice(0, 5),
          segmentDistribution: ltvAnalysis.reduce((counts, ltv) => {
            counts[ltv.segment] = (counts[ltv.segment] || 0) + 1;
            return counts;
          }, {} as Record<string, number>)
        },
        insights: {
          total: businessInsights.length,
          critical: criticalInsights,
          recent: businessInsights.slice(0, 3)
        }
      },
      message: 'AI insights dashboard generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating AI insights dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI insights dashboard',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
