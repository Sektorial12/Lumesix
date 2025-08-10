import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('Loisbecket@gmail.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = () => {
    // Simple navigation to the main app screen
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={[styles.logo, { tintColor: Colors.text }]} />
      <ThemedText type="title" style={{ color: Colors.text }}>Sign in to your Account</ThemedText>
      <ThemedText style={[styles.subtitle, { color: Colors.text }]}>Enter your email and password to log in</ThemedText>

      <ThemedView style={[styles.formContainer, { backgroundColor: Colors.card }]}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: Colors.cardStroke }]}>
          <ThemedText style={{ color: Colors.text }}>Continue with Google</ThemedText>
        </TouchableOpacity>

        <ThemedText style={[styles.separator, { color: Colors.text }]}>Or login with</ThemedText>

        <TextInput
          style={[styles.input, { backgroundColor: Colors.cardStroke, color: Colors.text }]} // Use cardStroke for input background
          placeholder="Email"
          placeholderTextColor={Colors.icon} // Placeholder color
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { backgroundColor: Colors.cardStroke, color: Colors.text }]} // Use cardStroke for input background
          placeholder="Password"
          placeholderTextColor={Colors.icon} // Placeholder color
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={[styles.loginButton, { backgroundColor: Colors.tint }]} onPress={handleLogin}>
          <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
        </TouchableOpacity>

        <Link href="/signup" style={styles.signupLink}>
          <ThemedText style={{ color: Colors.text }}>Don't have an account? <ThemedText type="link">Sign Up</ThemedText></ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background, // Use the main background color
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  socialButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  separator: {
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  loginButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupLink: {
    marginTop: 20,
    textAlign: 'center',
  },
});