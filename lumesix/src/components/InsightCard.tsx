/**
 * Insight Card Component
 * Displays AI-generated insights with confidence and recommendations
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  type: 'churn' | 'price' | 'cohort' | 'seasonal';
  recommendation?: string;
  onPress?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  confidence,
  impact,
  type,
  recommendation,
  onPress,
}) => {
  const getInsightIcon = () => {
    switch (type) {
      case 'churn': return '⚠️';
      case 'price': return '💰';
      case 'cohort': return '👥';
      case 'seasonal': return '📈';
      default: return '🤖';
    }
  };

  const getImpactColor = () => {
    switch (impact) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return '#34C759';
    if (confidence >= 0.6) return '#FF9500';
    return '#FF3B30';
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{getInsightIcon()}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={[styles.impactBadge, { backgroundColor: getImpactColor() }]}>
          <Text style={styles.impactText}>{impact.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceLabel}>Confidence:</Text>
        <View style={styles.confidenceBar}>
          <View style={[
            styles.confidenceFill,
            { 
              width: `${confidence * 100}%`,
              backgroundColor: getConfidenceColor()
            }
          ]} />
        </View>
        <Text style={[
          styles.confidenceText,
          { color: getConfidenceColor() }
        ]}>
          {Math.round(confidence * 100)}%
        </Text>
      </View>

      {recommendation && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationLabel}>💡 Recommendation:</Text>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
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
  description: {
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
});

export default InsightCard;
