/**
 * Metric Card Component
 * Reusable card for displaying metrics
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  onPress?: () => void;
  style?: any;
  variant?: 'primary' | 'secondary';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  onPress,
  style,
  variant = 'secondary',
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return '#34C759';
      case 'negative': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        variant === 'primary' && styles.primaryCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      
      <Text style={[
        styles.title,
        variant === 'primary' && styles.primaryTitle,
      ]}>
        {title}
      </Text>
      
      <Text style={[
        styles.value,
        variant === 'primary' && styles.primaryValue,
      ]}>
        {value}
      </Text>
      
      {change && (
        <Text style={[
          styles.change,
          variant === 'primary' && styles.primaryChange,
          { color: variant === 'primary' ? 'rgba(255,255,255,0.8)' : getChangeColor() }
        ]}>
          {change}
        </Text>
      )}
      
      {subtitle && (
        <Text style={[
          styles.subtitle,
          variant === 'primary' && styles.primarySubtitle,
        ]}>
          {subtitle}
        </Text>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  title: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  primaryTitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  primaryValue: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryChange: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  primarySubtitle: {
    color: 'rgba(255,255,255,0.7)',
  },
});

export default MetricCard;
