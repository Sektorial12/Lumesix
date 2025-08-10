import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { apiService } from '../services/api';

interface RevenueCatSetupScreenProps {
  onSetupComplete: () => void;
  onSkip?: () => void;
}

const RevenueCatSetupScreen: React.FC<RevenueCatSetupScreenProps> = ({ 
  onSetupComplete,
  onSkip 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const status = await apiService.getRevenueCatStatus();
      console.log('🔍 RevenueCatSetupScreen - Checking connection status:', status);
      
      if (status.success && status.connected) {
        console.log('✅ RevenueCat already connected, user should go to main app');
        setIsAlreadyConnected(true);
        // Automatically transition to main app if already connected
        setTimeout(() => {
          onSetupComplete();
        }, 1000);
      } else {
        console.log('⚠️ RevenueCat not connected, showing setup form');
        setIsAlreadyConnected(false);
      }
    } catch (error) {
      console.log('❌ RevenueCat status check failed:', error);
      setIsAlreadyConnected(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your RevenueCat API key');
      return;
    }

    if (!apiKey.startsWith('sk_')) {
      Alert.alert(
        'Invalid API Key Format',
        'RevenueCat API keys typically start with "sk_". Please check your key and try again.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.connectRevenueCat(apiKey.trim());
      
      if (response.success) {
        Alert.alert(
          'Connected Successfully! 🎉',
          'Your RevenueCat account has been connected. You can now access AI-powered insights from your subscription data.',
          [{ text: 'Continue', onPress: onSetupComplete }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          response.message || 'Failed to connect to RevenueCat. Please check your API key and try again.'
        );
      }
    } catch (error) {
      console.error('RevenueCat connection error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to RevenueCat. Please check your connection and API key, then try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetApiKey = () => {
    Alert.alert(
      'Get Your RevenueCat API Key',
      'You can find your API key in the RevenueCat dashboard under Settings → API Keys → Secret Keys',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open RevenueCat', 
          onPress: () => Linking.openURL('https://app.revenuecat.com/settings/api-keys')
        }
      ]
    );
  };

  const handleTestApiKey = () => {
    Alert.alert(
      'Test with Demo API Key',
      'Use "sk_test_demo_key_12345" to test the connection flow with mock data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Demo Key', 
          onPress: () => setApiKey('sk_test_demo_key_12345')
        }
      ]
    );
  };

  if (checkingStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking RevenueCat connection...</Text>
      </View>
    );
  }

  if (isAlreadyConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>RevenueCat Connected</Text>
          <Text style={styles.successText}>
            Your RevenueCat account is already connected and ready for AI-powered analytics.
          </Text>
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onSetupComplete}
          >
            <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect RevenueCat</Text>
        <Text style={styles.subtitle}>
          Link your RevenueCat account to unlock AI-powered subscription analytics and insights
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>RevenueCat Secret API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="sk_your_secret_key_here"
          placeholderTextColor="#A0A0A0"
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          editable={!loading}
          multiline={true}
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.buttonDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.connectButtonText}>Connect Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.helpButtons}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleGetApiKey}
            disabled={loading}
          >
            <Text style={styles.helpButtonText}>🔑 Get API Key</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleTestApiKey}
            disabled={loading}
          >
            <Text style={styles.helpButtonText}>🧪 Test Demo</Text>
          </TouchableOpacity>
        </View>

        {onSkip && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>What you'll unlock:</Text>
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>🤖</Text>
          <Text style={styles.benefitText}>AI churn prediction for your customers</Text>
        </View>
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>💰</Text>
          <Text style={styles.benefitText}>Revenue optimization recommendations</Text>
        </View>
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>📊</Text>
          <Text style={styles.benefitText}>Real-time subscription analytics</Text>
        </View>
        <View style={styles.benefit}>
          <Text style={styles.benefitIcon}>🎯</Text>
          <Text style={styles.benefitText}>Customer segmentation insights</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0B0E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  benefits: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  benefitsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  benefitText: {
    color: '#A0A0A0',
    fontSize: 15,
    flex: 1,
  },
});

export default RevenueCatSetupScreen;
