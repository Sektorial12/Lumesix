/**
 * Lumesix - Working Navigation Version
 * Simplified navigation that works without gesture handler
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';

// Simple tab navigation component
const TabButton = ({title, isActive, onPress}: {title: string; isActive: boolean; onPress: () => void}) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}>
    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Dashboard Screen Component
const DashboardScreen = ({onNavigateToInsights}: {onNavigateToInsights: () => void}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ScrollView 
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Dashboard</Text>
        <Text style={styles.screenSubtitle}>Revenue & Subscription Analytics</Text>
      </View>

      <View style={styles.metricsContainer}>
        <TouchableOpacity 
          style={[styles.metricCard, styles.primaryCard]}
          onPress={() => Alert.alert('MRR Details', '$14,560 (+12.3% from last month)')}>
          <Text style={styles.metricLabel}>Monthly Recurring Revenue</Text>
          <Text style={styles.metricValue}>$14,560</Text>
          <Text style={styles.metricChange}>+12.3% from last month</Text>
        </TouchableOpacity>

        <View style={styles.metricsRow}>
          <TouchableOpacity 
            style={[styles.metricCard, styles.secondaryCard]}
            onPress={() => Alert.alert('Subscribers', '1,456 active (+5.2% growth)')}>
            <Text style={styles.metricLabelSecondary}>Active Subscribers</Text>
            <Text style={styles.metricValueSecondary}>1,456</Text>
            <Text style={styles.metricChangePositive}>+5.2%</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.metricCard, styles.secondaryCard]}
            onPress={() => Alert.alert('Churn Rate', '5.2% (improved by 0.8%)')}>
            <Text style={styles.metricLabelSecondary}>Churn Rate</Text>
            <Text style={styles.metricValueSecondary}>5.2%</Text>
            <Text style={styles.metricChangeNegative}>-0.8%</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Quick Insights</Text>
        <TouchableOpacity style={styles.insightCard} onPress={onNavigateToInsights}>
          <Text style={styles.insightTitle}>🎯 Churn Risk Alert</Text>
          <Text style={styles.insightDescription}>
            23 subscribers at high risk of churning in the next 7 days
          </Text>
          <Text style={styles.tapHint}>Tap to view details →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.insightCard} onPress={onNavigateToInsights}>
          <Text style={styles.insightTitle}>💰 Revenue Opportunity</Text>
          <Text style={styles.insightDescription}>
            Price optimization could increase MRR by 15%
          </Text>
          <Text style={styles.tapHint}>Tap to view details →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </View>
    </ScrollView>
  );
};

// AI Insights Screen Component
const InsightsScreen = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState<{[key: string]: boolean}>({});

  const toggleRecommendation = (insightId: string) => {
    setShowRecommendation(prev => ({
      ...prev,
      [insightId]: !prev[insightId]
    }));
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>AI Insights</Text>
        <Text style={styles.screenSubtitle}>Powered by machine learning</Text>
      </View>

      <View style={styles.insightsContainer}>
        <TouchableOpacity 
          style={[styles.insightCard, selectedInsight === 'churn' && styles.selectedCard]}
          onPress={() => setSelectedInsight(selectedInsight === 'churn' ? null : 'churn')}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>⚠️</Text>
            <Text style={styles.insightTitle}>High Churn Risk Detected</Text>
            <View style={[styles.impactBadge, {backgroundColor: '#FF3B30'}]}>
              <Text style={styles.impactText}>HIGH</Text>
            </View>
          </View>
          <Text style={styles.insightDescription}>
            23 subscribers show patterns indicating 85% churn probability in the next 7 days
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, {width: '85%', backgroundColor: '#34C759'}]} />
            </View>
            <Text style={styles.confidenceText}>85%</Text>
          </View>
          {selectedInsight === 'churn' && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedTitle}>📊 Detailed Analysis:</Text>
              <Text style={styles.expandedText}>• 15 users haven't opened app in 7+ days</Text>
              <Text style={styles.expandedText}>• 8 users reduced usage by 60%</Text>
              <Text style={styles.expandedText}>• Peak risk period: Next 3-7 days</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleRecommendation('churn')}>
                <Text style={styles.actionButtonText}>
                  {showRecommendation.churn ? 'Hide' : 'Show'} Recommendation
                </Text>
              </TouchableOpacity>
              {showRecommendation.churn && (
                <View style={styles.recommendationBox}>
                  <Text style={styles.recommendationTitle}>💡 Recommended Action:</Text>
                  <Text style={styles.recommendationText}>
                    Send targeted retention campaign with 20% discount offer to at-risk users
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.insightCard, selectedInsight === 'price' && styles.selectedCard]}
          onPress={() => setSelectedInsight(selectedInsight === 'price' ? null : 'price')}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>💰</Text>
            <Text style={styles.insightTitle}>Price Optimization</Text>
            <View style={[styles.impactBadge, {backgroundColor: '#FF3B30'}]}>
              <Text style={styles.impactText}>HIGH</Text>
            </View>
          </View>
          <Text style={styles.insightDescription}>
            Premium tier could be increased by $2.99 with minimal impact on conversions
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, {width: '78%', backgroundColor: '#FF9500'}]} />
            </View>
            <Text style={styles.confidenceText}>78%</Text>
          </View>
          {selectedInsight === 'price' && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedTitle}>📈 Revenue Impact:</Text>
              <Text style={styles.expandedText}>• Potential MRR increase: +$2,184/month</Text>
              <Text style={styles.expandedText}>• Estimated churn impact: &lt;2%</Text>
              <Text style={styles.expandedText}>• ROI timeline: 30-45 days</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleRecommendation('price')}>
                <Text style={styles.actionButtonText}>
                  {showRecommendation.price ? 'Hide' : 'Show'} Recommendation
                </Text>
              </TouchableOpacity>
              {showRecommendation.price && (
                <View style={styles.recommendationBox}>
                  <Text style={styles.recommendationTitle}>💡 Recommended Action:</Text>
                  <Text style={styles.recommendationText}>
                    A/B test price increase for new subscribers starting next month
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Metrics Screen Component
const MetricsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const periods = ['7d', '30d', '90d', '12m'] as const;
  const periodLabels: Record<string, string> = {'7d': '7 Days', '30d': '30 Days', '90d': '90 Days', '12m': '12 Months'};

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Metrics</Text>
        <Text style={styles.screenSubtitle}>Detailed Analytics</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
              {periodLabels[period]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricsGrid}>
          <TouchableOpacity 
            style={[styles.metricCard, selectedMetric === 'MRR' && styles.selectedCard]}
            onPress={() => {
              setSelectedMetric(selectedMetric === 'MRR' ? null : 'MRR');
              Alert.alert('Monthly Recurring Revenue', `$14,560 for ${periodLabels[selectedPeriod]}\n\n• Baseline: $12,960\n• Growth: +$1,600 (+12.3%)\n• Target: $16,000`);
            }}>
            <Text style={styles.metricLabelSecondary}>MRR</Text>
            <Text style={styles.metricValueSecondary}>$14,560</Text>
            <Text style={styles.metricChangePositive}>+12.3%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricCard, selectedMetric === 'ARR' && styles.selectedCard]}
            onPress={() => {
              setSelectedMetric(selectedMetric === 'ARR' ? null : 'ARR');
              Alert.alert('Annual Recurring Revenue', `$174,720 for ${periodLabels[selectedPeriod]}\n\n• Monthly x 12: $14,560 x 12\n• Growth: +15.8% YoY\n• Projection: $200k by Q4`);
            }}>
            <Text style={styles.metricLabelSecondary}>ARR</Text>
            <Text style={styles.metricValueSecondary}>$174,720</Text>
            <Text style={styles.metricChangePositive}>+15.8%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricCard, selectedMetric === 'ARPU' && styles.selectedCard]}
            onPress={() => {
              setSelectedMetric(selectedMetric === 'ARPU' ? null : 'ARPU');
              Alert.alert('Average Revenue Per User', `$9.99 for ${periodLabels[selectedPeriod]}\n\n• Previous: $9.84\n• Increase: +$0.15 (+1.5%)\n• Tier Mix: 70% Premium, 30% Basic`);
            }}>
            <Text style={styles.metricLabelSecondary}>ARPU</Text>
            <Text style={styles.metricValueSecondary}>$9.99</Text>
            <Text style={styles.metricChangePositive}>+1.5%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.metricCard, selectedMetric === 'Churn' && styles.selectedCard]}
            onPress={() => {
              setSelectedMetric(selectedMetric === 'Churn' ? null : 'Churn');
              Alert.alert('Churn Rate', `5.2% for ${periodLabels[selectedPeriod]}\n\n• Previous: 6.0%\n• Improvement: -0.8%\n• Lost: 76 subscribers\n• At Risk: 23 subscribers`);
            }}>
            <Text style={styles.metricLabelSecondary}>Churn Rate</Text>
            <Text style={styles.metricValueSecondary}>5.2%</Text>
            <Text style={styles.metricChangeNegative}>-0.8%</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chart Placeholder */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Trend - {periodLabels[selectedPeriod]}</Text>
          <TouchableOpacity 
            style={styles.chartPlaceholder}
            onPress={() => Alert.alert('Chart View', `Showing ${selectedPeriod} revenue trend\n\nFeatures coming soon:\n• Interactive charts\n• Export data\n• Custom date ranges`)}>
            <Text style={styles.chartText}>📈</Text>
            <Text style={styles.chartSubtext}>Tap for detailed chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Settings Screen Component
