import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RevenueCatSetupScreen from '../screens/RevenueCatSetupScreen';
import { apiService } from '../services/api';

interface AuthWrapperProps {
  children: React.ReactNode;
}

type AuthState = 'loading' | 'login' | 'register' | 'revenuecat-setup' | 'authenticated';

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await apiService.isLoggedIn();
      
      if (!isLoggedIn) {
        console.log('🔑 User not logged in, showing login screen');
        setAuthState('login');
        return;
      }

      console.log('🔑 User is logged in, checking RevenueCat status');
      
      // Check if user has RevenueCat connected (only if authenticated)
      try {
        const revenueCatStatus = await apiService.getRevenueCatStatus();
        if (revenueCatStatus.success && revenueCatStatus.connected) {
          console.log('💰 RevenueCat already connected, going to main app');
          setAuthState('authenticated');
        } else {
          console.log('💰 RevenueCat not connected, showing setup screen');
          setAuthState('revenuecat-setup');
        }
      } catch (error) {
        console.log('💰 RevenueCat check failed, assuming not connected:', error);
        // If RevenueCat check fails, go to setup
        setAuthState('revenuecat-setup');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState('login');
    }
  };

  const handleLoginSuccess = async () => {
    console.log('✅ Login successful, checking RevenueCat status');
    // Give time for token to be stored, then check actual RevenueCat status
    setTimeout(async () => {
      try {
        const revenueCatStatus = await apiService.getRevenueCatStatus();
        console.log('💰 Post-login RevenueCat status:', revenueCatStatus);
        
        if (revenueCatStatus.success && revenueCatStatus.connected) {
          console.log('💰 User already has RevenueCat connected, going to main app');
          setAuthState('authenticated');
        } else {
          console.log('💰 User needs to connect RevenueCat, showing setup screen');
          setAuthState('revenuecat-setup');
        }
      } catch (error) {
        console.log('💰 RevenueCat check failed after login, showing setup screen:', error);
        // If check fails, default to setup screen
        setAuthState('revenuecat-setup');
      }
    }, 500); // Increased delay to ensure token is properly stored
  };

  const handleRegisterSuccess = () => {
    setAuthState('login');
  };

  const handleRevenueCatSetupComplete = () => {
    setAuthState('authenticated');
  };

  const handleRevenueCatSkip = () => {
    setAuthState('authenticated');
  };

  const handleLogout = async () => {
    await apiService.logout();
    setAuthState('login');
  };

  // Expose logout function globally for use in settings
  React.useEffect(() => {
    (global as any).handleLogout = handleLogout;
  }, []);

  if (authState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Lumesix...</Text>
      </View>
    );
  }

  if (authState === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthState('register')}
      />
    );
  }

  if (authState === 'register') {
    return (
      <RegisterScreen
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setAuthState('login')}
      />
    );
  }

  if (authState === 'revenuecat-setup') {
    return (
      <RevenueCatSetupScreen
        onSetupComplete={handleRevenueCatSetupComplete}
        onSkip={handleRevenueCatSkip}
      />
    );
  }

  // User is authenticated, show the main app
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0B0E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A0A0A0',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default AuthWrapper;
