import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { FlatList, StyleSheet, View, Image } from 'react-native';

const subscriptions = [
  { id: '1', name: 'Netflix', date: 'Jun 24, 14:00 pm', price: '24.00', currency: 'per month', color: '#e57373', icon: 'https://cdn.icon-icons.com/icons2/3053/PNG/512/netflix_macos_bigsur_icon_189912.png' },
  { id: '2', name: 'Spotify', date: 'Jun 24, 14:00 pm', price: '8.99', currency: 'per month', color: '#81c784', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png' },
  { id: '3', name: 'Medium', date: 'Jun 24, 14:00 pm', price: '36.00', currency: 'per month', color: '#64b5f6', icon: 'https://miro.medium.com/v2/resize:fit:2400/1*sHhtYhaCe2Uc3IU0IgKwIQ.png' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Jessica Marrel</ThemedText>
        <View style={styles.headerPlus}><ThemedText>+</ThemedText></View>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: Colors.tint }]}>
        <ThemedText style={styles.balanceTitle}>Balance</ThemedText>
        <ThemedText style={styles.balanceAmount}>$180.60</ThemedText>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">All Subscriptions</ThemedText>
        <ThemedText type="link">View all</ThemedText>
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.subCard, { backgroundColor: item.color }]}>
            <Image source={{ uri: item.icon }} style={styles.subIcon} />
            <View style={styles.subDetails}>
              <ThemedText style={styles.subName}>{item.name}</ThemedText>
              <ThemedText style={styles.subDate}>{item.date}</ThemedText>
            </View>
            <View style={styles.subPriceContainer}>
              <ThemedText style={styles.subPrice}>${item.price}</ThemedText>
              <ThemedText style={styles.subCurrency}>{item.currency}</ThemedText>
            </View>
          </View>
        )}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerPlus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  balanceTitle: {
    color: 'white',
    opacity: 0.8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  subIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
  },
  subDetails: {
    flex: 1,
  },
  subName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subDate: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
  },
  subPriceContainer: {
    alignItems: 'flex-end',
  },
  subPrice: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subCurrency: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
  },
});