const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('5min');

  const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  const refreshIntervals: Record<string, string> = {'5min': '5 minutes', '10min': '10 minutes', '30min': '30 minutes', '1h': '1 hour'};

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Settings</Text>
        <Text style={styles.screenSubtitle}>Customize your experience</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Notifications Toggle */}
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => {
            setNotificationsEnabled(!notificationsEnabled);
            Alert.alert('Notifications', `Push notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
          }}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>🔔 Notifications</Text>
              <Text style={styles.settingDescription}>Push notifications {notificationsEnabled ? 'enabled' : 'disabled'}</Text>
            </View>
            <View style={[styles.toggle, notificationsEnabled && styles.toggleActive]}>
              <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => {
            setDarkModeEnabled(!darkModeEnabled);
            Alert.alert('Dark Mode', `Dark mode ${!darkModeEnabled ? 'enabled' : 'disabled'}\n\nNote: Full dark mode coming in next update!`);
          }}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>🌙 Dark Mode</Text>
              <Text style={styles.settingDescription}>Currently {darkModeEnabled ? 'enabled' : 'disabled'}</Text>
            </View>
            <View style={[styles.toggle, darkModeEnabled && styles.toggleActive]}>
              <View style={[styles.toggleThumb, darkModeEnabled && styles.toggleThumbActive]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Currency Selector */}
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => {
            const currentIndex = currencies.indexOf(selectedCurrency);
            const nextIndex = (currentIndex + 1) % currencies.length;
            const newCurrency = currencies[nextIndex];
            setSelectedCurrency(newCurrency);
            Alert.alert('Currency Changed', `Currency set to ${newCurrency}\n\nAll values will be displayed in ${newCurrency}`);
          }}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>💰 Currency</Text>
              <Text style={styles.settingDescription}>{selectedCurrency} - Tap to change</Text>
            </View>
            <Text style={styles.settingValue}>{selectedCurrency}</Text>
          </View>
        </TouchableOpacity>

        {/* Auto Refresh Selector */}
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => {
            const intervals = Object.keys(refreshIntervals);
            const currentIndex = intervals.indexOf(autoRefreshInterval);
            const nextIndex = (currentIndex + 1) % intervals.length;
            const newInterval = intervals[nextIndex];
            setAutoRefreshInterval(newInterval);
            Alert.alert('Auto Refresh', `Refresh interval set to ${refreshIntervals[newInterval]}`);
          }}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>🔄 Auto Refresh</Text>
              <Text style={styles.settingDescription}>Every {refreshIntervals[autoRefreshInterval]} - Tap to change</Text>
            </View>
            <Text style={styles.settingValue}>{refreshIntervals[autoRefreshInterval]}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Export Data', 'Feature coming soon!\n\nYou will be able to export:\n• Analytics data (CSV)\n• Revenue reports (PDF)\n• Subscription insights')}>
          <Text style={styles.actionButtonText}>📄 Export Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => Alert.alert(
            'Clear Cache', 
            'This will clear all cached data and refresh from RevenueCat.\n\nAre you sure?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Clear Cache', style: 'destructive', onPress: () => Alert.alert('Cache Cleared', 'All cached data has been cleared!')}
            ]
          )}>
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>🔄 Clear Cache</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Lumesix v1.0.0</Text>
        <Text style={styles.footerText}>Built for RevenueCat Shipaton 2025</Text>
      </View>
    </ScrollView>
  );
};

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardScreen onNavigateToInsights={() => setActiveTab('Insights')} />;
      case 'Insights':
        return <InsightsScreen />;
      case 'Metrics':
        return <MetricsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen onNavigateToInsights={() => setActiveTab('Insights')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="📊 Dashboard"
          isActive={activeTab === 'Dashboard'}
          onPress={() => setActiveTab('Dashboard')}
        />
        <TabButton
          title="🤖 Insights"
          isActive={activeTab === 'Insights'}
          onPress={() => setActiveTab('Insights')}
        />
        <TabButton
          title="📈 Metrics"
          isActive={activeTab === 'Metrics'}
          onPress={() => setActiveTab('Metrics')}
        />
        <TabButton
          title="⚙️ Settings"
          isActive={activeTab === 'Settings'}
          onPress={() => setActiveTab('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  screenSubtitle: {
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
    shadowOffset: { width: 0, height: 2 },
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.8,
  },
  metricLabelSecondary: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
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
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
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
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#34C759',
  },
  settingsContainer: {
    padding: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  expandedText: {
    fontSize: 14,
    color: '#6D6D80',
    marginBottom: 4,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationBox: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6D6D80',
    lineHeight: 18,
  },
  tapHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Period Selector Styles
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // Chart Styles
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  chartPlaceholder: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E7',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#6D6D80',
  },
  // Settings Styles
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5EA',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#34C759',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  actionsContainer: {
    margin: 16,
    gap: 12,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
});

export default App;
