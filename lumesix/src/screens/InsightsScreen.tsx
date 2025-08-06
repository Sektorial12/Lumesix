/**
 * AI Insights Screen
 * Displays AI-powered insights and recommendations
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Types
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

const InsightsScreen: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock insights data
  const mockInsights: Insight[] = [
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
    {
      id: '4',
      type: 'seasonal',
      title: 'Holiday Season Trend',
      description: 'Subscription upgrades typically increase by 65% during December',
      confidence: 0.88,
      impact: 'medium',
      actionable: true,
      recommendation: 'Prepare holiday promotion campaign for premium upgrades',
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/v1/insights');
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
      Alert.alert('Error', 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'churn': return '⚠️';
      case 'price': return '💰';
      case 'cohort': return '👥';
      case 'seasonal': return '📈';
      default: return '🤖';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#34C759';
    if (confidence >= 0.6) return '#FF9500';
    return '#FF3B30';
  };

  const filteredInsights = selectedFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedFilter);

  const filters = [
    { key: 'all', label: 'All Insights' },
    { key: 'churn', label: 'Churn' },
    { key: 'price', label: 'Pricing' },
    { key: 'cohort', label: 'Cohorts' },
    { key: 'seasonal', label: 'Seasonal' },
  ];

  if (loading && insights.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating AI insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>Powered by machine learning</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}>
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredInsights.length > 0 ? (
          <View style={styles.insightsContainer}>
            {filteredInsights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <View style={styles.insightTitleRow}>
                    <Text style={styles.insightIcon}>
                      {getInsightIcon(insight.type)}
                    </Text>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                  </View>
                  <View style={styles.insightMeta}>
                    <View style={[
                      styles.impactBadge,
                      { backgroundColor: getImpactColor(insight.impact) }
                    ]}>
                      <Text style={styles.impactText}>
                        {insight.impact.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>

                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confidence:</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[
                      styles.confidenceFill,
                      { 
                        width: `${insight.confidence * 100}%`,
                        backgroundColor: getConfidenceColor(insight.confidence)
                      }
                    ]} />
                  </View>
                  <Text style={[
                    styles.confidenceText,
                    { color: getConfidenceColor(insight.confidence) }
                  ]}>
                    {Math.round(insight.confidence * 100)}%
                  </Text>
                </View>

                {insight.recommendation && (
                  <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationLabel}>💡 Recommendation:</Text>
                    <Text style={styles.recommendationText}>
                      {insight.recommendation}
                    </Text>
                  </View>
                )}

                <Text style={styles.insightTimestamp}>
                  Generated {new Date(insight.createdAt).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No insights available</Text>
            <Text style={styles.emptySubtext}>
              AI insights will appear here as your data grows
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  insightsContainer: {
    padding: 16,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  insightMeta: {
    alignItems: 'flex-end',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  insightDescription: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  recommendationContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  insightTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default InsightsScreen;
