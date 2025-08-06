/**
 * Dashboard Screen
 * Main analytics overview screen
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Types
interface DashboardData {
  mrr: number;
  activeSubscribers: number;
  churnRate: number;
  conversionRate: number;
  lastUpdated: string;
}

const DashboardScreen: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for development
  const mockData: DashboardData = {
    mrr: 14560,
    activeSubscribers: 1456,
    churnRate: 0.05,
    conversionRate: 0.16,
    lastUpdated: new Date().toISOString(),
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/v1/analytics');
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Revenue & Subscription Analytics</Text>
        </View>

        {data && (
          <>
            {/* Key Metrics Cards */}
            <View style={styles.metricsContainer}>
              <View style={[styles.metricCard, styles.primaryCard]}>
                <Text style={styles.metricLabel}>Monthly Recurring Revenue</Text>
                <Text style={styles.metricValue}>{formatCurrency(data.mrr)}</Text>
                <Text style={styles.metricChange}>+12.3% from last month</Text>
              </View>

              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, styles.secondaryCard]}>
                  <Text style={styles.metricLabel}>Active Subscribers</Text>
                  <Text style={styles.metricValueSecondary}>
                    {data.activeSubscribers.toLocaleString()}
                  </Text>
                  <Text style={styles.metricChangePositive}>+5.2%</Text>
                </View>

                <View style={[styles.metricCard, styles.secondaryCard]}>
                  <Text style={styles.metricLabel}>Churn Rate</Text>
                  <Text style={styles.metricValueSecondary}>
                    {formatPercentage(data.churnRate)}
                  </Text>
                  <Text style={styles.metricChangeNegative}>-0.8%</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, styles.secondaryCard]}>
                  <Text style={styles.metricLabel}>Conversion Rate</Text>
                  <Text style={styles.metricValueSecondary}>
                    {formatPercentage(data.conversionRate)}
                  </Text>
                  <Text style={styles.metricChangePositive}>+2.1%</Text>
                </View>

                <View style={[styles.metricCard, styles.secondaryCard]}>
                  <Text style={styles.metricLabel}>ARPU</Text>
                  <Text style={styles.metricValueSecondary}>$9.99</Text>
                  <Text style={styles.metricChangePositive}>+1.5%</Text>
                </View>
              </View>
            </View>

            {/* Quick Insights */}
            <View style={styles.insightsContainer}>
              <Text style={styles.sectionTitle}>Quick Insights</Text>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🎯 Churn Risk Alert</Text>
                <Text style={styles.insightDescription}>
                  23 subscribers at high risk of churning in the next 7 days
                </Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>💰 Revenue Opportunity</Text>
                <Text style={styles.insightDescription}>
                  Price optimization could increase MRR by 15%
                </Text>
              </View>
            </View>

            {/* Last Updated */}
            <View style={styles.footer}>
              <Text style={styles.lastUpdated}>
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </Text>
            </View>
          </>
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
  metricsContainer: {
    padding: 16,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#007AFF',
  },
  secondaryCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  metricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metricValueSecondary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  metricChangePositive: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  metricChangeNegative: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  insightsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default DashboardScreen;
