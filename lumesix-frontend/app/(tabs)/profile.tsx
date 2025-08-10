import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder profile picture
          style={styles.profilePicture}
        />
        <ThemedText type="title" style={{ color: Colors.text }}>Jessica Marrel</ThemedText>
        <ThemedText style={{ color: Colors.icon }}>jessica.marrel@example.com</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={{ color: Colors.text }}>Account Settings</ThemedText>
        <TouchableOpacity style={styles.optionRow}>
          <ThemedText style={{ color: Colors.text }}>Edit Profile</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <ThemedText style={{ color: Colors.text }}>Change Password</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <ThemedText style={{ color: Colors.text }}>Notification Preferences</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={{ color: Colors.text }}>Support</ThemedText>
        <TouchableOpacity style={styles.optionRow}>
          <ThemedText style={{ color: Colors.text }}>Help & FAQ</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <ThemedText style={{ color: Colors.text }}>Contact Us</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
  },
  optionRow: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  logoutButton: {
    backgroundColor: Colors.tint,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
