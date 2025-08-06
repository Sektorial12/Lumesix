/**
 * Simple Test App
 * Basic React Native app to test if compilation works
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>🚀 Lumesix</Text>
          <Text style={styles.subtitle}>AI-Powered Subscription Analytics</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Dashboard</Text>
            <Text style={styles.cardDescription}>
              View your subscription analytics and key metrics
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🤖 AI Insights</Text>
            <Text style={styles.cardDescription}>
              Get AI-powered insights and recommendations
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 Metrics</Text>
            <Text style={styles.cardDescription}>
              Detailed analytics and performance tracking
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Built for RevenueCat Shipaton 2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
  },
  footer: {
    marginTop: 32,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default App;
