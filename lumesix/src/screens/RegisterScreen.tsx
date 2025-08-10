import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { apiService } from '../services/api';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.register(
        email.trim().toLowerCase(),
        password,
        firstName.trim(),
        lastName.trim()
      );
      
      if (response.success) {
        Alert.alert(
          'Account Created Successfully! 🎉',
          `Welcome to Lumesix, ${firstName}! Your account has been created.\n\nNext steps:\n• Sign in with your new credentials\n• Connect your RevenueCat account\n• Start getting AI-powered insights`,
          [{ text: 'Sign In Now', onPress: onRegisterSuccess }]
        );
      } else {
        Alert.alert('Registration Failed', response.message || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('already exists')) {
        Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
      } else {
        Alert.alert('Error', 'Failed to create account. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Join</Text>
          <Text style={styles.appName}>Lumesix</Text>
          <Text style={styles.subtitle}>Start your AI-powered subscription analytics journey</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="First name"
              placeholderTextColor="#A0A0A0"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              editable={!loading}
            />
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Last name"
              placeholderTextColor="#A0A0A0"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password (min. 6 characters)"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={onNavigateToLogin}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What you'll get:</Text>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureText}>AI-powered churn prediction</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Revenue optimization insights</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📈</Text>
            <Text style={styles.featureText}>Customer lifetime value analytics</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔗</Text>
            <Text style={styles.featureText}>Direct RevenueCat integration</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 8,
  },
  appName: {
    fontSize: 42,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 8,
  },
  form: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '48%',
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  loginLinkBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
  features: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  featureText: {
    color: '#A0A0A0',
    fontSize: 15,
    flex: 1,
  },
});

export default RegisterScreen;
