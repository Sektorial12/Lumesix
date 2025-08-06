/**
 * Metrics Screen
 * Detailed analytics and metrics visualization
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

// Types
interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface ChartData {
  period: string;
  value: number;
}

const MetricsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock metrics data
  const mockMetrics: MetricData[] = [
    { label: 'MRR', value: 14560, change: 12.3, trend: 'up' },
    { label: 'ARR', value: 174720, change: 15.8, trend: 'up' },
    { label: 'ARPU', value: 9.99, change: 1.5, trend: 'up' },
    { label: 'LTV', value: 89.91, change: 8.2, trend: 'up' },
    { label: 'CAC', value: 12.50, change: -5.3, trend: 'down' },
    { label: 'Churn Rate', value: 5.2, change: -0.8, trend: 'down' },
    { label: 'Retention (30d)', value: 78.5, change: 3.2, trend: 'up' },
    { label: 'Conversion Rate', value: 16.4, change: 2.1, trend: 'up' },
  ];

  // Mock chart data
  const mockChartData: ChartData[] = [
    { period: 'Week 1', value: 12500 },
    { period: 'Week 2', value: 13200 },
    { period: 'Week 3', value: 13800 },
    { period: 'Week 4', value: 14560 },
  ];

  useEffect(() => {
    loadMetrics();
  }, [selectedPeriod]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:3000/api/v1/metrics?period=${selectedPeriod}`);
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
    setRefreshing(false);
  };

  const formatValue = (metric: MetricData) => {
    if (metric.label.includes('Rate') || metric.label.includes('Retention')) {
      return `${metric.value}%`;
    }
    if (metric.label.includes('MRR') || metric.label.includes('ARR') || 
        metric.label.includes('ARPU') || metric.label.includes('LTV') || 
        metric.label.includes('CAC')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(metric.value);
    }
    return metric.value.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (change: number, isPositiveGood: boolean = true) => {
    if (change === 0) return '#8E8E93';
    const isPositive = change > 0;
    if (isPositiveGood) {
      return isPositive ? '#34C759' : '#FF3B30';
    } else {
      return isPositive ? '#FF3B30' : '#34C759';
    }
  };

  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' },
  ];

  // Simple chart component (placeholder for actual charting library)
  const SimpleChart = ({ data }: { data: ChartData[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>MRR Trend</Text>
        <View style={styles.chartBars}>
          {data.map((item, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={[
                styles.chartBarFill,
                { height: `${(item.value / maxValue) * 100}%` }
              ]} />
              <Text style={styles.chartBarLabel}>{item.period}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartValues}>
          {data.map((item, index) => (
            <Text key={index} style={styles.chartValue}>
              ${(item.value / 1000).toFixed(1)}k
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Metrics</Text>
        <Text style={styles.subtitle}>Detailed Analytics</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodTab,
              selectedPeriod === period.key && styles.periodTabActive
            ]}
            onPress={() => setSelectedPeriod(period.key as any)}>
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.periodTextActive
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Chart Section */}
        <View style={styles.section}>
          <SimpleChart data={mockChartData} />
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {mockMetrics.map((metric, index) => {
              const isChurnOrCAC = metric.label.includes('Churn') || metric.label.includes('CAC');
              return (
                <View key={index} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <Text style={styles.metricIcon}>
                      {getTrendIcon(metric.trend)}
                    </Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {formatValue(metric)}
                  </Text>
                  <Text style={[
                    styles.metricChange,
                    { color: getTrendColor(metric.change, !isChurnOrCAC) }
                  ]}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>New Subscriptions</Text>
              <Text style={styles.breakdownValue}>$3,240</Text>
              <Text style={styles.breakdownPercentage}>22.3%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Renewals</Text>
              <Text style={styles.breakdownValue}>$9,870</Text>
              <Text style={styles.breakdownPercentage}>67.8%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Upgrades</Text>
              <Text style={styles.breakdownValue}>$1,450</Text>
              <Text style={styles.breakdownPercentage}>9.9%</Text>
            </View>
          </View>
        </View>

        {/* Cohort Analysis Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cohort Retention</Text>
          <View style={styles.cohortCard}>
            <Text style={styles.cohortDescription}>
              Users acquired in the last 30 days show strong retention patterns
            </Text>
            <View style={styles.cohortMetrics}>
              <View style={styles.cohortMetric}>
                <Text style={styles.cohortMetricLabel}>Day 1</Text>
                <Text style={styles.cohortMetricValue}>92%</Text>
              </View>
              <View style={styles.cohortMetric}>
                <Text style={styles.cohortMetricLabel}>Day 7</Text>
                <Text style={styles.cohortMetricValue}>78%</Text>
              </View>
              <View style={styles.cohortMetric}>
                <Text style={styles.cohortMetricLabel}>Day 30</Text>
                <Text style={styles.cohortMetricValue}>65%</Text>
              </View>
            </View>
          </View>
        </View>

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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  periodTabActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  chartBarFill: {
    width: '80%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
    minHeight: 8,
  },
  chartBarLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
  },
  chartValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartValue: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  metricIcon: {
    fontSize: 16,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 12,
  },
  breakdownPercentage: {
    fontSize: 14,
    color: '#8E8E93',
    minWidth: 50,
    textAlign: 'right',
  },
  cohortCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cohortDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  cohortMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cohortMetric: {
    alignItems: 'center',
  },
  cohortMetricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  cohortMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
});

export default MetricsScreen;
