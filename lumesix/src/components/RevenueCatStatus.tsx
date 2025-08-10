/**
 * RevenueCat Status Component
 * Shows integration status and data source indicator
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface RevenueCatStatusProps {
  isConnected: boolean;
  lastUpdated?: string;
  onRefresh?: () => void;
}

export const RevenueCatStatus: React.FC<RevenueCatStatusProps> = ({
  isConnected,
  lastUpdated,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, isConnected ? styles.connected : styles.disconnected]} />
        <Text style={styles.statusText}>
          {isConnected ? '🚀 RevenueCat Live Data' : '📊 Demo Mode'}
        </Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {lastUpdated && (
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </Text>
      )}
      
      {!isConnected && (
        <Text style={styles.demoNotice}>
          💡 Add RevenueCat API keys to see real subscription data
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#28A745',
  },
  disconnected: {
    backgroundColor: '#FFC107',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  demoNotice: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 6,
    fontStyle: 'italic',
  },
});

export default RevenueCatStatus;
