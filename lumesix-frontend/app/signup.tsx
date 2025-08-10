import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Simple navigation to the main app screen after signup
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={[styles.logo, { tintColor: Colors.text }]} />
      <ThemedText type="title" style={{ color: Colors.text }}>Create your Account</ThemedText>

      <ThemedView style={[styles.formContainer, { backgroundColor: Colors.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: Colors.cardStroke, color: Colors.text }]} // Use cardStroke for input background
          placeholder="Full Name"
          placeholderTextColor={Colors.icon} // Placeholder color
          value={name}
          onChangeText={setName}
        />
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
        
        <TouchableOpacity style={[styles.signupButton, { backgroundColor: Colors.tint }]} onPress={handleSignup}>
          <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
        </TouchableOpacity>

        <Link href="/login" style={styles.loginLink}>
          <ThemedText style={{ color: Colors.text }}>Already have an account? <ThemedText type="link">Log In</ThemedText></ThemedText>
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
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  signupButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
  },
});