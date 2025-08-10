import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Abstract background shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      <View style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Streamline your subscriptions, simplify your life
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <ThemedText style={styles.buttonText}>Get started</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#e0f2f1', // A light mint color
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  shape: {
    position: 'absolute',
    opacity: 0.8,
  },
  shape1: {
    backgroundColor: '#ffab91', // Light orange
    width: width * 1.5,
    height: height * 0.7,
    top: -height * 0.25,
    left: -width * 0.1,
    transform: [{ rotate: '-30deg' }],
  },
  shape2: {
    backgroundColor: '#fff59d', // Light yellow
    width: width * 1.2,
    height: height * 0.5,
    top: -height * 0.1,
    right: -width * 0.15,
    transform: [{ rotate: '20deg' }],
  },
  shape3: {
    backgroundColor: '#80cbc4', // Teal
    width: width * 1.0,
    height: height * 0.4,
    top: height * 0.05,
    left: -width * 0.2,
    transform: [{ rotate: '10deg' }],
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004d40', // Dark teal
    marginBottom: 30,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#004d40',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
