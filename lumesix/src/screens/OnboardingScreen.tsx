/**
 * Onboarding Screen
 * Welcome and setup flow for new users
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  component: React.ReactNode;
}

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [revenueCatApiKey, setRevenueCatApiKey] = useState('');
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!revenueCatApiKey.trim() || !appName.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Save onboarding data and validate API key
      // await AsyncStorage.setItem('onboarding_completed', 'true');
      // await AsyncStorage.setItem('revenuecat_api_key', revenueCatApiKey);
      // await AsyncStorage.setItem('app_name', appName);
      
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Onboarding completed');
      // TODO: Navigate to main app
    } catch (error) {
      Alert.alert('Setup Error', 'Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const WelcomeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🚀</Text>
      <Text style={styles.stepTitle}>Welcome to Lumesix</Text>
      <Text style={styles.stepDescription}>
        Transform your RevenueCat subscription data into actionable insights with AI-powered analytics.
      </Text>
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureText}>Real-time analytics dashboard</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🤖</Text>
          <Text style={styles.featureText}>AI-powered insights and predictions</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Smart notifications and alerts</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureText}>Revenue optimization recommendations</Text>
        </View>
      </View>
    </View>
  );

  const SetupStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>⚙️</Text>
      <Text style={styles.stepTitle}>Connect Your App</Text>
      <Text style={styles.stepDescription}>
        Enter your RevenueCat API credentials to start analyzing your subscription data.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>App Name</Text>
        <TextInput
          style={styles.input}
          placeholder="My Awesome App"
          value={appName}
          onChangeText={setAppName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>RevenueCat API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="sk_1234567890abcdef..."
          value={revenueCatApiKey}
          onChangeText={setRevenueCatApiKey}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.inputHelp}>
          Find your API key in RevenueCat Dashboard → Settings → API Keys
        </Text>
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your API key is stored securely on your device and never shared with third parties.
        </Text>
      </View>
    </View>
  );

  const ReadyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.stepTitle}>You're All Set!</Text>
      <Text style={styles.stepDescription}>
        Lumesix is ready to analyze your subscription data and provide AI-powered insights.
      </Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>App Name:</Text>
          <Text style={styles.summaryValue}>{appName}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>API Key:</Text>
          <Text style={styles.summaryValue}>
            {revenueCatApiKey ? '••••••••••••' + revenueCatApiKey.slice(-4) : 'Not set'}
          </Text>
        </View>
      </View>

      <View style={styles.nextStepsContainer}>
        <Text style={styles.nextStepsTitle}>What's Next:</Text>
        <Text style={styles.nextStepsItem}>• View your analytics dashboard</Text>
        <Text style={styles.nextStepsItem}>• Explore AI-generated insights</Text>
        <Text style={styles.nextStepsItem}>• Set up smart notifications</Text>
        <Text style={styles.nextStepsItem}>• Optimize your revenue strategy</Text>
      </View>
    </View>
  );

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome',
      subtitle: 'Get started with Lumesix',
      component: <WelcomeStep />,
    },
    {
      id: 1,
      title: 'Setup',
      subtitle: 'Connect your RevenueCat account',
      component: <SetupStep />,
    },
    {
      id: 2,
      title: 'Ready',
      subtitle: 'Start analyzing your data',
      component: <ReadyStep />,
    },
  ];

  const canProceed = () => {
    if (currentStep === 1) {
      return revenueCatApiKey.trim() && appName.trim();
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {steps[currentStep].component}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
              currentStep === 0 && styles.nextButtonFull
            ]}
            onPress={handleNext}
            disabled={!canProceed() || loading}>
            <Text style={[
              styles.nextButtonText,
              !canProceed() && styles.nextButtonTextDisabled
            ]}>
              {loading ? 'Setting up...' : 
               currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flex: 1,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F2F2F7',
  },
  inputHelp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    lineHeight: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  securityText: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    lineHeight: 20,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  nextStepsContainer: {
    width: '100%',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  nextStepsItem: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonFull: {
    marginLeft: 0,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default OnboardingScreen;
